<%*
const mainDir = 'Inbox';
const templateDir = 'System/Templates/Notes';

try {
	const templateFolder = tp.app.vault.getFolderByPath(templateDir);
	console.log(templateFolder.children);
} catch(error) {
	console.log(error);
	new Notice("Script interrupt. Check console for more info");a
}
%>

