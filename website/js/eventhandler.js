class EventHandling {
    static IDLE = 0;
    static ACTIVATED = 1;
    static DEACTIVATED = -1;

    static Default = class {
        static focus(event, target, className) {
            if (EventHandling.Helpers.isDisabled(target)) {
                event.stopPropagation();
                return;
            } else if (!EventHandling.Helpers.hasActivation(className)) {
                // Nothing selected
                return EventHandling.Helpers.setFocus(d3.select(target), className);
            }
        }
    
        static outOfFocus(event, target, className) {
            if (EventHandling.Helpers.isDisabled(target)) {
                event.stopPropagation();
                return;
            } else if (!EventHandling.Helpers.hasActivation(className)) {
                // Nothing selected
                d3.selectAll(`.${className}`).attr("focus", null);
                return true;
            }
            return false;
        }
    
        static activate(event, target, className) {
            if (EventHandling.Helpers.isDisabled(target)) {
                event.stopPropagation();
                return EventHandling.IDLE;
            } else if (d3.select(target).classed("active")) {
                // If selected element was clicked
                d3.selectAll(`.${className}`).attr("class", `${className}`);
                d3.select(target).attr("focus", "true");
                event.stopPropagation();
                return EventHandling.DEACTIVATED;
            } else {
                EventHandling.Helpers.setActivation(d3.select(target), className);
                event.stopPropagation();
                return EventHandling.ACTIVATED;
            } 
        }
    }

    
    static Helpers = class {

        static getActive(className) {
            return d3.select(`.${className}.active`);
        }
    
        static hasActivation(className) {
            return !d3.selectAll(`.${className}.active`).empty()
        }
    
        static isDisabled(target) {
            return d3.select(target).attr("disabled");
        }
    
        static setFocus(target, className) {
            d3.selectAll(`.${className}`).attr("focus", null);
            return target.attr("focus", "true");
        }
        
        static setActivation(target, className) {
            d3.selectAll(`.${className}`).attr("class", `${className} not-active`).attr("focus", null);
            return target.attr("class", `${className} active`);
        }
    
        static deactivate(className) {
            if (!d3.selectAll(`.${className}.active`).empty()) {
                d3.selectAll(`.${className}`).attr("class", `${className}`).attr("focus", null);
                return true;
            }
            return false;
        }
    }
}