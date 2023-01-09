class List {

    static create(parent, data, itemType) {
        parent.selectChildren().remove();
        const listItems = parent
            .selectAll("a")
            .data(data)
            .enter()
            .append("a")
            .attr("href", "#");
        itemType(listItems);
        return listItems;
    }

    static ItemType = class {
        static partyInfo(listItems) {
            // Color label
            listItems
                .filter(d => d.color)
                .append("span")
                .style("background-color", d => d.color)
                .style("color", d => d.color)
                .text("_");
            listItems // Space between color label and name
                .filter(d => d.color)
                .append("span")
                .text(" ");
    
            // Name
            listItems
                .filter(d => !d.url)
                .text(d => d.name);
            listItems
                .filter(d => d.url)
                .append("a")
                .attr("href", d => d.url)
                .attr("target", "_blank")
                .text(d => d.name);
    
            // Result
            listItems
                .append("div")
                .attr("class", "float-right")
                .text(d => Optional.of(d.value).map(v => parseFloat(v).toFixed(3) + "%").else("-"));
        }
    }    

}