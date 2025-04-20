class GenerateSchemaModule {
    constructor() {
        console.log("GenerateSchemaModule is instantiated.");
    }

    /**
     * 
     * @param {jsonObject} rootNode 
     */
    async buildSchemaForNoteTopSectionProvider(tp) {

        const rootNode = await this.#getRootNode(tp)

        const targetSchemaPath = 'NoteSchema'
        const fileName = `forNoteTopSectionProvider`;
        const targetDir = "System/_env/builtSchema";
        const filePath = `${targetDir}/${fileName}.md`;

        const tFile = tp.app.vault.getFileByPath(filePath);
        if (tFile) {
            const selected = await tp.system.suggester(
                [`「${filePath}」に上書きされます。\nよろしいですか？`, 'yes', 'no'],
                [null, true, false]
            );
            if (!selected) throw new Error("中断します。");
        } else {
            throw new Error('書き込み先のノートが見つかりません。');
        }

        const transformFns = [
            this.#complementAliasUndercChildNotes,
            this.#complementModuleUnderChildNotes,
            this.#removeProperties
        ];
        const targetSchema = this.#getByDotPath(rootNode, targetSchemaPath);
        if (!targetSchema) {
            throw new Error(`${targetSchemaPath} is not found.`);
        }
        const builtSchema = this.#generateBuiltSchema(targetSchema, transformFns);
        console.log(builtSchema.Inbox.childNotes);
        const jsonText = JSON.stringify(builtSchema.Inbox.childNotes);
    
        // 📒modify() : 元のテキストが消えるので使用には注意。
        tp.app.vault.modify(tFile, jsonText);
    }

        /**
     * 
     * @param {jsonObject} rootNode 
     */
        async buildSchemaForGenerateNoteModule(tp) {

            const rootNode = await this.#getRootNode(tp)
    
            const targetSchemaPath = 'NoteSchema'
            const fileName = `forGenerateNoteModule`;
            const targetDir = "System/_env/builtSchema";
            const filePath = `${targetDir}/${fileName}.md`;
    
            const tFile = tp.app.vault.getFileByPath(filePath);
            if (tFile) {
                const selected = await tp.system.suggester(
                    [`「${filePath}」に上書きされます。\nよろしいですか？`, 'yes', 'no'],
                    [null, true, false]
                );
                if (!selected) throw new Error("中断します。");
            } else {
                throw new Error('書き込み先のノートが見つかりません。');
            }
    
            const transformFns = [







                



            ];
            const targetSchema = this.#getByDotPath(rootNode, targetSchemaPath);
            if (!targetSchema) {
                throw new Error(`${targetSchemaPath} is not found.`);
            }
            const builtSchema = this.#generateBuiltSchema(targetSchema, transformFns);
            console.log(builtSchema.Inbox.childNotes);
            const jsonText = JSON.stringify(builtSchema.Inbox.childNotes);
        
            // 📒modify() : 元のテキストが消えるので使用には注意。
            tp.app.vault.modify(tFile, jsonText);
        }

    /**
     * 
     * @param {jsonObject} rootNode 
     */
    async generateNoteSchemaDoc(tp) {
        const rootNode = await this.#getRootNode(tp)

        const targetSchemaPath = 'NoteSchema'
        const schemaVersion = rootNode.schemaVersion || "unknown";
        const fileName = `${targetSchemaPath}Doc_ver.${schemaVersion}`;
        const targetDir = "System/doc";
        const filePath = `${targetDir}/${fileName}.md`;

        if (tp.app.vault.getAbstractFileByPath(filePath)) {
            throw new Error(`"${filePath}" already exits.`);
        }

        const transformFns = [
            this.#complementAliasUndercChildNotes,
            this.#complementModuleUnderChildNotes
        ];
        const noteSchema = this.#getByDotPath(rootNode, targetSchemaPath);
        if (!noteSchema) {
            throw new Error(`${targetSchemaPath} is not found.`);
        }
        const builtSchema = this.#generateBuiltSchema(noteSchema, transformFns);

        let text = '';

        for (const [topKey, topNode] of Object.entries(builtSchema)) {
            text += this.#buildMarkdown(topNode, topKey, 1); // h1から開始
        }

        tp.file.create_new(text, fileName, true, targetDir);
    }

    async #getRootNode(tp) {
        const tFile = tp.app.vault.getFileByPath("System/_env/VaultSchema.md");
        const fileText = await tp.app.vault.cachedRead(tFile);

        const startIndex = fileText.indexOf('```JSON');
        const endIndex = fileText.lastIndexOf('```');
        const json = fileText.slice(startIndex + 7, endIndex).trim();

        return JSON.parse(json);
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

    #removeProperties({ key, val }) {
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
            if ('properties' in val) {
                delete val.properties;
            }
        }
    }

    #removeDescription({ key, val }) {
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
            if ('description' in val) {
                delete val.description;
            }
        }
    }

    #complementAliasUndercChildNotes({ key, val }) {
        if (key !== "childNotes" || typeof val !== 'object' || val === null || Array.isArray(val)) return;
        // childrenノードに対して alias を補完
        for (const [childKey, childNode] of Object.entries(val)) {
            if (!childNode.alias) {
                childNode.alias = childKey.split('/').pop();
                (childKey || '').split('/').filter(Boolean).pop() || childKey;
            }
        }
    }

    #complementModuleUnderChildNotes({ key, val }) {
        if (key !== "childNotes" || typeof val !== 'object' || val === null || Array.isArray(val)) return;

        for (const [childKey, childNode] of Object.entries(val)) {
            if (
                typeof childNode === 'object' &&
                childNode !== null &&
                "alias" in childNode &&
                !("module" in childNode)
            ) {
                childNode.module = `${childNode.alias}NoteModule`;
            }
        }
    }

    #generateBuiltSchema(rootNode, transformFns = [], basePath = '', depth = 0, bSchema = {}) {
        for (const [key, val] of Object.entries(rootNode)) {
            const path = basePath ? `${basePath}.${key}` : key;

            // 加工処理を実行
            const node = { key, val, path, depth }; // 加工用データを生成
            for (const fn of transformFns) {
                try {
                    fn(node); // nodeオブジェクトを加工関数に渡す
                } catch (err) {
                    console.warn(`${fn.name} failed at path "${path}":`, err);
                }
            }

            if (val && typeof val === 'object' && !Array.isArray(val)) {
                this.#generateBuiltSchema(val, transformFns, path, depth + 1, bSchema);
            } else {
                this.#setByDotPath(bSchema, path, val);
            }
        }
        return bSchema;
    }

    /**
     * 再帰的にMarkdown出力を組み立てる
     * @param {*} node - 対象ノード（object or primitive）
     * @param {*} key - 現在のキー名
     * @param {*} level - Markdownの見出しレベル
     * @returns {string}
     */
    #buildMarkdown(node, key, level) {
        let md = `${"#".repeat(level)} ${key}\n`;

        if (typeof node !== 'object' || node === null) {
            md += `- ${String(node)}\n`;
            return md;
        }

        for (const [childKey, childVal] of Object.entries(node)) {
            if (typeof childVal === 'object' && childVal !== null && !Array.isArray(childVal)) {
                md += this.#buildMarkdown(childVal, childKey, level + 1);
            } else {
                md += `${"#".repeat(level + 1)} ${childKey}\n`;
                if (Array.isArray(childVal)) {
                    for (const item of childVal) {
                        md += `- ${item}\n`;
                    }
                } else {
                    md += `- ${String(childVal)}\n`;
                }
            }
        }

        return md + '\n';
    }
}



