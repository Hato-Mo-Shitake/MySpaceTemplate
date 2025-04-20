```dataviewjs
if (typeof customJS === 'undefined') {
	dv.el('b', 'customJS is not loaded. Please reload.');
} else {
	try {
		const WIPsNoteModule = customJS['WIPsNoteModule'];
		console.log(WIPsNoteModule);
		
	} catch (e) {
		dv.el('b', "Error: Check console.")
		console.log(e)
	}
}
```

