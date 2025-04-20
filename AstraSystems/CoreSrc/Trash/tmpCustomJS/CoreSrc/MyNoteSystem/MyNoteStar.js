class MyNoteStar {

    #cachedSchema;

    constructor() {
        this.#cachedSchema = '';
        console.log("MyNoteStar is instantiated.");
    }

    setSchema(schema) {
        if (!this.#cachedSchema.schema) {
            this.#cachedSchema.schema = schema;
        }
    }

    // setDv(dv) {
    //     if (!this.#dependencies.dv) {
    //         this.#dependencies.dv = dv;
    //     }
    // }

    // なんでか分からないけど、dvを上記のようにキャッシュして持っておくと、Obsidian側で再レンダリングすると上手く表示されなくなる。
    // 想像だけど、dvがシングルトンなのは、再レンダリングされるまでなのかな？　だから再レンダリングするとつじつまが合わなくなって破綻する。
    // だから、毎回注入しないといけないっぽい。
    // だから、dvは、他のStarみたいなDI必須のモノとして扱うことにする。現時点でキャッシュするのはスキーマだけにしようか
    // あと、いい発見もあって、dvはこのなかに色々お得な情報を保持してそうだから、これ上手く活用できるかも
    // あ！！！！！　dvのなかに、dv.app.vaultがある！！！！ ワークスペースもあるな
    // てか、ふつうに、現在のファイルパスとかも持ってる。ここからcurrent()してるんか
    // setDv(dv) {
    //     this.#dependencies.dv = dv;
    // }

    createMyNoteInstance(file) {
        const myNote = new this.#MyNote(this.#cachedSchema, dv, file);
        myNote.addConnectedNotesFromInlinks();
        // myNote.addParentAndSiblingNotes();
        return myNote;
    }

    getMyNoteClass() {
        return this.#MyNote;
    }

    // 最低限の機能で完結させる。子々孫々まで辿っていくは、ラッピングで上手く実現する。
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

            this.noteType = schema[file.frontmatter.tags[0]]?.type || 'MyNote';
            this.file = file;

            this.parentNotes = [];
            this.childNotes = [];
            this.siblingNotes = [];
            this.relatedNotes = [];


            file.inlinks?.forEach(inlink => {
                // バックリンク先のファイルを取得。
                const inlinkFile = this.dv.page(inlink.path)?.file;

                this.#inLinkFiles.push(

                )


            });
        }

        addChildNotes() {
            if (this.file.inlinks.length !== 0) {
                this.file.inlinks?.forEach(inlink => {
                    // バックリンク先のファイルを取得。
                    const inlinkFile = this.dv.page(inlink.path);

                    // belongsToに現在ファイルへのリンクを持つものが子ファイル。プッシュする。
                    if (inlinkFile['belongsTo']?.some(to => to?.path === this.file?.path)) {
                        this.childNotes.push(
                            new this.constructor(this.#schema, inlinkFile.file)
                        );
                    }
                });
            }

            // ファイルの更新順にソートしてセット
            this.childNotes = this.childNotes.sort((a, b) => b.file.mtime.ts - a.file.mtime.ts);
        }

        addConnectedNotesFromInlinks() {
            if (this.file.inlinks.length !== 0) {
                this.file.inlinks?.forEach(inlink => {
                    // バックリンク先のファイルを取得。
                    const inlinkFile = this.dv.page(inlink.path);

                    // belongsToに現在ファイルへのリンクを持つものが子ファイル。プッシュする。
                    if (inlinkFile['belongsTo']?.some(to => to?.path === this.file?.path)) {
                        this.childNotes.push(
                            new this.constructor(this.#schema, inlinkFile.file)
                        );
                    }

                    // relatesToに現在ファイルへのリンクを持つものが関連ファイル。プッシュする。
                    if (inlinkFile['relatesTo']?.some(to => to?.path === this.file?.path)) {
                        this.relatedNotes.push(
                            new this.constructor(this.#schema, this.dv, inlinkFile.file)
                        );
                    }
                });
            }

            // ファイルの更新順にソートしてセット
            this.childNotes = this.childNotes.sort((a, b) => b.file.mtime.ts - a.file.mtime.ts);
            this.relatedNotes = this.childNotes.sort((a, b) => b.file.mtime.ts - a.file.mtime.ts);
        }

        addParentAndSiblingNotes() {
            if (!belongsTo || belongsTo?.length == 0) {
                return;
            }

            const belongsTo = this.file.frontmatter.belongsTo;
            const parantPaths = belongsTo
                .map(to => this.#extractPathFromInnerLink(to)) //パスだけを取り出す。
                .filter(p => p && !this.#isPathMatch(this.file.path, p)); // nullじゃない、かつ、自分自身じゃない

            if (this.file.outlinks.length !== 0) {
                // チェックするoutlinksの重複を防ぐ。
                const uniqueOutlinks = [];
                this.file.outlinks.forEach(outL => {
                    if (uniqueOutlinks.filter(uniL => uniL.path === outL.path).length === 0) {
                        uniqueOutlinks.push(outL);
                    }
                })

                uniqueOutlinks.forEach(outlink => {
                    const outlinkFile = this.dv.page(outlink.path)?.file;
                    // 実体のないリンクだと、outLinkFileにはundefinedが入っている。
                    if(parantPaths.some(pPath => this.#isPathMatch(outlinkFile?.path, pPath))){
                        const pNote = new this.constructor(this.#schema, this.#dv, outlinkFile);
                        // やっぱ、子と関連の追加分けた方がいいかな。。。
                        p.addConnectedNotesFromInlinks();


                        this.parentNotes.push(
                            new this.constructor(this.#schema, this.#dv, outlinkFile)
                        );
                    }
                })
            }
            this.parentNotes.forEach(p => {
                const cuttedMySelf = p.childNotes.filter(n => n.file.path !== this.file.path);
                this.siblingNotes.push(...cuttedMySelf);
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
         * 後方一致優先でパスを比較する
         * @param {string} targetPath 
         * @param {string} testPath 
         * @returns {boolean}
         */
        #isPathMatch(targetPath, testPath) {
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
        


        #getNameFromInternalLinkPath(iLpath) {
            const pathAndAlias = iLpath.slice(2, -2);
            const aliasIndex = pathAndAlias.lastIndexOf('|');
            if (aliasIndex > -1) {
                return pathAndAlias.slice(aliasIndex + 1);;
            }

            const lastSlaIndex = pathAndAlias.lastIndexOf('/');
            return pathAndAlias.slice(lastSlaIndex + 1);
        }

        /**
         * Inboxノートにおけるフロントマターのすぐ下の部分の表示
         */
        printTopSection() {
            console.log('this is print top section')
            this.#dv.el("b", `###### Note Type : [[System/Orbits/NoteTypes/${this.noteType}|${this.noteType}]]`);

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
