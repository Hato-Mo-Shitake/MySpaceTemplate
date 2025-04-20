class CreationsNoteModule {
    constructor() {
        console.log("CreationsNoteModule is instantiated.");
    }

    /**
     * 
     * @param {MyNote} MyNote Class from ./MyNoteModule.js
     * @param {DataviewInlineApi} dv 
     * @param {file} file EX: dv.current().file
     * @param {int} childLimiter 
     * @param {int} relatedLimiter 
     * @param {int} hierarchy 
     * @returns {CreationsNote} instance
     */
    createInstance(MyNote, dv, file, childLimiter = 1, relatedLimiter = 1, hierarchy = 1) {
        const CreationsNote = this.getNoteClass(MyNote);
        return new CreationsNote(dv, file, childLimiter, relatedLimiter, hierarchy);
    }

    /**
     * @extends MyNote from ./MyNoteModule.js
     * @param {MyNote} MyNote Class
     * @returns {CreationsNote} class
     */
    getNoteClass(MyNote) {
        return class CreationsNote extends MyNote {
            constructor(dv, file, childLimiter = 1, relatedLimiter = 1, hierarchy = 1) {
                super(dv, file, childLimiter, relatedLimiter, hierarchy);
            }
        }
    }
}