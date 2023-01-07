class Global {
    static selectedParty = null;

    static reselectParty(redraw=true) {
        if (Global.selectedParty) {
            const partyName = Global.selectedParty;
            Global.deselectParty(!redraw);
            Global.selectParty(partyName, redraw);
        }
    }

    static focusParty(partyName) {
        Statistics.BarChart.focus(Statistics.BarChart.findBarWith(partyName));
        Statistics.PieChart.focus(Statistics.PieChart.findSliceWith(partyName));
    }
    
    static selectParty(partyName, draw=true) {
        Statistics.BarChart.select(Statistics.BarChart.findBarWith(partyName));
        Statistics.PieChart.select(Statistics.PieChart.findSliceWith(partyName));
        
        if (draw) {
            // Plot gradient color according to votes for the party in different locations
            if (Municipality.isSelected() || Region.isSelected()) {
                Municipality.plotGradientColorForParty(partyName);
            } else {
                Region.plotGradientColorForParty(partyName);
            }
        }
        
        Global.selectedParty = partyName;
    }

    static deselectParty(clearDraw) {
        Statistics.BarChart.deselect();
        Statistics.PieChart.deselect();
        
        if (!clearDraw) {
            Region.clearColors();
            Municipality.clearColors();
        }

        Global.selectedParty = null;
    }
}