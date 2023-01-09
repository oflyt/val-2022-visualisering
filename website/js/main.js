class Country {

    static statistics(global, resultsPlot) {
        return Data.Country.parties().then(parties => {
            const [bars, pieSlieces] = resultsPlot.plot(parties);
            global._bindMouseEventsToGlobal(bars);
            global._bindMouseEventsToGlobal(pieSlieces);
        });
    }

    static listParties(global) {
        PartyList.setTitle("Sverige (Riksdagsvalet)");
        return Data.Country.parties().then(listOfParties => {
            const listItems = PartyList.create(listOfParties);
            global._bindMouseEventsToGlobal(listItems);
        });
    }

}

class Region {

    static statistics(global, resultsPlot) {
        const regionName = Region.nameOfSelected();
        return Data.Region.parties(regionName).then(parties => {
            const [bars, pieSlieces] = resultsPlot.plot(parties);
            global._bindMouseEventsToGlobal(bars);
            global._bindMouseEventsToGlobal(pieSlieces);
        });
    }

    static listParties(global) {
        const regionName = Region.nameOfSelected();
        PartyList.setTitle(regionName + " län (Regionsvalet)");
        return Data.Region.parties(regionName).then(listOfParties => {
            const listItems = PartyList.create(listOfParties);
            global._bindMouseEventsToGlobal(listItems);
        });
    }

    static select(global, countryMap, resultsPlot, datum) {
        const regionName = datum.properties.LnNamn

        countryMap.geoPlot.zoomIn(datum);
        Municipality.clear();
        return Promise.all([
            Data.Municipality.geoJson(regionName).then(municipalities => countryMap.municipalities(global, municipalities)),
            Region.listParties(global),
            Region.statistics(global, resultsPlot)
        ]);
    }

    static deselect(global, countryMap, resultsPlot) {
        Municipality.clear();
        countryMap.geoPlot.zoomOut();
        return Promise.all([
            Country.listParties(global),
            Country.statistics(global, resultsPlot)
        ]);
    }

    static nameOfSelected() {
        return EventHandling.Helpers.getActive("region").data()[0].properties.LnNamn;
    }

    static isSelected() {
        return EventHandling.Helpers.hasActivation("region")
    }

}

class Municipality {

    static statistics(global, resultsPlot) {
        const municipalityName = Municipality.nameOfSelected();
        return Data.Municipality.parties(municipalityName).then(parties => {
            const [bars, pieSlieces] = resultsPlot.plot(parties);
            global._bindMouseEventsToGlobal(bars);
            global._bindMouseEventsToGlobal(pieSlieces);
        });
    }

    static listParties(global) {
        const municipalityName = Municipality.nameOfSelected();
        PartyList.setTitle(municipalityName + " kommun (Kommunalvalet)");
        return Data.Municipality.parties(municipalityName).then(listOfParties => {
            const listItems = PartyList.create(listOfParties);
            global._bindMouseEventsToGlobal(listItems);
        });
    }

    static select(global, resultsPlot) {
        return Promise.all([
            Municipality.listParties(global),
            Municipality.statistics(global, resultsPlot)
        ]);
    }

    static deselect(global, resultsPlot) {
        return Promise.all([
            Region.listParties(global),
            Region.statistics(global, resultsPlot)
        ]);
    }

    static nameOfSelected() {
        return EventHandling.Helpers.getActive("municipality").data()[0].properties.KnNamn;
    }

    static isSelected() {
        return EventHandling.Helpers.hasActivation("municipality")
    }

    static clear() {
        d3.selectAll(".municipality").remove();
    }

}

function main() {
    Data.Region.geoJson().then(regions => {
        const resultsPlot = Results.setup();
        const countryMap = CountryMap.setup(regions, resultsPlot);
        const global = new Global(countryMap, resultsPlot);
        
        resultsPlot.resultBarChart.barChart.svg.on("click", d => global.deselectParty())
        resultsPlot.resultPieChart.pieChart.svg.on("click", d => global.deselectParty())
        countryMap.geoPlot.svg.on("click", d => {
            if (EventHandling.Helpers.deactivate("municipality")) {
                Municipality.deselect(global, resultsPlot).then(() => global.reselectParty(false));
            } else if (EventHandling.Helpers.deactivate("region")) {
                Region.deselect(global, countryMap, resultsPlot).then(() => global.reselectParty());
            } else if (global.selectedParty) {
                global.deselectParty();
            }
        });

        countryMap.regions(global, regions);
        Promise.all([
            Country.listParties(global),
            Country.statistics(global, resultsPlot)
        ])
    })    
}

main();
