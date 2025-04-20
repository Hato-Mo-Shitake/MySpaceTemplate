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
# Index
- [[理念]]
- [[ディレクトリ構造]]
- [[命名規則]]
- [[ノートについて]]
- [[タグ（＃hoge）の扱いについて]]
