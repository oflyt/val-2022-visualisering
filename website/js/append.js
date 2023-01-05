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

    text(text) {
        const newElement = this.selected.text(text);
        return new Append(newElement);
    }
}