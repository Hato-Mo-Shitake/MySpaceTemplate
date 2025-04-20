class SchemaBuildingPlanet {
    #star;

    constructor() {
        console.log("SchemaBuildingPlanet is instantiated.");
    }

    async _setUp(star, option = '') {
        // @todo 依存性の注入。規模が大きくなったら、以下をinjectDeps()などに切り分ける。

        // 高水準モジュール（planet）は、依存先の低水準モジュール（star）の具体的的な形を知る必要はない。
        // なので、具体的に「Schemastar」とは書かない。
        // こうすることで、あとで差し替えも可能になる。（本来なら、インタフェースに依存させるべきだが、まぁ...。余裕があれば、メソッドの存在チェックとかを入れてそれっぽくしたい
        this.#star = star;

        this._isReady = true;
    }

    async buildForMocSection() {
        this.#checkReady();

        await this.#star.buildNoteTypeMap(
            'AstraSystems/Orbits/BuiltSchemas/forMocSection.md',
        );
    }

    async buildForNoteTopSection() {
        this.#checkReady();

        await this.#star.build(
            'NoteSchema.Galaxies',
            'AstraSystems/Orbits/BuiltSchemas/forNoteTopSection.md',
            [
                this.#complementNoteTypeUndercChildNotes,
                this.#complementNtsDepUnderChildNotes,
                this.#createRemoveKeyFunc('properties'),
                this.#createRemoveKeyFunc('defaultProperties'),
                this.#createRemoveKeyFunc('commonProperties'),
            ]
        );
    }

    // async buildForCreateMyNote() {
    //     this.#checkReady();

    //     await this.#star.build(
    //         'NoteSchema.Galaxies',
    //         'AstraSystems/Orbits/BuiltSchemas/forCreateMyNote.md',
    //         [

    //         ]
    //     );
    // }

    #checkReady() {
        if (!this._isReady) {
            throw new Error("SchemaBuildingPlanet is not ready.")
        }
    }

    #complementNoteTypeUndercChildNotes({ key, val }) {
        if (key !== "childNotes" || typeof val !== 'object' || val === null || Array.isArray(val)) return;

        for (const [childKey, childNode] of Object.entries(val)) {
            if (!childNode.noteType) {
                childNode.noteType = childKey.split('/').pop() || childKey;
            }
        }
    }

    // 先に、complementNoteTypeUndercChildNotesを走らせる。
    #complementNtsDepUnderChildNotes({ key, val }) {
        if (key !== "childNotes" || typeof val !== 'object' || val === null || Array.isArray(val)) return;

        for (const [childKey, childNode] of Object.entries(val)) {
            if (
                typeof childNode === 'object' &&
                childNode !== null &&
                "noteType" in childNode &&
                !("ntsDep" in childNode)
            ) {
                childNode.ntsDep = `${childNode.noteType}NotePlanet`;
            }
        }
    }

    #createRemoveKeyFunc(targetKey) {
        return ({ key, val }) => {
            if (key === targetKey && typeof val === 'object' && val !== null) {
                Object.keys(val).forEach(childKey => delete val[childKey]);
            }
        }
    }


    #completePropertiesFromSources({ key, val, rootNode }) {
        if (key !== 'childNotes' || typeof val !== 'object' || val === null) return;
    
        const defaultProps = rootNode.defaultProperties || {};
        const commonProps = rootNode.commonProperties || {};
    
        for (const [childKey, childVal] of Object.entries(val)) {
            const props = childVal.properties;
            if (!props) continue;
    
            const newProps = {};
    
            for (const [propKey, propVal] of Object.entries(props)) {
                if (propKey === 'common' && propVal.source && Array.isArray(propVal.keys)) {
                    let source = null;
    
                    if (propVal.source.endsWith('defaultProperties')) {
                        source = defaultProps;
                    } else if (propVal.source.endsWith('commonProperties')) {
                        source = commonProps;
                    }
    
                    if (source) {
                        for (const k of propVal.keys) {
                            if (source[k]) {
                                newProps[k] = source[k];
                            }
                        }
                    }
                } else {
                    newProps[propKey] = propVal;
                }
            }
    
            childVal.properties = newProps;
        }
    }    
}