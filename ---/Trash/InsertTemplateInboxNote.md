<%*
	const mainDir = 'Inbox';
	const templateDir = 'System/Templates/Notes';
	try {
		if (!customJS?.state?._ready) {
			throw new Error("customJS is not fully loaded.");
		} 
		const {GenerateNoteModule} = await cJS();
		
		const selectedDirPath = await GenerateNoteModule.getSelectedDirPath(tp, mainDir);
		const templaterName = selectedDirPath
			.replace(mainDir + '/', '')
			.replace(/\//g, '-');
		const templateTFile = tp.file.find_tfile(templateDir + '/' + templaterName);
		const result = await tp.file.include(templateTFile);

		// template Result
		tR += result;
		await tp.file.move(selectedDirPath + '/' + tp.file.title);
	} catch(error) {
		console.log(error);
		new Notice("Script interrupt. Check console for more info");
	}
%>