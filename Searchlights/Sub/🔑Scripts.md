---
tags:
  - MOC
belongsTo:
  - "[[📔System]]"
---
## Child MOCs
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

---
## Content Notes
```dataviewjs
const list = dv.pages('"System/Scripts"').values.map(f => f.file.link).sort().reverse();
dv.list(list);
```

