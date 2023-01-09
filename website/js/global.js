class Global {
    constructor(countryMap, resultPlot) {
        this.countryMap = countryMap;
        this.resultPlot = resultPlot;
        this.selectedParty = null;
    }

    reselectParty(redraw=true) {
        if (this.selectedParty) {
            const partyName = this.selectedParty;
            this.deselectParty(!redraw);
            this.selectParty(partyName, redraw);
        }
    }

    focusParty(partyName) {
        Results.ResultBarChart.focus(Results.ResultBarChart.findBarWith(partyName));
        Results.ResultPieChart.focus(Results.ResultPieChart.findSliceWith(partyName));
        PartyList.focus(PartyList.findItemWith(partyName));
    }
    
    selectParty(partyName, draw=true) {
        Results.ResultBarChart.select(Results.ResultBarChart.findBarWith(partyName));
        Results.ResultPieChart.select(Results.ResultPieChart.findSliceWith(partyName));
        PartyList.activate(PartyList.findItemWith(partyName));
        
        if (draw) {
            this.countryMap.plotGradientColorForParty(partyName);
        }
        
        this.selectedParty = partyName;
    }

    deselectParty(clearDraw) {
        Results.ResultBarChart.deselect();
        Results.ResultPieChart.deselect();
        PartyList.deselect();
        
        if (!clearDraw) {
            this.countryMap.clearColors();
        }

        this.selectedParty = null;
    }

    _bindMouseEventsToGlobal(d3Elements) {
        const global = this;
        const originalMouseOver = d3Elements.on("mouseover");
        const originalMouseOut = d3Elements.on("mouseout");
        const originalClick = d3Elements.on("click");
        d3Elements
            .on("mouseover", function(e, d) {
                if (global.selectedParty) return; 
                const [result, partyName] = originalMouseOver.call(this, e, d);
                if (result) {
                    global.focusParty(partyName);
                }
            })
            .on("mouseout", function(e, d) {
                if (global.selectedParty) return;
                const [result, partyName] = originalMouseOut.call(this, e, d);
                if (result) {
                    global.deselectParty();
                }
            })
            .on("click", function(e, d) {
                const [result, partyName] = originalClick.call(this, e, d);
                if (result == EventHandling.ACTIVATED) {
                    global.selectParty(partyName);
                } else if (result == EventHandling.DEACTIVATED) {
                    global.deselectParty();
                }
            });
    }
}