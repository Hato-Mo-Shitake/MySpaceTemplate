class MocNoteStar {

    constructor() {
        console.log("MocNoteStar is instantiated.");
    }

    createInstance(schema, dv, file) {
        const mocNoteClass = this.getNoteClass();
        const myNote = new mocNoteClass(schema, dv, file);

        myNote.addChildMocNotes();
        myNote.sortChildMocNotes
        myNote.addAllDescendantMocNotes();

        myNote.addChildContNotes();

        myNote.addParentMocNotes();
        myNote.addSiblingMocNotes();
        return myNote;
    }

    getNoteClass() {
        return this.#MocNote;
    }

    #MocNote = class {
        #schema;
        #dv;
        #inLinkFiles;

        constructor(schema, dv, file) {
            if (!schema) {
                throw new Error('schema is invalid.');
            }
            if (!dv) {
                throw new Error('dv is invalid.');
            }
            if (!file) {
                throw new Error('file is invalid.');
            }
            this.#schema = schema;
            this.#dv = dv;
            this.noteType = 'MOCs';
            this.file = file;

            this.childMocNotes = [];
            this.childContNotes = [];

            this.parentMocNotes = [];
            this.siblingMocNotes = [];
            this.#inLinkFiles = [];
        }

        addChildMocNotes() {
            if (!this.#inLinkFiles?.length) {
                this.#addInlinkFiles();
            }
            this.#inLinkFiles.forEach(f => {
                // belongsToに現在ファイルへのリンクを持つものが子MOCファイル。プッシュする。
                if (
                    f.frontmatter?.belongsTo?.some(innerlink => {
                        return this.#isPathMatch(this.file?.path, this.#extractPathFromInnerLink(innerlink))
                    })
                ) {
                    this.childMocNotes.push(new this.constructor(this.#schema, this.#dv, f));
                }
            });
        }

        sortChildMocNotes() {
            // ファイルの更新順にソート
            this.childMocNotes = this.childMocNotes.sort((a, b) => b.file.mtime.ts - a.file.mtime.ts);
        }

        addChildContNotes() {
            const fileNmae = this.file.name;
            const contentTag = this.#schema[fileNmae];
            const files = this.#dv.pages('#' + contentTag).values
                .sort((a, b) => b.file.mtime.ts - a.file.mtime.ts);

            this.childContNotes.push(...files);
        }

        #addInlinkFiles() {
            this.file.inlinks?.forEach(inlink => {
                // バックリンク先のファイルを取得。
                const inlinkFile = this.#dv.page(inlink.path)?.file;
                if (inlinkFile) {
                    this.#inLinkFiles.push(inlinkFile)
                }
            });
        }

        addParentMocNotes() {
            const belongsTo = this.file.frontmatter.belongsTo;
            if (!belongsTo || belongsTo?.length == 0) {
                return;
            }
            if (this.file.outlinks.length == 0) {
                return
            }

            const parantPaths = belongsTo
                .map(to => this.#extractPathFromInnerLink(to)) //パスだけを取り出す。
                .filter(p => p && !this.#isPathMatch(this.file.path, p)); // nullじゃない、かつ、自分自身じゃない


            // チェックするoutlinksの重複を防ぐ。
            const uniqueOutlinks = [];
            this.file.outlinks.forEach(outL => {
                if (uniqueOutlinks.filter(uniL => uniL.path === outL.path).length === 0) {
                    uniqueOutlinks.push(outL);
                }
            })

            uniqueOutlinks.forEach(outlink => {
                const outlinkFile = this.#dv.page(outlink.path)?.file;
                // 実体のないリンクだと、outLinkFileにはundefinedが入っている。この状態でisPathMatchを使うとエラー。
                if (outlinkFile && parantPaths.some(pPath => this.#isPathMatch(outlinkFile?.path, pPath))) {
                    const pNote = new this.constructor(this.#schema, this.#dv, outlinkFile);
                    pNote.addChildMocNotes();
                    pNote.sortChildMocNotes();
                    this.parentMocNotes.push(pNote);
                }
            })
        }

        addSiblingMocNotes() {
            if (!this.parentMocNotes.length) {
                this.addParentMocNotes();
            }

            this.parentMocNotes.forEach(p => {
                const cuttedMySelfPChidren = p.childMocNotes.filter(n => n.file.path !== this.file.path);
                this.siblingMocNotes.push(...cuttedMySelfPChidren);
            });
        }

        addAllDescendantMocNotes(hierarchy = 0, limiter = 50) {
            hierarchy++;
            if (hierarchy > limiter) return;

            this.childMocNotes.forEach(n => {
                if (!n.childMocNotes.length) {
                    n.addChildMocNotes();
                    n.addAllDescendantMocNotes(hierarchy, limiter);
                }
            });
        }

        print() {
            const mainMoc = '🌐Galaxies';
            const isMain = this.file.name === mainMoc;

            if (
                !isMain && this.parentMocNotes.some(n => n.file.name !== mainMoc)
            ) {
                this.#dv.el("b", `######  ⇒ [[Searchlights/${mainMoc}|${mainMoc}]]`);
            }

            this.printConnectedMocNotes();

            if (!isMain) {
                this.printChildContNotes()
            }
        }

        printConnectedMocNotes() {
            this.printNoteLinks('Parent MOC', this.parentMocNotes);
            this.printAllDescendantMocNoteLinks();
            this.printNoteLinks('Sibling MOCs', this.siblingMocNotes);
        }

        printChildContNotes(limit = 50) {
            this.#dv.el(
                'd',
                `## Content Notes (count: ${this.childContNotes.length} | maxDisplay: ${limit})`
            );
            this.#dv.list(this.childContNotes.slice(0, limit).map(f => f.file.link));
        }

        printNoteLinks(header, myNotes) {
            if (myNotes?.length) {
                let output = '';
                output += `## ${header}\n`
                myNotes.forEach(n => {
                    output += `- ${n.file?.link}\n`
                })
                this.#dv.el('d', output);
            }
        }

        getAllDescendantMocNoteLinks(output = '', indent = '') {
            if (this.childMocNotes.length !== 0) {
                this.childMocNotes.forEach(n => {
                    output += `${indent}- ${n.file?.link}`;
                    output = n.getAllDescendantMocNoteLinks(output + '\n', indent + '\t');
                });
            }

            return output;
        }

        /**
         * セットされている子々孫々MOCノートをリスト
         */
        printAllDescendantMocNoteLinks() {
            if (this.childMocNotes.length !== 0) {
                let output = '';
                output += `## Child MOCs\n`
                output += this.getAllDescendantMocNoteLinks();
                this.#dv.el("d", output);
            }
        }

        /**
         * サテライト候補
         * 
         * 内部リンクからリンク先を切り出して返す。
         * @param {string} linkText 
         * @returns {string|null} リンク先
         */
        #extractPathFromInnerLink(linkText) {
            const match = linkText.match(/^\[\[([^\[\]\|]+)(?:\|[^\[\]]+)?\]\]$/);
            return match ? match[1] : null;
        }

        /**
         * サテライト候補
         * 
         * 後方一致優先でパスを比較する。
         * 
         * @param {string} targetPath 
         * @param {string} testPath 
         * @returns {boolean}
         */
        #isPathMatch(targetPath, testPath, suffix = '.md') {
            if (!targetPath.endsWith(suffix)) {
                targetPath = targetPath + suffix;
            }
            if (!testPath.endsWith(suffix)) {
                testPath = testPath + suffix;
            }

            const tParts = targetPath.split('/');
            const pParts = testPath.split('/');

            // testPath の方が長かったら一致するはずがない
            if (pParts.length > tParts.length) return false;

            // 後ろから比較
            for (let i = 1; i <= pParts.length; i++) {
                if (tParts[tParts.length - i] !== pParts[pParts.length - i]) {
                    return false;
                }
            }

            return true;
        }
    }
}
