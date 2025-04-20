class CharactersIPNoteModule {
    constructor() {
        console.log("CharactersIPNoteModule is instantiated.");
    }

    /**
     * 
     * @param {MyNote} MyNote Class from ./MyNoteModule.js
     * @param {DataviewInlineApi} dv 
     * @param {file} file EX: dv.current().file
     * @param {int} childLimiter 
     * @param {int} relatedLimiter 
     * @param {int} hierarchy 
     * @returns {CharactersIPNote} instance
     */
    createInstance(MyNote, dv, file, childLimiter = 1, relatedLimiter = 1, hierarchy = 1) {
        const CharactersIPNote = this.getNoteClass(MyNote);
        return new CharactersIPNote(dv, file, childLimiter, relatedLimiter, hierarchy);
    }

    /**
     * @extends MyNote from ./MyNoteModule.js
     * @param {MyNote} MyNote Class
     * @returns {WIPsNovelNote} class
     */
    getNoteClass(MyNote) {
        return class CharactersIPNote extends MyNote {
            constructor(dv, file, childLimiter = 1, relatedLimiter = 1, hierarchy = 1) {
                super(dv, file, childLimiter, relatedLimiter, hierarchy);
            }
        }
    }
}