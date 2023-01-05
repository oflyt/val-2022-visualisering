class GeoPlot {

    static setup(featureCollectionToProjectTo, svgSize) {
        const svg = d3.select("svg")
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

        return [svg, path];
    }

    static fromGeoJson(path, featureCollection) {
        // Plot
        const paths = d3.select("g")
            .selectAll(null)
            .data(featureCollection.features)
            .enter()
            .append("path")
            .attr("d", path);

        // Add title if property exists
        paths
            .each(function(d) {
                if(d.properties.title) {
                    d3.select(this)
                        .append("title")
                        .text(d => d.properties.title);
                }
            });

        return paths;
    }

}