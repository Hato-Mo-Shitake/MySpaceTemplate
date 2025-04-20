class MyNoteModule {
    constructor() {
        this.cachedSchema = '';
        console.log("MyNoteModule is instantiated.");
    }

    /**
     * 
     * @param {DataviewInlineApi} dv 
     * @param {file} file EX: dv.current().file
     * @param {int} childLimiter 
     * @param {int} relatedLimiter 
     * @param {int} hierarchy 
     * @returns {MyNote} instance
     */
    createInstance(dv, file, schema, childLimiter = 1, relatedLimiter = 1, hierarchy = 1) {
        return new MyNoteModule.MyNote(dv, file, schema, childLimiter, relatedLimiter, hierarchy);
    }

    /**
     * @returns {MyNote} class
     */
    getNoteClass() {
        return MyNoteModule.MyNote;
    }

    static getNameFromInternalLinkPath = function (iLpath) {
        const pathAndAlias = iLpath.slice(2, -2);
        const aliasIndex = pathAndAlias.lastIndexOf('|');
        if (aliasIndex > -1) {
            return pathAndAlias.slice(aliasIndex + 1);;
        }

        const lastSlaIndex = pathAndAlias.lastIndexOf('/');
        return pathAndAlias.slice(lastSlaIndex + 1);
    }

    /**
     * @class
     */
    static MyNote = class {
        /**
         * 
         * @param {DataviewInlineApi} dv 
         * @param {file} file EX: dv.current().file
         * @param {int} childLimiter 
         * @param {int} relatedLimiter 
         * @param {int} hierarchy 
         */
        constructor(dv, file, schema, childLimiter = 1, relatedLimiter = 1, hierarchy = 1) {
            this.dv = dv;
            this.file = file;
            this.noteTypeAlias = schema[file.frontmatter.tags[0]]?.alias || '';
            this.hierarchy = hierarchy;

            let children = [];
            let relateds = [];

            const pushConnectedNote = function (targetArr, inlinkFile, propName) {
                let limiter = 0;
                if (propName === 'belongsTo') {
                    limiter = childLimiter;
                } else if (propName === 'relatesTo') {
                    limiter = relatedLimiter;
                } else {
                    throw new Error('The limiter is not found.');
                }

                // belingsToの値が配列ではなく文字列の場合、「TypeError: inlinkFile[propName]?.some is not a function」が出る。。。
                if (
                    inlinkFile[propName]?.some(to => to?.path === file?.path) && hierarchy <= limiter
                ) {
                    targetArr.push(
                        new MyNoteModule.MyNote(dv, inlinkFile.file, schema, childLimiter, relatedLimiter, hierarchy + 1)
                    );
                }
            }

            // const getNameFromInternalLinkPath = function (iLpath) {
            //     const path = iLpath.slice(2, -2);
            //     const index = path.lastIndexOf('/');
            //     const name = path.slice(index + 1);
            //     return name;
            // }

            // TODO:循環参照の問題解決してない。子の子孫が親だったら、無限ループに入りそう
            // 要するに、自分の子孫に自分が出てこないようにすればいいんだけど。とりあえずは、リミッターを付けることで解決とする。
            if (file.inlinks.length !== 0) {
                file.inlinks?.forEach(inlink => {
                    // バックリンク先のファイルを取得。
                    const inlinkFile = dv.page(inlink.path);

                    // belongsToに、現在ファイルへのリンクを持つものが子ファイル。プッシュする。
                    pushConnectedNote(children, inlinkFile, 'belongsTo');

                    // relatesToに、現在ファイルへのリンクを持つものが関連ファイル。プッシュする。
                    pushConnectedNote(relateds, inlinkFile, 'relatesTo');
                });
            }

            // ファイルの更新順にソートしてセット
            // ソートの対象を追加したい時は、この設定をデフォルトにして、引数でフロントマターの要素でソートする機能を付け足す。
            this.childNotes = children.sort((a, b) => b.file.mtime.ts - a.file.mtime.ts);
            this.relatedNotes = relateds.sort((a, b) => b.file.mtime.ts - a.file.mtime.ts);

            if (hierarchy === 1) {
                const parantNames = [];
                const belongsTo = file.frontmatter.belongsTo;
                if (belongsTo && belongsTo?.length !== 0) {
                    file.frontmatter.belongsTo.forEach(to => {
                        parantNames.push(MyNoteModule.getNameFromInternalLinkPath(to));
                    });
    
                    this.parentNotes = [];
                    if (file.outlinks.length !== 0) {
                        // チェックするoutlinksの重複を防ぐ。
                        const uniqueOutlinks = [];
                        file.outlinks.forEach(outL => {
                            if(uniqueOutlinks.filter(uniL => uniL.path === outL.path).length == 0){
                                uniqueOutlinks.push(outL);
                            }
                        })
                        
                        uniqueOutlinks?.forEach(outlink => {
                            const outlinkFile = dv.page(outlink.path);

                            // Note: ここを「outlinkFile.file.name」としてたせいで、以下のエラーが出てた。
                            // 多分、リンク先が実体化されていない、内部リンク（outlink）を置いてたから、かな？？？
                            // TypeError: Cannot read properties of undefined (reading 'file')
                            if (parantNames.includes(outlinkFile?.file.name)) {
                                // 汚すぎるけど、一旦これで。。。そのうち、全体の構成が落ち着いてきたらリファクタ。
                                // -1　ではなく0を指定すると、親から子に行く時に+1されて、条件を満たし続けるので、無限ループになるので注意！！！！！！！！！！
                                // 欲しいのは直の親と、その親の直の子どもだけ。それを無理やりこの形で実装してるけど、もっと綺麗にしたい。
                                this.parentNotes.push(
                                    new MyNoteModule.MyNote(dv, outlinkFile.file, schema, -1, -999, - 1)
                                );
                            }
                        })
                    }
                    this.siblingNotes = [];
                    this.parentNotes.forEach(p => {
                        const cuttedMySelf = p.childNotes.filter(n => n.file.path !== this.file.path);
                        this.siblingNotes.push(...cuttedMySelf);
                    });
                }
            }

        }

        /**
         * Inboxノートにおけるフロントマターのすぐ下の部分の表示
         */
        printTopSection() {
            this.dv.el("b", `###### Note Type : [[System/_env/noteTypeMOCs/${this.noteTypeAlias}|${this.noteTypeAlias}]]`);

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
                    output += `- ${n?.file.link}（${n.noteTypeAlias}）\n`
                })
                this.dv.el('d', output);
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
