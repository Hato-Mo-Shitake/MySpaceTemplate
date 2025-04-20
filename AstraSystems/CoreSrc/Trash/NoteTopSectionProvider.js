class NoteTopSectionProvider {
    constructor() {
        this.cachedSchema = '';
        console.log("NoteTopSectionProvider is instantiated.");
    }

    async print(dv, vault, customJS) {
        const currentNote = await this.getCurrentNote(dv, vault, customJS);
        currentNote.printTopSection();
    }

    async getCurrentNote(dv, vault, customJS) {
        const currentFile = dv.current().file;
        const schema = await this.#getSchema(vault)
        const currentnoteTypeAlias = currentFile?.frontmatter?.tags[0];
        const currentSchema = schema[currentnoteTypeAlias];

        if (currentSchema === undefined || currentSchema.module === 'MyNoteModule') {
            return this.#getMyNote(dv, customJS, currentFile);
        }

        return this.#getChildExtendMyNote(currentSchema.module, dv, customJS, currentFile);
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

    #getMyNoteModule(customJS) {
        const MyNoteModule = customJS['MyNoteModule'];
        if (MyNoteModule === undefined) {
            throw Error("No MyNoteModule");
        }
        return MyNoteModule;
    }

    #getMyNote(dv, customJS, file) {
        const MyNoteModule = this.#getMyNoteModule(customJS);
        return MyNoteModule.createInstance(dv, file, this.cachedSchema);
    }

    #getChildExtendMyNote(moduleName, dv, customJS, file) {
        const MyNoteModule = this.#getMyNoteModule(customJS);
        const concreteNoteModule = customJS[moduleName];
        if (concreteNoteModule === undefined) {
            console.log(`No ${moduleName}`);
            return null;
        }

        //Note: concreteNoteModuleの対象になるモジュールにおける共通のインタフェースをつくってそれに依存させるべきだが、まぁ、一旦はこれで。。。
        return concreteNoteModule.createInstance(MyNoteModule.getNoteClass(), dv, file, this.cachedSchema);
    }
}
