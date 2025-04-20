<%*
try {
	const SchemaBuildingSynther =  customJS.SchemaBuildingSynther;
	SchemaBuildingSynther._setUp(tp, customJS);
	await SchemaBuildingSynther.buildForMocSection();
} catch(error) {
	console.log(error);
	new Notice("Error: Check console for more info");
}
%>