<%*
	try {
		const NoteGeneratingSynther = customJS.NoteGeneratingSynther;
		NoteGeneratingSynther._setUp(tp, customJS);
		await NoteGeneratingSynther.adaptToMyNote();
	} catch(error) {
		console.log(error);
		new Notice("Script interrupt. Check console for more info");
	}
%>