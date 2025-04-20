class SchemaBuildingSynther {

    #tp;
    #customJS

    constructor() {
        this._isReady = false;
        console.log("SchemaBuildingSynther is instantiated.");
    }

    _setUp(tp, customJS, option = '') {
        // @todo 依存性の注入。規模が大きくなったら、以下をinjectDeps()などに切り分ける。
        this.#tp = tp;
        this.#customJS = customJS;
        this._isReady = true;
    }

    async exec() {
        this.#checkReady();

        // for (key of builderKeys) {
        //     const builder = this.#customJS[key];
        //     if (builder) {
        //         builder.build();
        //     }
        // }

        new Notice('All process completed.');
    }

    async buildForMocSection() {
        this.#checkReady();

        const SchemaBuildingStar = this.#customJS.SchemaBuildingStar;
        await SchemaBuildingStar._setUp(this.#tp);

        const SchemaBuildingPlanet = this.#customJS.SchemaBuildingPlanet;
        await SchemaBuildingPlanet._setUp(SchemaBuildingStar);

        await SchemaBuildingPlanet.buildForMocSection();

        new Notice('buildForNoteTopSection process completed.');
    }

    async buildForNoteTopSection() {
        this.#checkReady();

        const SchemaBuildingStar = this.#customJS.SchemaBuildingStar;
        await SchemaBuildingStar._setUp(this.#tp);

        const SchemaBuildingPlanet = this.#customJS.SchemaBuildingPlanet;
        await SchemaBuildingPlanet._setUp(SchemaBuildingStar);

        await SchemaBuildingPlanet.buildForNoteTopSection();

        new Notice('buildForNoteTopSection process completed.');
    }

    #checkReady() {
        if (!this._isReady) {
            throw new Error("SchemaBuildingSynther is not ready.")
        }
    }
}



