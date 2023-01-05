class Country {

    static listParties() {
        List.setTitle("Sverige (Riksdagsvalet)");
        Data.Country.parties().then(function(listOfParties) {
            List.create(listOfParties);
        });
    }

}

class Region {

    static listParties() {
        const regionName = Region.nameOfSelected();
        List.setTitle(regionName + " län (Regionsvalet)");
        Data.Region.parties(regionName).then(function(listOfParties) {
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
                if(!EventHandlerFunctions.hasSelection("municipality")) {
                    const selected = EventHandlerFunctions.select(d, this, "region");
                    if(selected) {
                        Region.select(this, path, svgSize);
                    }
                }
            });
    }

    static select(domElement, path, svgSize) {
        const d3Element = d3.select(domElement);
        const regionName = d3Element.data()[0].properties.LnNamn

        Zoom.in(path, d3Element, svgSize);
        Municipality.clear();
        Data.Municipality.geoJson(regionName)
            .then(municipalities => Municipality.plotAll(path, municipalities));
        Region.listParties();
    }

    static deselect() {
        Municipality.clear();
        Zoom.out();
        Country.listParties();
    }

    static nameOfSelected() {
        return d3.select(".region.selected").data()[0].properties.LnNamn;
    }

}

class Municipality {

    static listParties() {
        const municipalityName = Municipality.nameOfSelected();
        List.setTitle(municipalityName + " kommun (Kommunalvalet)");
        Data.Municipality.parties(municipalityName).then(function(listOfParties) {
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
                if(selected) {
                    Municipality.select();
                }
            });
    }

    static select() {
        Municipality.listParties()
    }

    static deselect() {
        Region.listParties();
    }

    static nameOfSelected() {
        return d3.select(".municipality.selected").data()[0].properties.KnNamn;
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

    Data.Region.geoJson().then(function(regions) {
        const [svg, path] = GeoPlot.setup(regions, svgSize);
        Region.plotAll(path, regions, svgSize);
        svg.on("click", function(d) {
            if(EventHandlerFunctions.deselect("municipality")) {
                Municipality.deselect();
            } else if (EventHandlerFunctions.deselect("region")) {
                Region.deselect();
            }
        });
        Country.listParties();
    })
}

main();
