class GlobalPartySelection {
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
        Results.focus(this.resultPlot.findWith(partyName));
        PartyList.focus(PartyList.findItemWith(partyName));
    }
    
    selectParty(partyName, draw=true) {
        Results.select(this.resultPlot.findWith(partyName));
        PartyList.activate(PartyList.findItemWith(partyName));
        if (draw) { this.countryMap.plotGradientColorForParty(partyName); }
        this.selectedParty = partyName;
    }

    deselectParty(clearDraw) {
        this.resultPlot.deselect();
        PartyList.deselect();
        if (!clearDraw) { this.countryMap.clearColors(); }
        this.selectedParty = null;
    }

    _bindMouseEventsToGlobal(d3Elements) {
        const globalPartySelection = this;
        const originalMouseOver = d3Elements.on("mouseover");
        const originalMouseOut = d3Elements.on("mouseout");
        const originalClick = d3Elements.on("click");
        d3Elements
            .on("mouseover", function(e, d) {
                if (globalPartySelection.selectedParty) return; 
                const [result, partyName] = originalMouseOver.call(this, e, d);
                if (result) {
                    globalPartySelection.focusParty(partyName);
                }
            })
            .on("mouseout", function(e, d) {
                if (globalPartySelection.selectedParty) return;
                const [result, partyName] = originalMouseOut.call(this, e, d);
                if (result) {
                    globalPartySelection.deselectParty();
                }
            })
            .on("click", function(e, d) {
                const [result, partyName] = originalClick.call(this, e, d);
                if (result == EventHandling.ACTIVATED) {
                    globalPartySelection.selectParty(partyName);
                } else if (result == EventHandling.DEACTIVATED) {
                    globalPartySelection.deselectParty();
                }
            });
    }
}