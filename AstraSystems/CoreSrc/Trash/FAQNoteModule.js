class FAQNoteModule {
    constructor() {
        console.log("FAQNoteModule is instantiated.");
    }

    /**
     * 
     * @param {MyNote} MyNote Class from ./MyNoteModule.js
     * @param {DataviewInlineApi} dv 
     * @param {file} file EX: dv.current().file
     * @param {int} childLimiter 
     * @param {int} relatedLimiter 
     * @param {int} hierarchy 
     * @returns {FAQNote} instance
     */
    createInstance(MyNote, dv, file, childLimiter = 1, relatedLimiter = 1, hierarchy = 1) {
        const FAQNote = this.getNoteClass(MyNote);
        return new FAQNote(dv, file, childLimiter, relatedLimiter, hierarchy);
    }

    /**
     * @extends MyNote from ./MyNoteModule.js
     * @param {MyNote} MyNote Class
     * @returns {FAQNote} class
     */
    getNoteClass(MyNote) {
        return class FAQNote extends MyNote {
            constructor(dv, file, childLimiter = 1, relatedLimiter = 1, hierarchy = 1) {
                super(dv, file, childLimiter, relatedLimiter, hierarchy);
            }
        }
    }
}