class CreatoriumNoteModule {
    constructor() {
        console.log("CreatoriumNoteModule is instantiated.");
    }

    /**
     * 
     * @param {MyNote} MyNote Class from ./MyNoteModule.js
     * @param {DataviewInlineApi} dv 
     * @param {file} file EX: dv.current().file
     * @param {int} childLimiter 
     * @param {int} relatedLimiter 
     * @param {int} hierarchy 
     * @returns {CreatoriumNote} instance
     */
    createInstance(MyNote, dv, file, childLimiter = 1, relatedLimiter = 1, hierarchy = 1) {
        const CreatoriumNote = this.getNoteClass(MyNote);
        return new CreatoriumNote(dv, file, childLimiter, relatedLimiter, hierarchy);
    }

    /**
     * @extends MyNote from ./MyNoteModule.js
     * @param {MyNote} MyNote Class
     * @returns {CreatoriumNote} class
     */
    getNoteClass(MyNote) {
        return class CreatoriumNote extends MyNote {
            constructor(dv, file, childLimiter = 1, relatedLimiter = 1, hierarchy = 1) {
                super(dv, file, childLimiter, relatedLimiter, hierarchy);
            }
        }
    }
}