<%*
try {
	const NoteGeneratingSynther = customJS.NoteGeneratingSynther;
	await NoteGeneratingSynther._setUp(tp, customJS);
	await NoteGeneratingSynther.createMyNoteOld();
} catch(error) {
	console.log(error);
	new Notice("Script interrupt. Check console for more info");
}
%>