class List {
    static setTitle(title) {
        d3.select("#area-name").text(title);
    }

    static create(listOfParties) {
        List.clear();
        d3.select("#list-content")
            .selectAll("div")
            .data(listOfParties)
            .enter()
            .append("div")
            .attr("class", "list-group-item")
            .sort((x, y) => d3.ascending(x.name, y.name))
            .sort((x, y) => d3.descending(
                Optional.of(x.value).map(parseFloat).else(-1), 
                Optional.of(y.value).map(parseFloat).else(-1)
            ))
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