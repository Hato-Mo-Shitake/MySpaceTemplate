if (typeof customJS === 'undefined') {
	dv.el('b', 'customJS is not loaded. Please reload.');
} else {
	try {
		const MocNoteSynther = customJS.MocNoteSynther;
		await MocNoteSynther._setUp(dv, customJS);
		MocNoteSynther.exec();
	} catch (e) {
		dv.el('b', "Error: Check console.");
		console.log(e);
	}
}