class GenerateNoteModule {
    constructor() {
        console.log("GenerateNoteModule is instantiated.");
    }

    /**
     * 
     * @param {tp} tmplaterPlugin.templater.current_functions_object
     * @param {string} parentDirPath 
     * @returns {string}
     * @throws
     */
    async getSelectedDirPath(tp, parentDirPath) {
        const folder = tp.app.vault.getFolderByPath(parentDirPath);
        const selectFolders = [];
        selectFolders.push(folder);
        this.pushAllFoldersUnderPath(tp, folder, selectFolders);

        const folderPaths = selectFolders.map(t => t.path);

        const nameList = [
            "⇩【Please select.】",
            ...folderPaths
        ];
        const pathList = [
            null,
            ...folderPaths
        ];

        const selectedPath = await tp.system.suggester(nameList, pathList);
        if (selectedPath === null) {
            throw new Error("The enterd value is null.");
        }

        return selectedPath;
    };

    pushAllFoldersUnderPath(tp, folder, allFolders = []) {
        // const folder = tp.app.vault.getFolderByPath(path);

        // この記述のせいでダブりが発生してた。
        //allFolders.push(folder);

        const cFolders = folder.children.filter(t => t instanceof tp.obsidian.TFolder);
        cFolders.forEach(f => {
            allFolders.push(f);
            const fChildren = f.children.filter(t => t instanceof tp.obsidian.TFolder);

            if (fChildren.length > 0
            ) {
                this.pushAllFoldersUnderPath(tp, f, allFolders);
            }
        });
    }

    /**
     * @param {tp} tmplaterPlugin.templater.current_functions_object
     * @param {string} dirPath 
     * @returns {string}
     * @throws
     */
    async getEnteredTitle(tp, dirPath) {
        const title = await tp.system.prompt("Please enter note title.");
        if (title === null) {
            throw new Error("The entered value is null.");
        }
        if (title === '') {
            alert(`Error:
                    The enterd value is empty. Enter it again.`
            )
            return await this.getEnteredTitle(tp, dirPath);
        }

        const duplicateCheck = tp.file.find_tfile(`${dirPath}/${title}`);
        if (duplicateCheck) {
            alert(`Error:
                    The file already exits. Enter it again.`
            )
            return await getEnteredTitle(tp, dirPath);
        }

        return title;
    }

    // /**
    //  * 
    //  * @param {string} path 
    //  * @returns {string}
    //  */
    // getNameFromPath(path) {
    //     const index = path.lastIndexOf('/');
    //     const name = path.slice(index + 1);
    //     return name;
    // }


    // /**
    //  * 
    //  * @param {tp} tmplaterPlugin.templater.current_functions_object
    //  * @param {string} parentDirPath 
    //  * @returns {string}
    //  * @throws
    //  */
    // async getSelectedDirPath(tp, parentDirPath) {
    //     const pFolder = tp.app.vault.getFolderByPath(parentDirPath);
    //     const cFolders = pFolder.children.filter(t => t instanceof tp.obsidian.TFolder);

    //     const cFolderNames = cFolders.map(t => '/' + t.name);
    //     const cFolderPaths = cFolders.map(t => t.path);

    //     const nameList = [
    //         `⇩【Please select.】${parentDirPath} :  `,
    //         '/',
    //         ...cFolderNames
    //     ];
    //     const pathList = [
    //         null,
    //         pFolder.path,
    //         ...cFolderPaths
    //     ];

    //     const selectedPath = await tp.system.suggester(nameList, pathList);
    //     if (selectedPath === null) {
    //         throw new Error("The enterd value is null.");
    //     }
    //     if (selectedPath === pFolder.path) {
    //         return selectedPath;
    //     }

    //     const selectedFolder = tp.app.vault.getFolderByPath(selectedPath);
    //     if (selectedFolder.children
    //         .filter(t => t instanceof tp.obsidian.TFolder)
    //         .length > 0
    //     ) {
    //         return this.getSelectedDirPath(tp, selectedPath);
    //     }

    //     return selectedPath;
    // };

}



