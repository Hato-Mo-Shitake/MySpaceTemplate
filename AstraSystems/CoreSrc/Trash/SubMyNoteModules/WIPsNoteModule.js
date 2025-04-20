class WIPsNoteModule {
    constructor() {
        this.cachedNoteClass = '';
        console.log("WIPsNoteModule is instantiated.");
    }

    /**
     * 
     * @param {MyNote} MyNote Class from ./MyNoteModule.js
     * @param {DataviewInlineApi} dv 
     * @param {file} file EX: dv.current().file
     * @param {int} childLimiter 
     * @param {int} relatedLimiter 
     * @param {int} hierarchy 
     * @returns {WIPsNote} instance
     */
    createInstance(MyNote, dv, file, schema, childLimiter = 1, relatedLimiter = 1, hierarchy = 1) {
        if (!this.cachedNoteClass) {
            this.generateAndSetNoteClass(MyNote);
        }
        return new this.cachedNoteClass(dv, file, schema, childLimiter, relatedLimiter, hierarchy);
    }

    /**
     * @extends MyNote from ./MyNoteModule.js
     * @param {MyNote} MyNote Class
     * @returns {WIPsNote} class
     */
    generateAndSetNoteClass(MyNote) {
        this.cachedNoteClass = class WIPsNote extends MyNote {
            constructor(dv, file, schema, childLimiter = 1, relatedLimiter = 1, hierarchy = 1) {
                super(dv, file, schema, childLimiter, relatedLimiter, hierarchy);
            }

            /**
             * @override
             */
            printTopSection() {
                this.dv.el("b", `###### Note Type : [[System/_env/noteTypeMOCs/${this.noteTypeAlias}|${this.noteTypeAlias}]]`);

                this.printNoteLinks('parents', this.parentNotes);

                this.resolveds = '';
                this.completeds = '';
                this.printNoteLinks('children', this.childNotes);
                if (this.resolveds) {
                    this.dv.el("d", "##### resolved");
                    this.dv.el("d", this.resolveds)
                }
                if (this.completeds) {
                    this.dv.el("d", "##### completed");
                    this.dv.el("d", this.completeds)
                }
                

                this.resolveds = '';
                this.completeds = '';
                this.printNoteLinks('siblings', this.siblingNotes);
                if (this.resolveds) {
                    this.dv.el("d", "##### resolved");
                    this.dv.el("d", this.resolveds)
                }
                if (this.completeds) {
                    this.dv.el("d", "##### completed");
                    this.dv.el("d", this.completeds)
                }

                this.printNoteLinks('related to', this.relatedNotes);

            }

            /**
             * @override
             * @param {string} header 
             * @param {Array} myNotes 
             */
            printNoteLinks(header, myNotes) {
                if (myNotes?.length) {
                    let output = '';
                    output += `## ${header}\n`
                    myNotes.forEach(n => {
                        if (n.file.frontmatter?.resolved) {
                            this.resolveds += `- ${n.file.link}（${n.noteTypeAlias}）\n`;
                        } else if (n.file.frontmatter?.completed) {
                            this.completeds += `- ${n.file.link}（${n.noteTypeAlias}）\n`;
                        } else {
                            output += `- ${n.file.link}（${n.noteTypeAlias}）\n`
                        }
                    })

                    this.dv.el('d', output);
                }
            }
        };
    }
    // return class WIPsNote extends MyNote {
    //     constructor(dv, file, schema, childLimiter = 1, relatedLimiter = 1, hierarchy = 1) {
    //         super(dv, file, schema, childLimiter, relatedLimiter, hierarchy);
    //     }
    // }
    // if (!this.NoteClass) {
    //     this.WIPsNoteClass = class WIPsNote extends MyNote {
    //         constructor(dv, file, schema, childLimiter = 1, relatedLimiter = 1, hierarchy = 1) {
    //             super(dv, file, schema, childLimiter, relatedLimiter, hierarchy);
    //         }
    //     }

    // return this.WIPsNoteClass;

    // /**
    //  * @override
    //  */
    // printNoteLinks(header, myNotes) {
    //     if (myNotes?.length) {
    //         let output = '';
    //         output += `### ${header}\n`
    //         myNotes.forEach(n => {
    //             const aspect = n.file.frontmatter?.wipAspect;
    //             const aspectView = aspect ? `（aspect: ${aspect}）` : ''
    //             output += `- ${n.file.link}${aspectView}\n`
    //         })
    //         this.dv.el('d', output);
    //     }
    // }

    //}
}