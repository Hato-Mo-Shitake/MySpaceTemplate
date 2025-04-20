class MyNoteStar {

    constructor() {
        console.log("MyNoteStar is instantiated.");
    }

    createInstance(schema, dv, file) {
        const myNoteClass = this.getNoteClass();
        const myNote = new myNoteClass(schema, dv, file);

        myNote.addChildNotes();
        myNote.sortChildNotes();

        myNote.addRelatedNotes();
        myNote.sortRelatedNotes();

        myNote.addParentNotes();
        myNote.addSiblingNotes();
        return myNote;
    }

    getNoteClass() {
        return this.#MyNote;
    }

    #MyNote = class {
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

            if (file.frontmatter?.tags) {
                this.noteType = schema.childNotes[file.frontmatter?.tags[0]]?.noteType || 'MyNote';
            } else {
                this.noteType = 'MyNote';
            }

            this.file = file;

            this.parentNotes = [];
            this.childNotes = [];
            this.siblingNotes = [];
            this.relatedNotes = [];
            this.#inLinkFiles = [];
        }

        addChildNotes() {
            if (!this.#inLinkFiles?.length) {
                this.#addInlinkFiles();
            }
            this.#inLinkFiles.forEach(f => {
                // belongsToに現在ファイルへのリンクを持つものが子ファイル。プッシュする。
                if (
                    f.frontmatter?.belongsTo?.some(innerlink => {
                        return this.#isPathMatch(this.file?.path, this.#extractPathFromInnerLink(innerlink))
                    })
                ) {
                    this.childNotes.push(new this.constructor(this.#schema, this.#dv, f));
                }
            });
        }

        sortChildNotes() {
            // ファイルの更新順にソート
            this.childNotes = this.childNotes.sort((a, b) => b.file.mtime.ts - a.file.mtime.ts);
        }

        addRelatedNotes() {
            if (!this.#inLinkFiles?.length) {
                this.#addInlinkFiles();
            }
            this.#inLinkFiles.forEach(f => {
                // relatesToに現在ファイルへのリンクを持つものが子ファイル。プッシュする。
                if (f.frontmatter?.relatesTo?.some(item => item?.path === this.file?.path)) {
                    this.relatedNotes.push(new this.constructor(this.#schema, this.#dv, f));
                }
            });
        }

        sortRelatedNotes() {
            // ファイルの更新順にソート
            this.relatedNotes = this.relatedNotes.sort((a, b) => b.file.mtime.ts - a.file.mtime.ts);
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

        addParentNotes() {
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
                    pNote.addChildNotes();
                    pNote.sortChildNotes();
                    this.parentNotes.push(pNote);
                }
            })
        }

        addSiblingNotes() {
            if (!this.parentNotes.length) {
                this.addParentNotes();
            }

            this.parentNotes.forEach(p => {
                const cuttedMySelfPChidren = p.childNotes.filter(n => n.file.path !== this.file.path);
                this.siblingNotes.push(...cuttedMySelfPChidren);
            });
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

        /**
         * ノートにおけるフロントマターのすぐ下の部分の表示
         */
        printTopSection() {
            const d = new Date();
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const todayDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}_${days[d.getDay()]}`;

            const dailyTFile = this.#dv.app.vault.getFileByPath(`DailyLogs/${todayDate}.md`);
            if (!dailyTFile) {
                this.#dv.el("b", "# No DailyLog Today!!");
                return;
            } else {
                this.#dv.el("b", `###### DalyLog`);
                this.#dv.el("d", `- today : [[${todayDate}]]\n- created : ${this.file.frontmatter.created}`);
            }

            this.#dv.el("b", `###### Note Type : [[AstraSystems/Orbits/NoteTypes/${this.noteType}|${this.noteType}]]`);

            this.printNoteLinks('parents', this.parentNotes);
            this.printNoteLinks('children', this.childNotes);
            this.printNoteLinks('siblings', this.siblingNotes);
            this.printNoteLinks('related to', this.relatedNotes);
        }

        printNoteLinks(header, myNotes) {
            if (myNotes?.length) {
                let output = '';
                output += `## ${header}\n`
                myNotes.forEach(n => {
                    output += `- ${n.file?.link}（${n.noteType}）\n`
                })
                this.#dv.el('d', output);
            }
        }

        // /**
        //  * 
        //  * @returns {Array}
        //  */
        // getChildLinks() {
        //     let links = [];
        //     this.childNotes?.forEach(myNote => {
        //         links.push(myNote.file?.link);
        //     });
        //     return links;
        // }

        // /**
        //  * 直下子ノートのリンクをリスト
        //  */
        // printChildLinks() {
        //     if (this.childNotes.length === 0) {
        //         this.dv.el("b", 'No Note');
        //     } else {
        //         const output = this.getChildLinks();
        //         this.dv.list(output);
        //     }
        // }

        // /**
        //  * 
        //  * @returns {Array}
        //  */
        // getRelatedLinks() {
        //     let links = [];
        //     this.relatedNotes?.forEach(myNote => {
        //         links.push(myNote.file?.link);
        //     });
        //     return links;
        // }

        // /**
        //  * 直接relateされているノートのリンクをリスト
        //  */
        // printRelatedLinks() {
        //     if (this.relatedNotes.length === 0) {
        //         this.dv.el("b", 'No Note');
        //     } else {
        //         const output = this.getRelatedLinks();
        //         this.dv.list(output);
        //     }
        // }

        // /**
        //  * 
        //  * @param {string} output 
        //  * @param {string} indent 
        //  * @returns {string}
        //  */
        // getAllDescendantLinks(output = '', indent = '') {
        //     if (this.childNotes.length !== 0) {
        //         this.childNotes.forEach(myNote => {
        //             output += `${indent}- ${myNote.file?.link}`;
        //             output = myNote.getAllDescendantLinks(output + '\n', indent + '\t');
        //         });
        //     }

        //     return output;
        // }

        // /**
        //  * セットされている子々孫々ノートをリスト
        //  */
        // printAllDescendantLinks() {
        //     if (this.childNotes.length === 0) {
        //         this.dv.el("b", 'No Note');
        //     } else {
        //         const output = this.getAllDescendantLinks();
        //         this.dv.el("d", output);
        //     }
        // }
    }
}
