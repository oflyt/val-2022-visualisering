class EventHandlerFunctions {
    static focus(domElement, className) {
        if (!EventHandlerFunctions.hasSelection(className)) {
            // Nothing selected
            d3.selectAll(`.${className}`)
                .classed("hovered", false)
                .classed("out-of-focus", true);
            return d3.select(domElement)
                .classed("hovered", true)
                .classed("out-of-focus", false);
        }
    }

    static outOfFocus(domElement, className) {
        if (!EventHandlerFunctions.hasSelection(className)) {
            // Nothing selected
            d3.selectAll(`.${className}`)
                .classed("hovered", false)
                .classed("out-of-focus", false);
            return true;
        }
        return false;
    }

    static select(datum, domElement, className) {
        if (EventHandlerFunctions.hasSelection(className)) {
            // Something already selected
            d3.selectAll(`.${className}`).attr("class", `${className} out-of-focus not-selected`);
            d3.select(domElement).attr("class", `${className} selected`);
            datum.stopPropagation();
            return true;
        } else if (d3.selectAll(`.${className}.selected`).empty()) {
            // Nothing selected
            d3.selectAll(`.${className}`).attr("class", `${className} out-of-focus not-selected`);
            d3.select(domElement).attr("class", `${className} selected`);
            datum.stopPropagation();
            return true;
        } else if (d3.select(domElement).classed("selected")) {
            // If selected element was clicked
            datum.stopPropagation();
        }
        return false;
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