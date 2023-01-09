class PartyList {
    
    static setTitle(title) {
        d3.select("#area-name").text(title);
    }

    static create(listOfParties) {
        const listContentDiv = d3.select("#list-content");
        return List.create(listContentDiv, listOfParties, List.ItemType.partyInfo)
            .attr("class", "list-group-item")
            .sort((x, y) => { 
                const resultSort = d3.descending(
                    Optional.of(x.value).map(parseFloat).else(-1), 
                    Optional.of(y.value).map(parseFloat).else(-1)
                );
                if (resultSort == 0) {
                    return d3.ascending(x.name, y.name);
                }
                return resultSort;
            })
            .on("mouseover", function(e, d) {
                return [EventHandling.Default.focus(e, this, "list-group-item"), d.name];
            })
            .on("mouseout", function(e, d) {
                return [EventHandling.Default.outOfFocus(e, this, "list-group-item"), d.name];
            })
            .on("click", function(e, d) {
                return [EventHandling.Default.activate(e, this, "list-group-item"), d.name];
            })
            .attr("disabled", (d,i,g) => {
                if (d.value && d.value >= 0.0045) {
                    return null;
                } else {
                    return "true";
                }
            });
    }
    
    static findItemWith(partyName) {
        return d3.selectAll(".list-group-item").filter(d => d.name == partyName);
    }

    static focus(toFocus) {
        EventHandling.Helpers.setFocus(toFocus, "list-group-item");
    }

    static activate(toActivate) {
        EventHandling.Helpers.setActivation(toActivate, "list-group-item");
    }

    static deselect() {
        d3.selectAll(".list-group-item").attr("class", "list-group-item");
    }

    

}