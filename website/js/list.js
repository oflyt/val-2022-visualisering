class List {
    static setTitle(title) {
        d3.select("#area-name").text(title);
    }

    static create(listOfParties) {
        List.clear();
        d3.select("#list-content")
            .selectAll("a")
            .data(listOfParties)
            .enter()
            .append("a")
            .attr("href", "#")
            .attr("class", "list-group-item")
            .sort((x, y) => d3.ascending(x.name, y.name))
            .sort((x, y) => d3.descending(
                Optional.of(x.value).map(parseFloat).else(-1), 
                Optional.of(y.value).map(parseFloat).else(-1)
            ))
            .on("mouseover", function(e, d) {
                if (Global.selectedParty) return;
                if (this != e.target || d3.select(e.target).attr("disabled")) {
                    e.stopPropagation();
                    return;
                } 
                const focused = EventHandlerFunctions.focus(e.target, "list-group-item");
                if (focused) {
                    Global.focusParty(d.name);
                }
            })
            .on("mouseout", function(e, d) {
                if (Global.selectedParty) return;
                if (this != e.target || d3.select(e.target).attr("disabled")) {
                    e.stopPropagation();
                    return;
                } 
                const gotOutOfFocus = EventHandlerFunctions.outOfFocus(e.target, "list-group-item");
                if (gotOutOfFocus) {
                    Global.deselectParty();
                }
            })
            .on("click", function(e, d) {
                if (this != e.target) return;
                if (d3.select(e.target).attr("disabled")) return;
                const selected = EventHandlerFunctions.activate(e, e.target, "list-group-item");
                if (selected) {
                    Global.selectParty(d.name);
                }
            })
            .attr("disabled", (d,i,g) => {
                if (d.value && d.value >= 0.0045) {
                    return null;
                } else {
                    return "true";
                }
            })
            .each(function(d) {
                if (d.color) {
                    Append.selectedBy(this).colorLabel(d.color);
                    Append.selectedBy(this).span(" ");
                }
                if (d.url != "") {
                    Append.selectedBy(this).link(d.url, d.name);
                } else {
                    Append.selectedBy(this).text(d.name);
                }

                Append.selectedBy(this)
                    .floatRight()
                    .text(Optional.of(d.value).map(v => parseFloat(v).toFixed(3) + "%").else("-"));
            });
    }
    
    static findItemWith(partyName) {
        return d3.selectAll(".list-group-item").filter(d => d.name == partyName);
    }

    static focus(toFocus) {
        EventHandlerFunctions.setFocus(toFocus, "list-group-item");
    }

    static activate(toActivate) {
        EventHandlerFunctions.setActivation(toActivate, "list-group-item");
    }

    static deselect() {
        d3.selectAll(".list-group-item").attr("class", "list-group-item");
    }

    static clear() {
        d3.selectAll("#list-content > *").remove();
    }

}

class Append {
    constructor(selected) {
        this.selected = selected;
    }

    static selectedBy(selector) {
        return new Append(d3.select(selector));
    }

    colorLabel(color) {
        const newElement = this.selected
            .append("span")
            .attr("style", "background-color:" + color + "; color:" + color)
            .text("_");
            return new Append(newElement);
    }

    link(url, text) {
        const newElement = this.selected
            .append("a")
            .attr("href", url)
            .attr("target", "_blank")
            .text(text);
        return new Append(newElement);
    }

    span(text) {
        const newElement = this.selected
            .append("span")
            .text(text);
        return new Append(newElement);
    }

    text(text) {
        const newElement = this.selected.text(text);
        return new Append(newElement);
    }

    floatRight() {
        const newElement = this.selected
            .append("div")
            .attr("class", "float-right");
        return new Append(newElement);
    }
}