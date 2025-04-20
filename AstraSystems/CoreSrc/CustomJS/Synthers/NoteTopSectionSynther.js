class NoteTopSectionSynther {

    #schemaPath = "AstraSystems/Orbits/BuiltSchemas/forNoteTopSection.md";
    #cachedSchema;
    #dv;
    #customJS

    constructor() {
        this._isReady = false;
        console.log("NoteTopSectionSynther is instantiated.");
    }

    // dvは毎度注入する必要がある。customJSは要検証だが、とりあえず毎回注入する。
    async _setUp(dv, customJS, option = '') {
        // @todo 依存性の注入。規模が大きくなったら、以下をinjectDeps()などに切り分ける。
        this.#dv = dv;
        await this.#setSchema(dv.app.vault);
        this.#customJS = customJS;
        this._isReady = true;
    }

    /**
     * 実行。NoteTopSectionの出力。
     */
    exec() {
        this.#checkReady();
        const currentNote = this.#getCurrentNote();
        currentNote.printTopSection();
        this._isReady = false;
    }

    #checkReady() {
        if (!this._isReady) {
            throw new Error("NoteTopSectionSynther is not ready.");
        }
    }

    async #setSchema(vault) {
        if (!this.#cachedSchema) {
            const tFile = await vault.getFileByPath(this.#schemaPath);
            const fileText = await vault.cachedRead(tFile);
            const json = fileText.trim();
            this.#cachedSchema = JSON.parse(json);
        }
    }

    #getCurrentNote() {
        this.#checkReady();
        const currentFile = this.#dv.current().file;
        let currentSchema = null;
        if (currentFile.frontmatter?.tags) {
            currentSchema = this.#cachedSchema.childNotes[currentFile.frontmatter?.tags[0]] || null;
        }

        if (currentSchema === null || currentSchema.ntsDep === 'MyNoteStar') {
            return this.#getMyNote(currentFile);
        }

        return this.#getChildExtendMyNote(currentSchema.ntsDep, currentFile);
    }

    #getMyNoteStar() {
        const MyNoteStar = customJS['MyNoteStar'];
        if (MyNoteStar === undefined) {
            throw Error("MyNoteStar is undefined.");
        }
        return MyNoteStar;
    }

    #getMyNote(file) {
        const MyNoteStar = this.#getMyNoteStar(this.#customJS);
        return MyNoteStar.createInstance(this.#cachedSchema, this.#dv, file);
    }

    #getChildExtendMyNote(moduleName, file) {
        const MyNoteStar = this.#getMyNoteStar(this.#customJS);
        const concreteNotePlanet = customJS[moduleName];
        if (concreteNotePlanet === undefined) {
            throw Error(`${moduleName} is not undefined.`);
        }

        //Note: concreteNotePlanetの対象になるモジュールにおける共通のインタフェースをつくってそれに依存させるべきだが、まぁ、一旦はこれで。。。
        // メソッド単体に絞って疑似継承。
        // 疑似継承を行なうメソッドをSynther内につくってもいいかも。
        // あるいは色々危なそうだけど、プロトタイプチェーンにセットするとか。

        if (!(typeof concreteNotePlanet.createInstance === 'function')) {
            concreteNotePlanet.createInstance = MyNoteStar.createInstance;
        }
        concreteNotePlanet.setBaseNoteClass(MyNoteStar.getNoteClass());
        return concreteNotePlanet.createInstance(this.#cachedSchema, this.#dv, file);
    }
}