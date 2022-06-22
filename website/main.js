function parseFloatSafe(value) {
    if (value == "") {
        return -1;
    } else {
        return parseFloat(value);
    }
}

class EventHandlerFunctions {
    static regionMouseover(d) {
        if (d3.selectAll(".region.selected").empty()) {
            // If no region is selected
            d3.selectAll(".region").attr("class", "region out-of-focus");
            d3.select(this).attr("class", "region hovered");
        }
    }

    static regionMouseout(d) {
        if (d3.selectAll(".region.selected").empty()) {
            // If no region is selected
            d3.selectAll(".region").attr("class", "region");
        }
    }

    static municipalityClicked(element, d) {
        d3.selectAll(".municipality.selected").attr("class", "municipality");
        d3.select(element).attr("class", "municipality selected");
        ChangeListSelection.municipality()
        d.stopPropagation();
    }

    static regionClick(element, d, path) {
        if (d3.selectAll(".region.selected").empty()) {
            // If nothing is already selected
            d3.select(element).attr("class", "region selected");
            Zoom.in(path);
            Plot.municipalityInRegion(path).then(function(municipalityPaths) {
                municipalityPaths.on("click", function(d) {EventHandlerFunctions.municipalityClicked(this, d);})
            });
            ChangeListSelection.region();
            d.stopPropagation();
        } else if (d3.select(element).classed("selected")) {
            // If selected element was clicked
            d.stopPropagation();
        }
    }
    
    static svgClick() {
        if (!d3.selectAll(".municipality.selected").empty()) {
            d3.selectAll(".municipality.selected").attr("class", "municipality");
            ChangeListSelection.region();
        } else if (!d3.selectAll(".region.selected").empty()) {
            // If any element is selected
            d3.selectAll(".municipality").remove();
            d3.selectAll(".region.selected").attr("class", "region");
            d3.selectAll(".region.hovered").attr("class", "region");
            Zoom.out();
            ChangeListSelection.riket();
        }
    }
}

class Zoom {
    static in(path) {
        const data = d3.select(".region.selected").data()[0];
        const bounds = path.bounds(data),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
            translate = [width / 2 - scale * x, height / 2 - scale * y];
        d3.select("g")
            .transition().duration(1000)
            .attr("transform", "translate(" + translate + ") scale(" + scale + ")");
    }

    static out() {
        d3.select("g")
            .transition().duration(1000)
            .attr("transform", "translate(" + [0, 0] + ")"); 
    }
}

class ChangeListSelection {
    static riket() {
        d3.select("#area-name").text("Sverige (Riksdagsvalet)");
        d3.dsv(";", "./parties/party-result-country.csv").then(function(listOfParties) {
            ChangeListSelection.listParties(listOfParties);
        })
    }

    static region() {
        var regionName = d3.select(".region.selected").data()[0].properties.LnNamn;
        d3.select("#area-name").text(regionName + " län (Regionsvalet)");
        if (regionName.charAt(regionName.length-1) == "s") {
            regionName = regionName.slice(0, regionName.length-1);
        }

        const fileName = "./parties/party-result-region-" + regionName + ".csv";
        console.log(fileName);
        d3.dsv(";", fileName).then(function(listOfParties) {
            ChangeListSelection.listParties(listOfParties);
        })
    }

    static municipality() {
        var municipalityName = d3.select(".municipality.selected").data()[0].properties.KnNamn;
        if (municipalityName == "Malung") {
            municipalityName = "Malung-Sälen";
        }
        d3.select("#area-name").text(municipalityName + " kommun (Kommunvalet)");

        const fileName = "./parties/party-result-municipality-" + municipalityName + ".csv";
        d3.dsv(";", fileName).then(function(listOfParties) {
            ChangeListSelection.listParties(listOfParties);
        })
    }

    static listParties(listOfParties) {
        d3.select("#list-view").selectAll("a").remove();
        const partiesDatums = d3.select("#list-view")
            .selectAll("a")
            .data(listOfParties)
            .enter()
            .append("a")
            .attr("href", "#")
            .attr("class", "list-group-item list-group-item-action")
            .text(d => d.PARTIBETECKNING)
            .sort((x, y) => d3.ascending(x.PARTIBETECKNING, y.PARTIBETECKNING))
            .sort((x, y) => d3.descending(parseFloatSafe(x.result_2018), parseFloatSafe(y.result_2018)));
        
        partiesDatums
            .append("div")
            .attr("class", "percentage")
            .text(function(d) {
                if (d.result_2018 == "") {
                    return "-";
                } else {
                    return parseFloat(d.result_2018).toFixed(3) + "%";
                }
            });
    }
}

class Plot {
    static regionsMap() {
        return d3.json("./geodata/regions.geojson").then(function(regions) {
            // Create projection
            const projection = d3
                .geoIdentity()
                .reflectY(true)
                .fitSize([width, height], regions);

            const path = d3.geoPath().projection(projection)

            // Draw the map
            const regionPaths = svg.append("g")
                .selectAll("path")
                .data(regions.features)
                .enter()
                .append("path")
                .attr("class", "region")
                .attr("fill", "#FFF380")
                .attr("d", path);

            regionPaths
                .append("title")
                .text(d => d.properties.LnNamn + " län");

            return [path, regionPaths];
        });
        
    }

    static municipalityInRegion(path) {
        const regionName = d3.select(".region.selected").data()[0].properties.LnNamn;
        return d3.json("./geodata/" + regionName + ".geojson").then(function (districs) {
            // Plot municipalities
            const municipalityPaths = d3.select("g")
                .selectAll(null)
                .data(districs.features)
                .enter()
                .append("path")
                .attr("class", "municipality")
                .attr("fill", "#FFF380")
                .attr("d", path);

            municipalityPaths
                .append("title")
                .text(d => d.properties.KnNamn);

            return municipalityPaths;
        });
    }
}

const width = document.getElementById("map-view").clientWidth,
    height = document.getElementById("map-view").clientHeight;

const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + 0 + "," + 0 + ")");

Plot.regionsMap().then(function([path, regionPaths]) {
    // Event handlers
    regionPaths
        .on("mouseover", EventHandlerFunctions.regionMouseover)                  
        .on("mouseout", EventHandlerFunctions.regionMouseout)
        .on("click", function(d) {EventHandlerFunctions.regionClick(this, d, path);});
    svg.on("click", d => EventHandlerFunctions.svgClick());

    // Party list
    ChangeListSelection.riket();
});