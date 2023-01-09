class CountryMap {
    constructor(geoPlot, resultsPlot) {
        this.geoPlot = geoPlot;
        this.resultsPlot = resultsPlot;
    }

    static setup(featuresToFitTo, resultsPlot) {
        const svgSize = {
            width: document.getElementById("map-view").clientWidth,
            height: document.getElementById("map-view").clientHeight
        };
        const geoPlot = GeoPlot.setup(featuresToFitTo, svgSize);
        const countryMap = new CountryMap(geoPlot, resultsPlot);
        
        return countryMap;
    }

    regions(global, regions) {
        const 
            geoPlot = this.geoPlot,
            resultsPlot = this.resultsPlot,
            countryMap = this;
        geoPlot.fromGeoJson(regions)
            .attr("class", "region")
            .attr("fill", "#FFF380")
            .on("mouseover", function(e, d) {EventHandling.Default.focus(e, this, "region");})
            .on("mouseout", function(e, d) {EventHandling.Default.outOfFocus(e, this, "region");})
            .on("click", function(e, d) {
                if (!EventHandling.Helpers.hasActivation("municipality")) {
                    const result = EventHandling.Default.activate(e, this, "region");
                    if (result == EventHandling.ACTIVATED) {
                        Region.select(global, countryMap, resultsPlot, d).then(() => global.reselectParty());
                    }
                }
            });
    }

    municipalities(global, municipalities) {
        const 
            geoPlot = this.geoPlot,
            resultsPlot = this.resultsPlot;
        geoPlot.fromGeoJson(municipalities)
            .attr("class", "municipality")
            .attr("fill", "#FFF380")
            .on("mouseover", function(e, d) {EventHandling.Default.focus(e, this, "municipality");})
            .on("mouseout", function(e, d) {EventHandling.Default.outOfFocus(e, this, "municipality");})
            .on("click", function(e, d) {
                const result = EventHandling.Default.activate(e, this, "municipality");
                if (result == EventHandling.ACTIVATED) {
                    Municipality.select(global, resultsPlot).then(() => global.reselectParty(false));
                } else if (result == EventHandling.DEACTIVATED) {
                    Municipality.deselect(global);
                }
            });
    }

    plotGradientColorForParty(partyName) {
        // Plot gradient color according to votes for the party in different locations
        if (Municipality.isSelected() || Region.isSelected()) {
            const allMunicipalities = d3.selectAll(".municipality");
            const municipalityNames = allMunicipalities.data().map(d => d.properties.KnNamn);
            Data.Municipality.partiesMultiple(municipalityNames).then(allPartyLists => {
                const color = Data.Party.toGradientColor(allPartyLists, partyName);
                allMunicipalities.attr("fill", (d, i) => color(i));
            });
        } else {
            const allRegions = d3.selectAll(".region");
            const regionNames = allRegions.data().map(d => d.properties.LnNamn);
            Data.Region.partiesMultiple(regionNames).then(allPartyLists => {
                const color = Data.Party.toGradientColor(allPartyLists, partyName);
                allRegions.attr("fill", (d, i) => color(i));
            });
        }
    }

    clearColors() {
        d3.selectAll(".municipality").attr("fill", "#FFF380");
        d3.selectAll(".region").attr("fill", "#FFF380");
    }
}