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
                if (this != e.target || d3.select(e.target).attr("disabled")) {
                    e.stopPropagation();
                    return;
                } 
                EventHandlerFunctions.focus(e.target, "list-group-item");
            })
            .on("mouseout", function(e, d) {
                if (this != e.target) return;
                if (d3.select(e.target).attr("disabled")) return;
                EventHandlerFunctions.outOfFocus(e.target, "list-group-item");
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
                if (d.value && d.value > 0.5) {
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

    static partyNameFor(item) {
        return item.data()[0].name;
    }

    static focus(itemToFocus) {
        d3.selectAll(".list-group-item").attr("class", "list-group-item");
        itemToFocus.attr("class", "list-group-item hovered")
    }

    static activate(itemToSelect) {
        d3.selectAll(".list-group-item").attr("class", "list-group-item");
        itemToSelect.attr("class", "list-group-item active")
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