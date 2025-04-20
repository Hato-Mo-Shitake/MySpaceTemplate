class MocNoteModule {
    constructor() {
        console.log("MocNoteModule is instantiated.");
    }

    /**
     * 
     * @returns {MocNote} instance
     */
    createCurrentInstance(dv, mChildLimiter = 10, hierarchy = 1) {
        const currentFile = dv.current().file;
        return new MocNoteModule.MocNote(dv, currentFile, mChildLimiter, hierarchy);
    }

    /**
     * @class
     */
    static MocNote = class {
        constructor(dv, file, mChildLimiter = 10, hierarchy = 1) {
            this.dv = dv;
            this.file = file;
            this.hierarchy = hierarchy;

            let mChildren = [];

            const pushConnectedNote = function (targetArr, inlinkFile, propName) {
                let limiter = 0;
                if (propName === 'belongsTo') {
                    limiter = mChildLimiter;
                } else {
                    throw new Error('The limiter is not found.');
                }

                if (
                    inlinkFile[propName]?.some(to => to?.path === file?.path) && hierarchy <= limiter
                ) {
                    targetArr.push(
                        new MocNoteModule.MocNote(dv, inlinkFile.file, mChildLimiter, hierarchy + 1)
                    );
                }
            }

            // TODO:循環参照の問題解決してない。子の子孫が親だったら、無限ループに入りそう
            // 要するに、自分の子孫に自分が出てこないようにすればいいんだけど。とりあえずは、リミッターを付けることで解決とする。
            if (file.inlinks.length !== 0) {
                file.inlinks?.forEach(inlink => {
                    // バックリンク先のファイルを取得。
                    const inlinkFile = dv.page(inlink.path);

                    // belongsToに、現在ファイルへのリンクを持つものが、MocNote子ファイル。プッシュする。
                    pushConnectedNote(mChildren, inlinkFile, 'belongsTo');
        
                });
            }

            // ファイルの更新順にソートしてセット
            // ソートの対象を追加したい時は、この設定をデフォルトにして、引数でフロントマターの要素でソートする機能を付け足す。
            this.ChildMNotes = mChildren.sort((a, b) => b.file.mtime.ts - a.file.mtime.ts);
        }

        printMocSection(cLimit = 50, tag = '') {
            this.printMNotesSection();
            this.dv.el('d', `\n---\n`);
            this.printChildCNotesSection(cLimit, tag);
        }

        /**
         * セットされている子々孫々MocNoteをリスト
         */
        printAllDescendantMNotes() {
            if (this.ChildMNotes.length === 0) {
                this.dv.el("b", 'No Note');
            } else {
                const output = this.getAllDescendantLinks();
                this.dv.el("d", output);
            }
        }

        /**
         * 
         * @param {string} output 
         * @param {string} indent 
         * @returns {string}
         */
        getAllDescendantLinks(output = '', indent = '') {
            if (this.ChildMNotes.length !== 0) {
                this.ChildMNotes.forEach(myNote => {
                    output += `${indent}- ${myNote.file?.link}`;
                    output = myNote.getAllDescendantLinks(output + '\n', indent + '\t');
                });
            }

            return output;
        }

        printMNotesSection() {
            this.dv.el('d', `## Parent MOC`);
            // 一旦はこれで.....
            const pMocPath= this.file.frontmatter.belongsTo[0].slice(2, -2);
            this.dv.el('d', `- [[${pMocPath}|${pMocPath.split('/').pop()}]]`);

            this.dv.el('d', `## Child MOCs`);
            this.printAllDescendantMNotes();
        }

        /**
         * 子ContentNoteをリスト
         * 最新のいくつまで表示するか指定したい。
         */
        printChildCNotesSection(limit = 50, tag = '') {
            const files = this.dv.pages(tag).values;
            const fCount = files.length;
            const displayList = files
                .sort((a, b) => b.file.mtime.ts - a.file.mtime.ts)
                .slice(0, limit);

            this.dv.el('d', `## Content Notes (count: ${fCount} | max display: ${limit})`);
            this.dv.list(displayList.map(f => f.file.link));
        }

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
        // getChildLinks() {
        //     let links = [];
        //     this.childNotes?.forEach(myNote => {
        //         links.push(myNote.file?.link);
        //     });
        //     return links;
        // }
    }
}
