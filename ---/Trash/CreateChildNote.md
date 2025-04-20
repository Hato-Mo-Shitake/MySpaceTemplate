<%*
const mainDir = 'Inbox';
const templateDir = 'System/Templates/Notes';

function startsWithUpper(str) {
	if(!str || str.lengrh === 0) {
		return false;
	}
	const firstChar = str.charAt(0);
	return firstChar.match(/^[A-Z]$/);
}

try {
	const currentParh = tp.file.path(true);
	const currentTitle = tp.file.title; 
	const {GenerateNoteModule} = await cJS();

	const isCurrentType = await tp.system.suggester(
		["current note type", "select note type"],
		[true, false]
	);
	let selectedDirPath = '';
	if (isCurrentType) {
		// タグの一文字目は「#」
		const tags = tp.file.tags.map(tag => tag.slice(1));		
		const targetTag = tags.find(tag => startsWithUpper(tag));
		console.log(targetTag);
		selectedDirPath += mainDir + '/' + targetTag;
		
	} else {
		selectedDirPath += await GenerateNoteModule.getSelectedDirPath(tp, mainDir);
	}
	

	const templateName = selectedDirPath
		.replace(mainDir + '/', '')
		.replace(/\//g, '-');
	const title = await GenerateNoteModule.getEnteredTitle(tp, selectedDirPath);
	const template = tp.file.find_tfile(templateDir + '/' + templateName);
	const newTFile = await tp.file.create_new(
		template, title, false, selectedDirPath
	);
	
	await tp.app.fileManager.processFrontMatter(newTFile, (fm) => {
		fm['belongsTo'] = [`[[${currentParh.slice(0, -3)}|${currentTitle}]]`]
	});
	
	const leaf = tp.app.workspace.splitActiveLeaf();
	leaf.openFile(newTFile);
} catch(error) {
	console.log(error);
	new Notice("Script interrupt. Check console for more info");
}
%>