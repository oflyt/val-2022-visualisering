class GeoPlot {
    constructor(svg, path, size) {
        this.svg = svg;
        this.path = path;
        this.size = size;
    }

    static setup(featureCollectionToProjectTo, svgSize) {
        const svg = d3.select("svg#map")
            .attr("width", svgSize.width)
            .attr("height", svgSize.height)
            .attr("transform", "translate(" + 0 + "," + 0 + ")");

        // Create projection
        const projection = d3
            .geoIdentity()
            .reflectY(true)
            .fitSize([svgSize.width, svgSize.height], featureCollectionToProjectTo);

        const path = d3.geoPath().projection(projection)

        const g = svg.append("g");

        return new GeoPlot(svg, path, svgSize);
    }

    fromGeoJson(featureCollection) {
        // Plot
        const paths = d3.select("g")
            .selectAll(null)
            .data(featureCollection.features)
            .enter()
            .append("path")
            .attr("d", this.path);

        // Add title if property exists
        paths
            .filter(d => d.properties.title)
            .append("title")
            .text(d => d.properties.title);

        return paths;
    }

    zoomIn(datum) {
        // Get the data for the selected region
        const path = this.path;
        const size = this.size;

        // Calculate the bounds of the region
        const 
            bounds = path.bounds(datum),
            elementWidth = bounds[1][0] - bounds[0][0],
            elementHeight = bounds[1][1] - bounds[0][1],
            elementCenterX = (bounds[0][0] + bounds[1][0]) / 2,
            elementCenterY = (bounds[0][1] + bounds[1][1]) / 2;

        // Calculate the scale and translation needed to center the region
        const
            scale = Math.max(1, Math.min(8, 0.9 / Math.max(elementWidth / size.width, elementHeight / size.height))),
            translate = [size.width / 2 - scale * elementCenterX, size.height / 2 - scale * elementCenterY];

        // Apply the transformation 
        d3.select("g")
            .transition().duration(1000)
            .attr("transform", "translate(" + translate + ") scale(" + scale + ")");
    }

    zoomOut() {
        d3.select("g")
            .transition().duration(1000)
            .attr("transform", "translate(" + [0, 0] + ")"); 
    }

}