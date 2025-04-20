<%*
try {
	const {GenerateSchemaModule} = await cJS();
	await GenerateSchemaModule.generateNoteSchemaDoc(tp);
} catch(error) {
	console.log(error);
	new Notice("Script interrupt. Check console for more info");
}
%>