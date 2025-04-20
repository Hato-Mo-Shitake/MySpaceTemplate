class SchemaBuildingStar {

    #tp;
    #coreSchema

    constructor() {
        console.log("SchemaBuildingStar is instantiated.");
    }

    async _setUp(tp, option = '') {
        // @todo 依存性の注入。規模が大きくなったら、以下をinjectDeps()などに切り分ける。
        this.#tp = tp;
        await this.#setCoreSchema();
        this._isReady = true;
    }

    async build(targetSchemaPath, storageFilePath, transformFns = []) {
        this.#checkReady();

        const {targetSchema, tFile} = await this.#getTargetSchemaAndTFileForwrite(targetSchemaPath, storageFilePath);

        const builtSchema = this.#getBuiltSchema(targetSchema, transformFns);
        const jsonText = JSON.stringify(builtSchema);

        // 📒modify() : 元のテキストが消えるので使用には注意。
        this.#tp.app.vault.modify(tFile, jsonText);
    }

    // MocSection用。逆引きを作成するのは、getBuiltSchema()内の加工関数内でやると複雑になるので、専用のメソッドを作った。
    // そのうち、汎用化したい。。。。。
    async buildNoteTypeMap(storageFilePath) {
        const targetSchemaPath = 'NoteSchema.Galaxies.childNotes';
        const map = {};

        const {tFile} = await this.#getTargetSchemaAndTFileForwrite(targetSchemaPath, storageFilePath);

        for (const [path, val] of Object.entries(this.#getByDotPath(this.#getCoreSchema(), targetSchemaPath))) {
            if (typeof val !== 'object' || val === null) continue;

            const noteType = val.noteType || path.split('/').pop();
            map[noteType] = path;
        }

        map.MyNote = "Galaxies";

        const jsonText = JSON.stringify(map);

        // 📒modify() : 元のテキストが消えるので使用には注意。
        this.#tp.app.vault.modify(tFile, jsonText);
    }

    async #getTargetSchemaAndTFileForwrite(targetSchemaPath, storageFilePath) {
        const tFile = await this.#tp.app.vault.getFileByPath(storageFilePath);
        if (tFile) {
            const selected = await this.#tp.system.suggester(
                [`This will overwrite "${storageFilePath.split('/').pop()}".\n Are you sure?`, 'Yes', 'No'],
                [null, true, false]
            );
            if (!selected) throw new Error("Process paused.");
        } else {
            throw new Error('The destination note could not be found.');
        }

        const targetSchema = this.#getByDotPath(this.#getCoreSchema(), targetSchemaPath);
        if (!targetSchema) {
            throw new Error(`${targetSchemaPath} is not found.`);
        }

        return {targetSchema, tFile};
    }

    #getCoreSchema() {
        if (!this.#coreSchema) {
            throw new Error('coreSchema is not set')
        }
        return this.#coreSchema;
    }

    #getBuiltSchema(rootNode, transformFns = [], basePath = '', depth = 0, bSchema = {}) {
        for (const [key, val] of Object.entries(rootNode)) {
            const path = basePath ? `${basePath}.${key}` : key;

            // 加工処理を実行
            const node = { rootNode, key, val, path, depth }; // 加工用データを生成
            for (const fn of transformFns) {
                try {
                    fn(node); // nodeオブジェクトを加工関数に渡す
                } catch (err) {
                    console.warn(`${fn.name} failed at path "${path}":`, err);
                }
            }

            if (val && typeof val === 'object' && !Array.isArray(val)) {
                this.#getBuiltSchema(val, transformFns, path, depth + 1, bSchema);
            } else {
                this.#setByDotPath(bSchema, path, val);
            }
        }
        return bSchema;
    }

    #setByDotPath(obj, path, val) {
        if (!path) return;

        const keys = path.split('.');
        let current = obj;

        keys.forEach((key, index) => {
            if (!key) throw new Error(`Empty key in path: "${path}"`);

            if (index === keys.length - 1) {
                // 最後のキーに値をセット。
                current[key] = val;
            } else {
                if (!(key in current) || typeof current[key] !== 'object') {
                    // 中間のキーが存在しなければ作る。
                    current[key] = {}
                }
                current = current[key];
            }
        });
    }

    #getByDotPath(obj, path) {
        const keys = path.split('.');
        let current = obj;

        for (let key of keys) {
            if (current == null || typeof current !== 'object') return undefined;
            current = current[key];
        }

        return current;
    }

    #checkReady() {
        if (!this._isReady) {
            throw new Error("SchemaBuildingStar is not ready.")
        }
    }

    async #setCoreSchema() {
        const tFile = this.#tp.app.vault.getFileByPath("AstraSystems/Orbits/CoreSchema.md");

        const fileText = await this.#tp.app.vault.cachedRead(tFile);

        const startIndex = fileText.indexOf('```JSON');
        const endIndex = fileText.lastIndexOf('```');
        const json = fileText.slice(startIndex + 7, endIndex).trim();

        this.#coreSchema = JSON.parse(json);
    }
}