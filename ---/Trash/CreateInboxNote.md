<%*
const mainDir = 'Inbox';
const templateDir = 'System/Templates/Notes';
try {
	const {GenerateNoteModule} = await cJS();

	const selectedDirPath = await GenerateNoteModule.getSelectedDirPath(tp, mainDir);
	const templaterName = selectedDirPath
		.replace(mainDir + '/', '')
		.replace(/\//g, '-');
	const title = await GenerateNoteModule.getEnteredTitle(tp, selectedDirPath);
	const template = tp.file.find_tfile(templateDir + '/' + templaterName);
	const newTFile = await tp.file.create_new(
		template, title, false, selectedDirPath
	);
	// await tp.app.fileManager.processFrontMatter()
	const leaf = tp.app.workspace.splitActiveLeaf();
	leaf.openFile(newTFile);
} catch(error) {
	console.log(error);
	new Notice("Script interrupt. Check console for more info");
}
%>