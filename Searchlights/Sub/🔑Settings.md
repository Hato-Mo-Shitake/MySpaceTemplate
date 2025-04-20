---
tags:
  - MOC
belongsTo:
  - "[[📔System]]"
---
## Children
```dataviewjs
if (typeof customJS === 'undefined') {
	dv.el('b', 'customJS is not loaded. Please reload.');
} else {
	try {
		const MocNoteModule = customJS['MocNoteModule'];
		const currentMNote = MocNoteModule.createCurrentInstance(dv);
		currentMNote.printAllDescendantMNotes();
	} catch (e) {
		dv.el('b', "Error: Check console.");
		console.log(e);
	}
}
```
