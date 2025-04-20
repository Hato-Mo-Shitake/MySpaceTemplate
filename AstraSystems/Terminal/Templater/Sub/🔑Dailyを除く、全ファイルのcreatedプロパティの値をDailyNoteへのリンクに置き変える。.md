<%*
function formatDateWithDay(datetime) {
	date = new Date(datetime);
	if (isNaN(date)) {
		console.log(`${datetime}: invalid date.`);
		return;
	}
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // 月は0始まり
    const dd = String(date.getDate()).padStart(2, '0');

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = days[date.getDay()]; // 曜日番号から文字列に変換

    return `${yyyy}-${mm}-${dd}_${day}`;
}

try {

throw new Error("用済み");

	const files = tp.app.vault.getFiles();
	console.log(files);
	for (const file of files) {
		await tp.app.fileManager.processFrontMatter(file, (fm) => {
			const created = fm.created;
			if (created) {
				fm["created"] = `[[${formatDateWithDay(created)}]]`; 
				console.log(`${file.name}.created changed.`);
			}
			const completed = fm.completed;
			if (completed) {
				fm["completed"] = `[[${formatDateWithDay(completed)}]]`; 
				console.log(`${file.name}.completed changed.`);
			}
		
			const resolved = fm.resolved;
			if (resolved) {
				fm["resolved"] = `[[${formatDateWithDay(resolved)}]]`;
				console.log(`${file.name}.resolved changed.`); 
			}
		});
	}
	console.log("script complated.");
} catch(error) {
	console.log(error);
	new Notice("Script interrupt. Check console for more info");
}
%>