class CharactersNoteModule {
    constructor() {
        console.log("CharactersNoteModule is instantiated.");
    }

    /**
     * 
     * @param {MyNote} MyNote Class from ./MyNoteModule.js
     * @param {DataviewInlineApi} dv 
     * @param {file} file EX: dv.current().file
     * @param {int} childLimiter 
     * @param {int} relatedLimiter 
     * @param {int} hierarchy 
     * @returns {CharactersNote} instance
     */
    createInstance(MyNote, dv, file, childLimiter = 1, relatedLimiter = 1, hierarchy = 1) {
        const CharactersNote = this.getNoteClass(MyNote);
        return new CharactersNote(dv, file, childLimiter, relatedLimiter, hierarchy);
    }

    /**
     * @extends MyNote from ./MyNoteModule.js
     * @param {MyNote} MyNote Class
     * @returns {CharactersNote} class
     */
    getNoteClass(MyNote) {
        return class CharactersNote extends MyNote {
            constructor(dv, file, childLimiter = 1, relatedLimiter = 1, hierarchy = 1) {
                super(dv, file, childLimiter, relatedLimiter, hierarchy);
            }
        }
    }
}