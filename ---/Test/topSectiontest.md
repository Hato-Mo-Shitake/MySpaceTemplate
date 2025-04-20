```js
if (typeof customJS === 'undefined') {
	dv.el('b', 'customJS is not loaded. Please reload.');
} else {
	try {
		const NoteTopSectionProvider = customJS['NoteTopSectionProvider'];
		await NoteTopSectionProvider.print(dv, app.vault, customJS);
	} catch (e) {
		dv.el('b', "Error: Check console.")
		console.log(e)
	}
}
```
↓
```js
if (typeof customJS === 'undefined') {
	dv.el('b', 'customJS is not loaded. Please reload.');
} else {
	try {
		const NoteTopSectionSynther = customJS.NoteTopSectionSynther;
		await NoteTopSectionSynther.print(customJS, {dv: dv, vault: app.vault});
	} catch (e) {
		dv.el('b', "Error: Check console.")
		console.log(e)
	}
}
```
