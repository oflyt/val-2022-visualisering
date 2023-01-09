class Statistics {

    static PieChart = class {
        static setup() {
            const svgSize = {
                width: document.getElementById("pie-chart-container").clientWidth,
                height: document.getElementById("pie-chart-container").clientHeight
            };
            return StatsPlot.PieChart.setup(svgSize, "svg#pie-chart");
        }

        static plot(data) {
            // Prep variables
            const 
                margin = {top: 30, right: 30, bottom: 30, left: 30},
                svg = d3.select("svg#pie-chart"),
                width = +svg.attr("width") - margin.right - margin.left,
                height = +svg.attr("height") - margin.top - margin.bottom,
                radius = Math.min(width, height) / 2;
            const name = i => data[i].name;
            
            return StatsPlot.PieChart.plot(svg, data, radius)
                .attr("class", "pie-slice")
                .on("mouseover", (e, d) => {
                    if (Global.selectedParty) return;
                    if (d3.select(e.target).attr("disabled")) return;
                    const focused = EventHandlerFunctions.focus(e.target, "pie-slice");
                    if (focused) {
                        Global.focusParty(d.data.name);
                    }
                })
                .on("mouseout", e => {
                    if (Global.selectedParty) return;
                    if (d3.select(e.target).attr("disabled")) return;
                    const gotOutOfFocus = EventHandlerFunctions.outOfFocus(e.target, "pie-slice");
                    if (gotOutOfFocus) {
                        Global.deselectParty();
                    }
                })
                .on("click", (e, d) => {
                    if (d3.select(e.target).attr("disabled")) return;
                    const gotSelected = EventHandlerFunctions.select(e, e.target, "pie-slice");
                    if (gotSelected) {
                        Global.selectParty(d.data.name);
                    }
                })
                .attr("disabled", (d,i,g) => {
                    return (d.data.name == "Others" ? "true" : null)
                });
        }

        static findSliceWith(partyName) {
            return d3.selectAll(".pie-slice").filter(d => partyName == d.data.name);
        }

        static focus(toFocus) {
            EventHandlerFunctions.setFocus(toFocus, "pie-slice");
        }

        static select(toSelect) {
            EventHandlerFunctions.setSelection(toSelect, "pie-slice");
        }

        static deselect() {
            d3.selectAll(".pie-slice").attr("class", "pie-slice");
        }
    }

    static BarChart = class {
        
        static setup() {
            const margin = {top: 40, right: 40, bottom: 40, left: 40};
            const svgSize = {
                width: document.getElementById("bar-chart-container").clientWidth,
                height: document.getElementById("bar-chart-container").clientHeight
            };
            return StatsPlot.BarChart.setup(svgSize, "svg#bar-chart", margin);
        }

        static plot(data) {
            // Set graph margins and dimensions
            const 
                margin = {top: 40, right: 40, bottom: 40, left: 40},
                svg = d3.select("svg#bar-chart"),
                width = +svg.attr("width") - margin.left - margin.right,
                height = +svg.attr("height") - margin.top - margin.bottom;
    
            // Append rectangles for bar chart
            return StatsPlot.BarChart.plot(svg, data, width, height)
                .on("mouseover", (e, d) => {
                    if (Global.selectedParty) return;
                    if (d3.select(e.target).attr("disabled")) return;
                    const focused = EventHandlerFunctions.focus(e.target, "bar");
                    if (focused) {
                        Global.focusParty(d.name);
                    }
                })
                .on("mouseout", e => {
                    if (Global.selectedParty) return;
                    if (d3.select(e.target).attr("disabled")) return;
                    const gotOutOfFocus = EventHandlerFunctions.outOfFocus(e.target, "bar");
                    if (gotOutOfFocus) {
                        Global.deselectParty();
                    }
                })
                .on("click", (e, d) => {
                    if (d3.select(e.target).attr("disabled")) return;
                    const gotSelected = EventHandlerFunctions.select(e, e.target, "bar");
                    if (gotSelected) {
                        Global.selectParty(d.name);
                    }
                })
                .attr("disabled", d => (d.name == "Others" ? "true" : null));
        }

        static findBarWith(partyName) {
            return d3.selectAll(".bar").filter(d => partyName == d.name);
        }
        
        static focus(toFocus) {
            EventHandlerFunctions.setFocus(toFocus, "bar");
        }

        static select(toSelect) {
            EventHandlerFunctions.setSelection(toSelect, "bar");
        }

        static deselect() {
            d3.selectAll(".bar").attr("class", "bar");
        }
    }

    static setup() {
        const barSvg = Statistics.BarChart.setup();
        const pieSvg = Statistics.PieChart.setup();

        barSvg.on("click", d => Global.deselectParty())
        pieSvg.on("click", d => Global.deselectParty())
    }

    static plot(parties) {
        Statistics.clear();
        const data = Data.Party.aggreatePartiesBelowOnePercent(parties)
            .sort((v1, v2) => d3.descending(v1.value, v2.value));
        Statistics.BarChart.plot(data);
        Statistics.PieChart.plot(data);
    }

    static clear() {
        d3.selectAll("svg#pie-chart > g > *").remove();
        d3.selectAll("svg#bar-chart > g > *").remove();
    }
}