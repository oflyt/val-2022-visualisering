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
            .sort((x, y) => d3.ascending(x.PARTIBETECKNING, y.PARTIBETECKNING))
            .sort((x, y) => d3.descending(
                Optional.of(x.result_2018).map(parseFloat).else(-1), 
                Optional.of(y.result_2018).map(parseFloat).else(-1)
            ))
            .each(function(d) {
                // if (d.color) {
                //     Append.selectedBy(this).colorLabel(d.color);
                // }
                if (d.url != "") {
                    Append.selectedBy(this).link(d.url, d.PARTIBETECKNING);
                } else {
                    Append.selectedBy(this).text(d.PARTIBETECKNING);
                }

                d3.select(this)
                    .append("div")
                    .attr("class", "float-right")
                    .text(Optional.of(d.result_2018).map(v => parseFloat(v).toFixed(3) + "%").else("-"));
            });
    }

    static clear() {
        d3.selectAll("#list-content > *").remove();
    }

}