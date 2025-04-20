class NoteGeneratingStar {

    #tp;

    constructor() {
        console.log("NoteGeneratingStar is instantiated.");
    }

    _setUp(tp, option = '') {
        // @todo 依存性の注入。規模が大きくなったら、以下をinjectDeps()などに切り分ける。
        this.#tp = tp;
        this._isReady = true;
    }

    async getSelectedDirPath(schema, parentDirPath) {
        const folder = this.#tp.app.vault.getFolderByPath(parentDirPath);
        console.log(folder);
        const selectFolders = [];
        selectFolders.push(folder);
        this.#pushAllFoldersUnderPath(folder, selectFolders);

        const folderPaths = selectFolders.map(t => t.path);
        const selectNameList = folderPaths.map(path => {
            const cutPath = path.replace(parentDirPath + '/', '')
            return  schema.childNotes[cutPath]?.noteType || 'MyNote';
        });

        const nameList = [
            "⇩【Please select.】",
            ...selectNameList
        ];
        const pathList = [
            null,
            ...folderPaths
        ];

        const selectedPath = await this.#tp.system.suggester(nameList, pathList);
        if (selectedPath === null) {
            throw new Error("The enterd value is null.");
        }

        return selectedPath;
    };

    #pushAllFoldersUnderPath(folder, allFolders = []) {
        const cFolders = folder.children.filter(t => t instanceof this.#tp.obsidian.TFolder);
        cFolders.forEach(f => {
            allFolders.push(f);
            const fChildren = f.children.filter(t => t instanceof this.#tp.obsidian.TFolder);

            if (fChildren.length > 0
            ) {
                this.#pushAllFoldersUnderPath(f, allFolders);
            }
        });
    }

    async getEnteredTitle(dirPath) {
        const title = await this.#tp.system.prompt("Please enter note title.");
        if (title === null) {
            throw new Error("The entered value is null.");
        }
        if (title === '') {
            alert(`Error:
                    The enterd value is empty. Enter it again.`
            )
            return await this.getEnteredTitle(dirPath);
        }

        const duplicateCheck = this.#tp.file.find_tfile(`${dirPath}/${title}`);
        if (duplicateCheck) {
            alert(`Error:
                    The file already exits. Enter it again.`
            )
            return await getEnteredTitle(dirPath);
        }

        return title;
    }

    startsWithUpper(str) {
        if(!str || str.lengrh === 0) {
            return false;
        }
        const firstChar = str.charAt(0);
        return firstChar.match(/^[A-Z]$/);
    }
}