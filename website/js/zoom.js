class Zoom {
    static in(path, d3Element, svgSize) {
        // Get the data for the selected region
        const data = d3Element.data()[0];

        // Calculate the bounds of the region
        const 
            bounds = path.bounds(data),
            elementWidth = bounds[1][0] - bounds[0][0],
            elementHeight = bounds[1][1] - bounds[0][1],
            elementCenterX = (bounds[0][0] + bounds[1][0]) / 2,
            elementCenterY = (bounds[0][1] + bounds[1][1]) / 2;

        // Calculate the scale and translation needed to center the region
        const
            scale = Math.max(1, Math.min(8, 0.9 / Math.max(elementWidth / svgSize.width, elementHeight / svgSize.height))),
            translate = [svgSize.width / 2 - scale * elementCenterX, svgSize.height / 2 - scale * elementCenterY];

        // Apply the transformation 
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