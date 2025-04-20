class MocNoteSynther {
    
    #schemaPath = "AstraSystems/Orbits/BuiltSchemas/forMocSection.md";
    #cachedSchema;
    #dv;
    #customJS

    constructor() {
        this._isReady = false;
        console.log("MocNoteSynther is instantiated.");
    }

    async _setUp(dv, customJS, option = '') {
        // @todo 依存性の注入。規模が大きくなったら、以下をinjectDeps()などに切り分ける。
        this.#dv = dv;
        await this.#setSchema(dv.app.vault);
        this.#customJS = customJS;
        this._isReady = true;
    }

    exec() {
        this.#checkReady();
        const currentNote = this.#getCurrentNote();
        currentNote.print();
        this._isReady = false;
    }

    #checkReady() {
        if (!this._isReady) {
            throw new Error("MocNoteSynther is not ready.");
        }
    }

    #getCurrentNote() {
        this.#checkReady();
        const currentFile = this.#dv.current().file;
        const mocNoteType = currentFile.name;

        const MocNoteStar = this.#customJS.MocNoteStar;
        let targetModule = null;
        // 将来的にはスキーマ駆動に・・・・。
        switch(mocNoteType){
            case 'ToDo':
                targetModule = this.#customJS.ToDoMocNotePlanet;
                if (!(typeof targetModule.createInstance === 'function')) {
                    targetModule.createInstance = MocNoteStar.createInstance;
                }
                targetModule.setBaseNoteClass(MocNoteStar.getNoteClass())
                break; 
            default: 
                targetModule = MocNoteStar;
        }

        return targetModule.createInstance(this.#cachedSchema, this.#dv, currentFile);
    }

    async #setSchema(vault) {
        if (!this.#cachedSchema) {
            const tFile = await vault.getFileByPath(this.#schemaPath);
            const fileText = await vault.cachedRead(tFile);
            const json = fileText.trim();
            this.#cachedSchema = JSON.parse(json);
        }
    }
}