class NoteGeneratingSynther {

    #schemaPath = "AstraSystems/Orbits/BuiltSchemas/forNoteTopSection.md";
    #cachedSchema;
    #mainDir = 'Galaxies';
    #templateDir = 'AstraSystems/Orbits/Templates/Notes';

    #tp;
    #NoteGeneratingStar;

    constructor() {
        console.log("NoteGeneratingSynther is instantiated.");
    }

    async _setUp(tp, customJS, option = '') {
        // @todo 依存性の注入。規模が大きくなったら、以下をinjectDeps()などに切り分ける。
        this.#tp = tp;
        await this.#setSchema(tp.app.vault);
        this.#NoteGeneratingStar = customJS.NoteGeneratingStar;
        this.#NoteGeneratingStar._setUp(tp);

        this._isReady = true;
    }

    async #setSchema(vault) {
        if (!this.#cachedSchema) {
            const tFile = await vault.getFileByPath(this.#schemaPath);
            const fileText = await vault.cachedRead(tFile);
            const json = fileText.trim();
            this.#cachedSchema = JSON.parse(json);
        }
    }
    
    async createMyNote() {

    }

    async createMyNoteOld() {
        this.#checkReady();

        const selectedDirPath = await this.#NoteGeneratingStar.getSelectedDirPath(this.#cachedSchema, this.#mainDir);
        const templaterName = selectedDirPath
            .replace(this.#mainDir + '/', '')
            .replace(/\//g, '-');
        const title = await this.#NoteGeneratingStar.getEnteredTitle(selectedDirPath);
        const template = this.#tp.file.find_tfile(this.#templateDir + '/' + templaterName);
        const newTFile = await this.#tp.file.create_new(
            template, title, false, selectedDirPath
        );
    
        const d = new Date();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const todayDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}_${days[d.getDay()]}`;

        await this.#tp.app.fileManager.processFrontMatter(newTFile, (fm) => {
			fm["created"] = `[[${todayDate}]]`; 
		});

        const leaf = this.#tp.app.workspace.splitActiveLeaf();
        leaf.openFile(newTFile);

        this._isReady = false;
    }

    async createChildNote(){
        const currentParh = this.#tp.file.path(true);
	    const currentTitle = this.#tp.file.title; 

        const isCurrentType = await this.#tp.system.suggester(
            ["current note type", "select note type"],
            [true, false]
        );

        let selectedDirPath = '';
        if (isCurrentType) {
            // タグの一文字目は「#」
            const tags = this.#tp.file.tags.map(tag => tag.slice(1));		
            const targetTag = tags.find(tag => this.#NoteGeneratingStar.startsWithUpper(tag));
            console.log(targetTag);
            selectedDirPath += this.#mainDir + '/' + targetTag;
        } else {
            selectedDirPath += await this.#NoteGeneratingStar.getSelectedDirPath(this.#cachedSchema, this.#mainDir);
        }
    
        const templateName = selectedDirPath
            .replace(this.#mainDir + '/', '')
            .replace(/\//g, '-');
        const title = await this.#NoteGeneratingStar.getEnteredTitle(selectedDirPath);
        const template = this.#tp.file.find_tfile(this.#templateDir + '/' + templateName);
        const newTFile = await this.#tp.file.create_new(
            template, title, false, selectedDirPath
        );


        const d = new Date();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const todayDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}_${days[d.getDay()]}`;
        
        await this.#tp.app.fileManager.processFrontMatter(newTFile, (fm) => {
            fm['belongsTo'] = [`[[${currentParh.slice(0, -3)}|${currentTitle}]]`]
            fm["created"] = `[[${todayDate}]]`; 
        });
        
        const leaf = this.#tp.app.workspace.splitActiveLeaf();
        leaf.openFile(newTFile);
    }

    async adaptToMyNote() {
        const selectedDirPath = await this.#NoteGeneratingStar.getSelectedDirPath(this.#mainDir);
        const templaterName = selectedDirPath
            .replace(this.#mainDir + '/', '')
            .replace(/\//g, '-');
        const templateTFile = this.#tp.file.find_tfile(this.#templateDir + '/' + templaterName);
        const result = await this.#tp.file.include(templateTFile);

        const currentTFile = this.#tp.app.vault.getFileByPath(this.#tp.file.path(true));
        const selected = await this.#tp.system.suggester(
            [`This will overwrite "${currentTFile.name}".\n Are you sure?`, 'Yes', 'No'],
            [null, true, false]
        );
        if (!selected) throw new Error("Process paused.");

        // 📒modify() : 元のテキストが消えるので使用には注意。
        this.#tp.app.vault.modify(currentTFile, result);
        await this.#tp.file.move(selectedDirPath + '/' + this.#tp.file.title);

    }

    #checkReady() {
        if (!this._isReady) {
            throw new Error("NoteGeneratingSynther is not ready.");
        }
    }
}