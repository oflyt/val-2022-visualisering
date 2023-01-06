class Country {

    static statistics() {
        Data.Country.parties().then(function(parties) {
            Statistics.plot(parties);
        });
    }

    static listParties() {
        List.setTitle("Sverige (Riksdagsvalet)");
        Data.Country.parties().then(function(listOfParties) {
            List.create(listOfParties);
        });
    }

}

class Region {

    static statistics() {
        const regionName = Region.nameOfSelected();
        Data.Region.parties(regionName).then(function(parties) {
            Statistics.plot(parties);
        });
    }

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
        Region.statistics();
    }

    static deselect() {
        Municipality.clear();
        Zoom.out();
        Country.listParties();
        Country.statistics();
    }

    static nameOfSelected() {
        return d3.select(".region.selected").data()[0].properties.LnNamn;
    }

}

class Municipality {

    static statistics() {
        const municipalityName = Municipality.nameOfSelected();
        Data.Municipality.parties(municipalityName).then(function(parties) {
            Statistics.plot(parties);
        });
    }

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
        Municipality.listParties();
        Municipality.statistics();
    }

    static deselect() {
        Region.listParties();
        Region.statistics();
    }

    static nameOfSelected() {
        return d3.select(".municipality.selected").data()[0].properties.KnNamn;
    }

    static clear() {
        d3.selectAll(".municipality").remove();
    }

}

class Statistics {
    static setup() {
        Statistics.setupBarChart();
        Statistics.setupPieChart();
    }

    static setupPieChart() {
        const svgSize = {
            width: document.getElementById("pie-chart-container").clientWidth,
            height: document.getElementById("pie-chart-container").clientHeight
        };
        const svg = d3.select("svg#pie-chart")
            .attr("width", svgSize.width)
            .attr("height", svgSize.height)
            .attr("transform", "translate(" + 0 + "," + 0 + ")");
        svg.append("g")
            .attr("transform", "translate(" + svgSize.width / 2 + "," + svgSize.height / 2 + ")");
    }

    static setupBarChart() {
        const svgSize = {
            width: document.getElementById("bar-chart-container").clientWidth,
            height: document.getElementById("bar-chart-container").clientHeight
        };
        const svg = d3.select("svg#bar-chart")
            .attr("width", svgSize.width)
            .attr("height", svgSize.height)
            .attr("transform", "translate(" + 0 + "," + 0 + ")");
        svg.append("g")
            .attr("transform", "translate(" + svgSize.width / 2 + "," + svgSize.height / 2 + ")");
    }

    static plot(parties) {
        Statistics.clear();
        const data = Statistics.transformData(parties);
        Statistics.barChart(data);
        Statistics.pieChart(data);
    }

    static pieChart(data) {
        // Prep variables
        const 
            svg = d3.select("svg#pie-chart"),
            width = +svg.attr("width"),
            height = +svg.attr("height"),
            radius = Math.min(width, height) / 2;
        const title = i => data[i].title;
        const color = d3.scaleOrdinal(data.map(v => v.color));

        // Create the pie chart layout
        const pie = d3.pie();

        // Use the arc generator to create the path data for the pie chart slices
        const arc = d3.arc()
            .outerRadius(radius)
            .innerRadius(0);

        // Arc for each data point
        const arcs = svg.select("g")
            .selectAll("arc")
            .data(pie(data.map(v => v.value)))
            .enter()
            .append("g")
            .attr("class", "arc");

        // Plot arc and add title
        arcs
            .append("path")
            .attr("d", arc)
            .attr("fill", (d, i) => color(i))
            .append("title")
            .text((d, i) => title(i));
    }

    static barChart(data) {
        // Set graph margins and dimensions
        const 
            margin = {top: 40, right: 40, bottom: 40, left: 40},
            svg = d3.select("svg#bar-chart"),
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;
        const color = d3.scaleOrdinal(data.map(v => v.color));

        const g = svg.select("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        // Set ranges
        var x = d3.scaleBand().range([0, width]).padding(0.2);
        var y = d3.scaleLinear().range([height, 0]);

        // Scale the range of the data in the domains
        x.domain(data.map(d => d.title));
        y.domain([0, d3.max(data, d => d.value)]);

        // Append rectangles for bar chart
        g.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.title))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.value))
            .attr("height", d => height - y(d.value))
            .attr("fill", (d, i) => color(i));

        // Add x axis
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
                // .selectAll("text")  
                // .style("text-anchor", "end")
                // .attr("dx", "-.8em")
                // .attr("dy", ".15em")
                // .attr("transform", "rotate(-65)");;

        // Add y axis
        g.append("g")
            .call(d3.axisLeft(y));
    }

    static transformData(parties) {
        // Transform data
        const data = parties
            .filter(party => party.result_2018 != "" && parseFloat(party.result_2018) > 1.0)
            .map(function(party){
                return {
                    title: party.PARTIFÖRKORTNING,
                    color: Optional.of(party.color).else("grey"), //'#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6),
                    value: parseFloat(party.result_2018)
                }
            });
        data.push({title: "Others", color: "grey", value: 100.0 - data.map(v => v.value).reduce((x,y) => x+y, 0)})
        data.sort((v1, v2) => d3.descending(v1.value, v2.value))
        return data;
    }

    static clear() {
        d3.selectAll("svg#pie-chart > g > *").remove();
        d3.selectAll("svg#bar-chart > g > *").remove();
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

    Statistics.setup();
    Country.statistics();
}

main();
