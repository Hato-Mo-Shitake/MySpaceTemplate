<%*
const mainDir = 'Inbox';
const templateDir = 'System/Templates/Notes';
try {
	const selectedDirPath = await window.getSelectedDirPath(tp, mainDir);
	const folderName = window.getNameFromPath(selectedDirPath);
	const title = await window.getEnteredTitle(tp, selectedDirPath);
	const template = tp.file.find_tfile(templateDir + '/' + folderName);
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