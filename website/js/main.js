class Country {

    static statistics(globalPartySelection, resultsPlot) {
        return Data.Country.parties().then(parties => {
            const [bars, pieSlieces] = resultsPlot.plot(parties);
            globalPartySelection._bindMouseEventsToGlobal(bars);
            globalPartySelection._bindMouseEventsToGlobal(pieSlieces);
        });
    }

    static listParties(globalPartySelection) {
        PartyList.setTitle("Sverige (Riksdagsvalet)");
        return Data.Country.parties().then(listOfParties => {
            const listItems = PartyList.create(listOfParties);
            globalPartySelection._bindMouseEventsToGlobal(listItems);
        });
    }

}

class Region {

    static statistics(globalPartySelection, resultsPlot) {
        const regionName = Region.nameOfSelected();
        return Data.Region.parties(regionName).then(parties => {
            const [bars, pieSlieces] = resultsPlot.plot(parties);
            globalPartySelection._bindMouseEventsToGlobal(bars);
            globalPartySelection._bindMouseEventsToGlobal(pieSlieces);
        });
    }

    static listParties(globalPartySelection) {
        const regionName = Region.nameOfSelected();
        PartyList.setTitle(regionName + " län (Regionsvalet)");
        return Data.Region.parties(regionName).then(listOfParties => {
            const listItems = PartyList.create(listOfParties);
            globalPartySelection._bindMouseEventsToGlobal(listItems);
        });
    }

    static select(globalPartySelection, countryMap, resultsPlot, datum) {
        const regionName = datum.properties.LnNamn

        countryMap.geoPlot.zoomIn(datum);
        Municipality.clear();
        return Promise.all([
            Data.Municipality.geoJson(regionName).then(municipalities => countryMap.municipalities(globalPartySelection, municipalities)),
            Region.listParties(globalPartySelection),
            Region.statistics(globalPartySelection, resultsPlot)
        ]);
    }

    static deselect(globalPartySelection, countryMap, resultsPlot) {
        Municipality.clear();
        countryMap.geoPlot.zoomOut();
        return Promise.all([
            Country.listParties(globalPartySelection),
            Country.statistics(globalPartySelection, resultsPlot)
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

    static statistics(globalPartySelection, resultsPlot) {
        const municipalityName = Municipality.nameOfSelected();
        return Data.Municipality.parties(municipalityName).then(parties => {
            const [bars, pieSlieces] = resultsPlot.plot(parties);
            globalPartySelection._bindMouseEventsToGlobal(bars);
            globalPartySelection._bindMouseEventsToGlobal(pieSlieces);
        });
    }

    static listParties(globalPartySelection) {
        const municipalityName = Municipality.nameOfSelected();
        PartyList.setTitle(municipalityName + " kommun (Kommunalvalet)");
        return Data.Municipality.parties(municipalityName).then(listOfParties => {
            const listItems = PartyList.create(listOfParties);
            globalPartySelection._bindMouseEventsToGlobal(listItems);
        });
    }

    static select(globalPartySelection, resultsPlot) {
        return Promise.all([
            Municipality.listParties(globalPartySelection),
            Municipality.statistics(globalPartySelection, resultsPlot)
        ]);
    }

    static deselect(globalPartySelection, resultsPlot) {
        return Promise.all([
            Region.listParties(globalPartySelection),
            Region.statistics(globalPartySelection, resultsPlot)
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
        const globalPartySelection = new GlobalPartySelection(countryMap, resultsPlot);
        
        resultsPlot.resultBarChart.barChart.svg.on("click", e => globalPartySelection.deselectParty());
        resultsPlot.resultPieChart.pieChart.svg.on("click", e => globalPartySelection.deselectParty());
        countryMap.geoPlot.svg.on("click", e => {
            if (EventHandling.Helpers.deactivate("municipality")) {
                Municipality.deselect(globalPartySelection, resultsPlot).then(() => globalPartySelection.reselectParty(false));
            } else if (EventHandling.Helpers.deactivate("region")) {
                Region.deselect(globalPartySelection, countryMap, resultsPlot).then(() => globalPartySelection.reselectParty());
            } else if (globalPartySelection.selectedParty) {
                globalPartySelection.deselectParty();
            }
        });

        countryMap.regions(globalPartySelection, regions);
        Promise.all([
            Country.listParties(globalPartySelection),
            Country.statistics(globalPartySelection, resultsPlot)
        ])
    })    
}

main();
