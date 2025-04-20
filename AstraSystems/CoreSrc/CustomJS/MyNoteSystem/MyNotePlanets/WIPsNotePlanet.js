class WIPsNotePlanet {

    #cachedBaseClass;
    #cachedNoteClass;

    constructor() {
        console.log("WIPsNotePlanet is instantiated.");
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
        this.#cachedNoteClass = class WIPsNote extends Base {
            // 継承先でプライベートメソッドは使えないので...
            #dv;
            constructor(schema, dv, file) {
                super(schema, dv, file);
                this.#dv = dv;
            }

            /**
             * @override
             */
            printTopSection() {
                const d = new Date();
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const todayDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}_${days[d.getDay()]}`;
    
                const dailyTFile = this.#dv.app.vault.getFileByPath(`DailyLogs/${todayDate}.md`);
                if (!dailyTFile) {
                    this.#dv.el("b", "# No DailyLog Today!!");
                    return;
                } else {
                    this.#dv.el("b", `###### DalyLog`);
                    this.#dv.el("d", `- today : [[${todayDate}]]\n- created : ${this.file.frontmatter.created}`);
                }

                this.#dv.el("b", `###### Note Type : [[AstraSystems/Orbits/NoteTypes/${this.noteType}|${this.noteType}]]`);
                this.printNoteLinks('parents', this.parentNotes);
                this.printChildOrSiblingNoteLinks('children', this.childNotes);
                this.printChildOrSiblingNoteLinks('siblings', this.siblingNotes);
                this.printNoteLinks('related to', this.relatedNotes);

            }

            printChildOrSiblingNoteLinks(header, myNotes) {
                if (!myNotes?.length) return;

                let output = '';
                output += `## ${header}\n`

                let toDoNotesOutput = '';
                let resolvedNotesOutput = '';

                let thisTypeWipsNotesOutput = '';
                let completedeNotesOutput = '';

                let otherNotesOutput = '';

                myNotes.forEach(n => {
                    switch (n.noteType) {
                        case 'ToDo':
                            if (n.file.frontmatter?.resolved) {
                                resolvedNotesOutput += `- ${n.file?.link}\n`
                            } else {
                                toDoNotesOutput += `- ${n.file?.link}\n`
                            }
                            break;

                        case this.noteType:
                            if (n.file.frontmatter?.completed) {
                                completedeNotesOutput += `- ${n.file?.link}\n`
                            } else {
                                thisTypeWipsNotesOutput += `- ${n.file?.link}\n`
                            }
                            break;

                        default: 
                            otherNotesOutput += `- ${n.file?.link}（${n.noteType}）\n`
                    }
                })

                output += thisTypeWipsNotesOutput;

                if (completedeNotesOutput) {
                    output += `###### completed\n`;
                    output += completedeNotesOutput;
                }
                
                if (toDoNotesOutput) {
                    output += `#### toDo\n`;
                    output += toDoNotesOutput;
                }

                if (resolvedNotesOutput) {
                    output += `###### resolved\n`;
                    output += resolvedNotesOutput;
                }

                if (otherNotesOutput) {
                    output += `#### others\n`;
                    output += otherNotesOutput
                }
                
                this.#dv.el('d', output);
            }
        };
    }
}
