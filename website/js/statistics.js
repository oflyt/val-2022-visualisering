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
                svg = d3.select("svg#pie-chart"),
                width = +svg.attr("width"),
                height = +svg.attr("height"),
                radius = Math.min(width, height) / 2;
            const name = i => data[i].name;
            
            return StatsPlot.PieChart.plot(svg, data, radius)
                .attr("class", "pie-slice")
                .on("mouseover", function(d) {
                    const focused = EventHandlerFunctions.focus(this, "pie-slice");
                    if (focused) {
                        const partyName = Statistics.PieChart.partyNameFor(focused);
                        Global.focusParty(partyName);
                    }
                })
                .on("mouseout", function(d) {
                    const gotOutOfFocus = EventHandlerFunctions.outOfFocus(this, "pie-slice");
                    if (gotOutOfFocus) {
                        Global.deselectParty();
                    }
                })
                .on("click", function(d) {
                    const gotSelected = EventHandlerFunctions.select(d, this, "pie-slice");
                    if (gotSelected) {
                        const partyName = Statistics.PieChart.partyNameFor(d3.select(".pie-slice.selected"));
                        Global.selectParty(partyName);
                    }
                });
        }

        static findSliceWith(partyName) {
            return d3.selectAll(".pie-slice").filter(function(d) {
                return partyName == Statistics.PieChart.partyNameFor(d3.select(this))
            });
        }

        static partyNameFor(pieSlice) {
            return pieSlice.select("title").text();
        }

        static focus(pieSliceToFocus) {
            d3.selectAll(".pie-slice").attr("class", "pie-slice out-of-focus");
            pieSliceToFocus.attr("class", "pie-slice hovered")
        }

        static select(pieSliceToSelect) {
            d3.selectAll(".pie-slice").attr("class", "pie-slice out-of-focus not-selected");
            pieSliceToSelect.attr("class", "pie-slice selected")
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
                .on("mouseover", function(d) {
                    const focused = EventHandlerFunctions.focus(this, "bar");
                    if (focused) {
                        const partyName = Statistics.BarChart.partyNameFor(focused);
                        Global.focusParty(partyName);
                    }
                })
                .on("mouseout", function(d) {
                    const gotOutOfFocus = EventHandlerFunctions.outOfFocus(this, "bar");
                    if (gotOutOfFocus) {
                        Global.deselectParty();
                    }
                })
                .on("click", function(d) {
                    const gotSelected = EventHandlerFunctions.select(d, this, "bar");
                    if (gotSelected) {
                        const partyName = Statistics.BarChart.partyNameFor(d3.select(".bar.selected"));
                        Global.selectParty(partyName);
                    }
                });
        }

        static findBarWith(partyName) {
            return d3.selectAll(".bar").filter(function(d) {
                return partyName == Statistics.BarChart.partyNameFor(d3.select(this))
            });
        }

        static partyNameFor(bar) {
            return bar.data()[0].name;
        }
        
        static focus(barToFocus) {
            d3.selectAll(".bar").attr("class", "bar out-of-focus");
            barToFocus.attr("class", "bar hovered")
        }

        static select(barToSelect) {
            d3.selectAll(".bar").attr("class", "bar out-of-focus not-selected");
            barToSelect.attr("class", "bar selected")
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