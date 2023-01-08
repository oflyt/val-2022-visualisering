class EventHandlerFunctions {
    static focus(target, className) {
        if (!EventHandlerFunctions.hasSelection(className)) {
            // Nothing selected
            d3.selectAll(`.${className}`)
                .classed("hovered", false)
                .classed("out-of-focus", true)
                .attr("focus", null);
            return d3.select(target)
                .classed("hovered", true)
                .classed("out-of-focus", false)
                .attr("focus", "true");
        }
    }

    static outOfFocus(target, className) {
        if (!EventHandlerFunctions.hasSelection(className)) {
            // Nothing selected
            d3.selectAll(`.${className}`)
                .classed("hovered", false)
                .classed("out-of-focus", false)
                .attr("focus", null);
            return true;
        }
        return false;
    }

    static select(event, target, className) {
        if (d3.select(target).classed("selected")) {
            // If selected element was clicked
            // d3.select(target).attr("class", `${className}`); TODO: add de-selection, but need to be handled as well
            event.stopPropagation();
            return false;
        } else {
            // Something already selected
            d3.selectAll(`.${className}`).attr("class", `${className} out-of-focus not-selected`);
            d3.select(target).attr("class", `${className} selected`);
            event.stopPropagation();
            return true;
        } 
    }

    static activate(event, target, className) {
        if (d3.select(target).classed("active")) {
            // If selected element was clicked
            d3.select(target).attr("class", `${className}`);
            event.stopPropagation();
            return false;
        } else {
            // Something already selected
            d3.selectAll(`.${className}`).attr("class", `${className}`);
            d3.select(target).attr("class", `${className} active`);
            event.stopPropagation();
            return true;
        } 
    }

    static hasSelection(className) {
        return !d3.selectAll(`.${className}.selected`).empty();
    }

    static deselect(className) {
        if (!d3.selectAll(`.${className}.selected`).empty()) {
            d3.selectAll(`.${className}`).attr("class", `${className}`);
            return true;
        }
        return false;
    }
    
}