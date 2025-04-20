class TestModule {
    constructor() {
        this.cachedSchema = '';
        console.log("TestModule is instantiated.");
    }

    async #getSchema(vault) {
        if (!this.cachedSchema) {
            const tFile = await vault.getFileByPath("System/_env/builtSchema/forNoteTopSectionProvider.md");
            const fileText = await vault.cachedRead(tFile);
            const json = fileText.trim();
            this.cachedSchema = JSON.parse(json);
        }
        return this.cachedSchema;
    }

    async createInstance(dv, vault) {
        const schema = await this.#getSchema(vault);
        return new TestModule.MyNote(dv, vault, schema);
    }

    /**
     * @returns {MyNote} class
     */
    getNoteClass() {
        return TestModule.MyNote;
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
        constructor(dv, vault, schema) {
            console.log(schema);
        }
    }
}
