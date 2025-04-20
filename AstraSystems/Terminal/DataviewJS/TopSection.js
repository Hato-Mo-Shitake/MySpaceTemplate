if (typeof customJS === 'undefined') {
    dv.el('b', 'customJS is not loaded. Please reload.');
} else {
    try {
        const NoteTopSectionSynther = customJS.NoteTopSectionSynther;
        await NoteTopSectionSynther._setUp(dv, customJS);
        NoteTopSectionSynther.exec();
    } catch (e) {
        dv.el('b', "Error: Check console.");
        console.log(e);
    }
}