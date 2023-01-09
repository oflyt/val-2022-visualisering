class Results {
    constructor(barChart, pieChart) {
        this.resultBarChart = barChart;
        this.resultPieChart = pieChart;
    }

    static setup() {
        return new Results(
            Results.ResultBarChart.setup(), 
            Results.ResultPieChart.setup()
        );
    }

    plot(parties) {
        Results.clear();
        const data = Data.Party.aggreatePartiesBelowOnePercent(parties)
            .sort((v1, v2) => d3.descending(v1.value, v2.value));
        return [
            this.resultBarChart.plot(data), 
            this.resultPieChart.plot(data)
        ]
    }

    static clear() {
        d3.selectAll("svg#pie-chart > g > *").remove();
        d3.selectAll("svg#bar-chart > g > *").remove();
    }

    static ResultPieChart = class {
        constructor(pieChart) {
            this.pieChart = pieChart;
        }

        static setup() {
            const svgSize = {
                width: document.getElementById("pie-chart-container").clientWidth,
                height: document.getElementById("pie-chart-container").clientHeight
            };
            const margin = {top: 30, right: 30, bottom: 30, left: 30};
            return new Results.ResultPieChart(StatsPlot.PieChart.setup(svgSize, "svg#pie-chart", margin));
        }

        plot(data) {
            return this.pieChart.plot(data)
                .attr("class", "pie-slice")
                .on("mouseover", function(e, d) {
                    return [EventHandling.Default.focus(e, this, "pie-slice"), d.data.name];
                })
                .on("mouseout", function(e, d) {
                    return [EventHandling.Default.outOfFocus(e, this, "pie-slice"), d.data.name]
                })
                .on("click", function(e, d) {
                    return [EventHandling.Default.activate(e, this, "pie-slice"), d.data.name]
                })
                .attr("disabled", (d,i,g) => {
                    return (d.data.name == "Others" ? "true" : null)
                });
        }

        static findSliceWith(partyName) {
            return d3.selectAll(".pie-slice").filter(d => partyName == d.data.name);
        }

        static focus(toFocus) {
            EventHandling.Helpers.setFocus(toFocus, "pie-slice");
        }

        static select(toSelect) {
            EventHandling.Helpers.setActivation(toSelect, "pie-slice");
        }

        static deselect() {
            d3.selectAll(".pie-slice").attr("class", "pie-slice");
        }
    }

    static ResultBarChart = class {
        constructor(barChart) {
            this.barChart = barChart;
        }
        
        static setup() {
            const margin = {top: 40, right: 40, bottom: 40, left: 40};
            const svgSize = {
                width: document.getElementById("bar-chart-container").clientWidth,
                height: document.getElementById("bar-chart-container").clientHeight
            };
            return new Results.ResultBarChart(StatsPlot.BarChart.setup(svgSize, "svg#bar-chart", margin));
        }

        plot(data) {
            return this.barChart.plot(data)
                .on("mouseover", function(e, d) {
                    return [EventHandling.Default.focus(e, this, "bar"), d.name];
                })
                .on("mouseout", function(e, d) {
                    return [EventHandling.Default.outOfFocus(e, this, "bar"), d.name];
                })
                .on("click", function(e, d) {
                    return [EventHandling.Default.activate(e, this, "bar"), d.name];
                })
                .attr("disabled", d => (d.name == "Others" ? "true" : null));
        }

        static findBarWith(partyName) {
            return d3.selectAll(".bar").filter(d => partyName == d.name);
        }
        
        static focus(toFocus) {
            EventHandling.Helpers.setFocus(toFocus, "bar");
        }

        static select(toSelect) {
            EventHandling.Helpers.setActivation(toSelect, "bar");
        }

        static deselect() {
            d3.selectAll(".bar").attr("class", "bar");
        }
    }

}