class ToDoMocNotePlanet {

    #cachedBaseClass;
    #cachedNoteClass;

    constructor() {
        console.log("ToDoMocNotePlanet is instantiated.");
    }

    setBaseNoteClass(Base) {
        if (!this.#cachedBaseClass) {
            this.#cachedBaseClass = Base;
        }
    }

    // starの上書き前提。
    // createInstance() 

    getNoteClass() {
        if (!this.#cachedBaseClass) {
            throw new Error('Base Class is not set.')
        }
        if (!this.#cachedNoteClass) {
            this.generateAndSetNoteClass(this.#cachedBaseClass);
        }
        return this.#cachedNoteClass;
    }

    generateAndSetNoteClass(Base) {
        this.#cachedNoteClass = class ToDoMocNote extends Base {
            // 継承先でプライベートメソッドは使えないので...
            #dv;
            constructor(schema, dv, file) {
                super(schema, dv, file);
                this.#dv = dv;
            }

            print() {
                this.printConnectedMocNotes();
                this.printToDoList();
                this.printChildContNotes()
            }

            printToDoList() {
                let resolvedHeader = ''
                let resolved = '';
                let outputs = {};

                this.childContNotes.forEach(n => {
                    const fm = n.file.frontmatter

                    if (fm.resolved) {
                        if(!outputs.resolved){
                            outputs.resolvedHeader = `resolved`;
                            outputs.resolved = ''
                            outputs.resolvedCount = 0;
                        }
                        outputs.resolved += `- ${n.file?.link}\n`;
                        outputs.resolvedCount++;
                        return;
                    }

                    const toDoType = this.#extractDisplayText(fm.toDoType);
                    const toDoTypes = ['goal', 'lowPriority', 'must', 'onHold', 'toTry', 'unfinishedResolved'];
                    
                    if (!toDoTypes.includes(toDoType)) {
                        if(!outputs.others){
                            outputs.othersHeader = `others`;
                            outputs.others = ''
                            outputs.othersCount = 0;
                        }
                        outputs.others += `- ${n.file?.link}\n`;
                        outputs.othersCount++;
                        return
                    }

                    toDoTypes.forEach(type => {
                        if (type !== toDoType) return;

                        if(!outputs[type]){
                            outputs[type + 'Header'] = `${type}`;
                            outputs[type] = ''
                            outputs[type + 'Count'] = 0;
                        }
                        outputs[type] += `- ${n.file?.link}\n`;
                        outputs[type + 'Count']++;
                    });

                });
                const orderList = ['must', 'lowPriority', 'goal', 'toTry', 'others', 'onHold', 'resolved', 'unfinishedResolved'];

                let output = "## ToDo List\n";
                orderList.forEach(item => {
                    output += outputs[item + 'Header'] 
                        ? '###### ' + outputs[item + 'Header'] + `（${ outputs[item + 'Count']}）` + '\n'
                        : '';
                    output += outputs[item] || '';
                });

                this.#dv.el('d', output);
            }

            #extractDisplayText(linkText) {
                if(!linkText) return;

                // [[]] を取り除く
                const trimmed = linkText.replace(/^\[\[|\]\]$/g, '');
            
                // パイプ区切りがあればその後ろ
                if (trimmed.includes('|')) {
                    return trimmed.split('|')[1];
                }
            
                // スラッシュ区切りがあれば最後の要素
                if (trimmed.includes('/')) {
                    const parts = trimmed.split('/');
                    return parts[parts.length - 1];
                }
            
                // そのまま返す
                return trimmed;
            }
        }
    }
}