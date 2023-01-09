class EventHandlerFunctions {
    static focus(target, className) {
        if (!EventHandlerFunctions.hasSelection(className) && !EventHandlerFunctions.hasActivation(className)) {
            // Nothing selected
            return EventHandlerFunctions.setFocus(d3.select(target), className);
        }
    }

    static outOfFocus(target, className) {
        if (!EventHandlerFunctions.hasSelection(className) && !EventHandlerFunctions.hasActivation(className)) {
            // Nothing selected
            d3.selectAll(`.${className}`).attr("focus", null);
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
            EventHandlerFunctions.setSelection(d3.select(target), className);
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
            EventHandlerFunctions.setActivation(d3.select(target), className);
            event.stopPropagation();
            return true;
        } 
    }

    static hasSelection(className) {
        return !d3.selectAll(`.${className}.selected`).empty();
    }

    static hasActivation(className) {
        return !d3.selectAll(`.${className}.active`).empty()
    }

    static setFocus(target, className) {
        d3.selectAll(`.${className}`).attr("focus", null);
        return target.attr("focus", "true");
    }
    
    static setActivation(target, className) {
        d3.selectAll(`.${className}`).attr("class", `${className}`).attr("focus", null);
        return target.attr("class", `${className} active`);
    }

    static setSelection(target, className) {
        d3.selectAll(`.${className}`).attr("class", `${className} not-selected`).attr("focus", null);
        return target.attr("class", `${className} selected`);
    }

    static deselect(className) {
        if (!d3.selectAll(`.${className}.selected`).empty()) {
            d3.selectAll(`.${className}`).attr("class", `${className}`).attr("focus", null);
            return true;
        }
        return false;
    }
    
}