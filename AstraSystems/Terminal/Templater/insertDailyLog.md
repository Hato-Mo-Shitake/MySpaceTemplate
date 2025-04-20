<%*
try {
	const selectList = ['resolved', 'completed'];
	const selected = await tp.system.suggester(
		selectList,
		selectList
	)
	if(!selected) {
		throw new Error("The entered value is null.")
	}
	
	const tFile = tp.app.vault.getFileByPath(tp.file.path(true));
	
	const d = new Date();
	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}_${days[d.getDay()]}`;
    
    await tp.app.fileManager.processFrontMatter(tFile, (fm) => {
	    fm[selected] = `[[${todayDate}]]`;
    });
} catch(error) {
	console.log(error);
	new Notice("Script interrupt. Check console for more info");
}
%>