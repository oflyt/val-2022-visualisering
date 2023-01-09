class Country {

    static statistics() {
        return Data.Country.parties().then(parties => {
            Statistics.plot(parties);
        });
    }

    static listParties() {
        List.setTitle("Sverige (Riksdagsvalet)");
        return Data.Country.parties().then(listOfParties => {
            List.create(listOfParties);
        });
    }

}

class Region {

    static statistics() {
        const regionName = Region.nameOfSelected();
        return Data.Region.parties(regionName).then(parties => {
            Statistics.plot(parties);
        });
    }

    static listParties() {
        const regionName = Region.nameOfSelected();
        List.setTitle(regionName + " län (Regionsvalet)");
        return Data.Region.parties(regionName).then(listOfParties => {
            List.create(listOfParties);
        });
    }

    static plotAll(path, regions, svgSize) {
        GeoPlot.fromGeoJson(path, regions)
            .attr("class", "region")
            .attr("fill", "#FFF380")
            .on("mouseover", function(d) {EventHandlerFunctions.focus(this, "region");})
            .on("mouseout", function(d) {EventHandlerFunctions.outOfFocus(this, "region");})
            .on("click", function(d) {
                if (!EventHandlerFunctions.hasSelection("municipality")) {
                    const selected = EventHandlerFunctions.select(d, this, "region");
                    if (selected) {
                        Region.select(this, path, svgSize).then(() => Global.reselectParty());
                    }
                }
            });
    }

    static plotGradientColorForParty(partyName) {
        const allRegions = d3.selectAll(".region");
        const regionNames = allRegions.data().map(d => d.properties.LnNamn);
        Data.Region.partiesMultiple(regionNames).then(allPartyLists => {
            const color = Data.Party.toGradientColor(allPartyLists, partyName);
            allRegions.attr("fill", (d, i) => color(i));
        });
    }

    static clearColors() {
        d3.selectAll(".region").attr("fill", "#FFF380");
    }

    static select(domElement, path, svgSize) {
        const d3Element = d3.select(domElement);
        const regionName = d3Element.data()[0].properties.LnNamn

        Zoom.in(path, d3Element, svgSize);
        Municipality.clear();
        return Promise.all([
            Data.Municipality.geoJson(regionName)
                .then(municipalities => Municipality.plotAll(path, municipalities)),
            Region.listParties(),
            Region.statistics()
        ]);
    }

    static deselect() {
        Municipality.clear();
        Zoom.out();
        return Promise.all([
            Country.listParties(),
            Country.statistics()
        ]);
    }

    static nameOfSelected() {
        return d3.select(".region.selected").data()[0].properties.LnNamn;
    }

    static isSelected() {
        return EventHandlerFunctions.hasSelection("region")
    }

}

class Municipality {

    static statistics() {
        const municipalityName = Municipality.nameOfSelected();
        return Data.Municipality.parties(municipalityName).then(parties => {
            Statistics.plot(parties);
        });
    }

    static listParties() {
        const municipalityName = Municipality.nameOfSelected();
        List.setTitle(municipalityName + " kommun (Kommunalvalet)");
        return Data.Municipality.parties(municipalityName).then(listOfParties => {
            List.create(listOfParties);
        });
    }

    static plotAll(path, municipalities) {
        GeoPlot.fromGeoJson(path, municipalities)
            .attr("class", "municipality")
            .attr("fill", "#FFF380")
            .on("mouseover", function(d) {EventHandlerFunctions.focus(this, "municipality");})
            .on("mouseout", function(d) {EventHandlerFunctions.outOfFocus(this, "municipality");})
            .on("click", function(d) {
                const selected = EventHandlerFunctions.select(d, this, "municipality");
                if (selected) {
                    Municipality.select().then(() => Global.reselectParty(false));
                }
            });
    }

    static plotGradientColorForParty(partyName) {
        const allMunicipalities = d3.selectAll(".municipality");
        const municipalityNames = allMunicipalities.data().map(d => d.properties.KnNamn);
        Data.Municipality.partiesMultiple(municipalityNames).then(allPartyLists => {
            const color = Data.Party.toGradientColor(allPartyLists, partyName);
            allMunicipalities.attr("fill", (d, i) => color(i));
        });
    }

    static clearColors() {
        d3.selectAll(".municipality").attr("fill", "#FFF380");
    }

    static select() {
        return Promise.all([
            Municipality.listParties(),
            Municipality.statistics()
        ]);
    }

    static deselect() {
        return Promise.all([
            Region.listParties(),
            Region.statistics()
        ]);
    }

    static nameOfSelected() {
        return d3.select(".municipality.selected").data()[0].properties.KnNamn;
    }

    static isSelected() {
        return EventHandlerFunctions.hasSelection("municipality")
    }

    static clear() {
        d3.selectAll(".municipality").remove();
    }

}



function main() {
    const svgSize = {
        width: document.getElementById("map-view").clientWidth,
        height: document.getElementById("map-view").clientHeight
    };

    Data.Region.geoJson().then(regions => {
        const [svg, path] = GeoPlot.setup(regions, svgSize);
        Region.plotAll(path, regions, svgSize);
        svg.on("click", d => {
            if (EventHandlerFunctions.deselect("municipality")) {
                Municipality.deselect().then(() => Global.reselectParty(false));
            } else if (EventHandlerFunctions.deselect("region")) {
                Region.deselect().then(() => Global.reselectParty());
            } else if (Global.selectedParty) {
                Global.deselectParty();
            }
        });
        Country.listParties();
    })

    Statistics.setup();
    Country.statistics();
}

main();
