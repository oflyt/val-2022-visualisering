class Results {
    constructor(barChart, pieChart) {
        this.resultBarChart = barChart;
        this.resultPieChart = pieChart;
    }

    static setup() {
        return new Results(
            Results.BarChart.setup(), 
            Results.PieChart.setup()
        );
    }

    plot(parties) {
        this.clear();
        const data = Data.Party.aggreatePartiesBelowOnePercent(parties)
            .sort((v1, v2) => d3.descending(v1.value, v2.value));
        return [
            this.resultBarChart.plot(data), 
            this.resultPieChart.plot(data)
        ]
    }

    findWith(partyName) {
        return [
            this.resultBarChart.findBarWith(partyName), 
            this.resultPieChart.findSliceWith(partyName)
        ];
    }

    deselect() {
        this.resultBarChart.deselect();
        this.resultPieChart.deselect();
    }

    clear() {
        this.resultBarChart.clear();
        this.resultPieChart.clear();
    }

    static focus([barToFocus, sliceToFocus]) {
        Results.BarChart.focus(barToFocus);
        Results.PieChart.focus(sliceToFocus);
    }

    static select([barToSelect, sliceToSelect]) {
        Results.BarChart.select(barToSelect);
        Results.PieChart.select(sliceToSelect);
    }

    static PieChart = class {
        constructor(pieChart) {
            this.pieChart = pieChart;
            this.slices = null;
            this.texts = null;
        }

        static setup() {
            const svgSize = {
                width: document.getElementById("pie-chart-container").clientWidth,
                height: document.getElementById("pie-chart-container").clientHeight
            };
            const margin = {top: 30, right: 30, bottom: 30, left: 30};
            return new Results.PieChart(StatsPlot.PieChart.setup(svgSize, "svg#pie-chart", margin));
        }

        plot(data) {
            [this.slices, this.texts] = this.pieChart.plot(data);
            this.slices
                .attr("class", "pie-slice")
                .on("mouseover", function(e, d) { return [EventHandling.Default.focus(e, this, "pie-slice"), d.data.name]; })
                .on("mouseout", function(e, d) { return [EventHandling.Default.outOfFocus(e, this, "pie-slice"), d.data.name]; })
                .on("click", function(e, d) { return [EventHandling.Default.activate(e, this, "pie-slice"), d.data.name]; })
                .attr("disabled", d => (d.data.name == "Others" ? "true" : null));
            return this.slices;
        }

        findSliceWith(partyName) {
            return this.slices.filter(d => partyName == d.data.name);
        }

        deselect() {
            if (this.slices) {
                this.slices.attr("class", "pie-slice");
            }
        }

        clear() {
            if (this.slices) {
                this.slices.remove();
                this.texts.remove();
            }
        }

        static focus(toFocus) {
            EventHandling.Helpers.setFocus(toFocus, "pie-slice");
        }

        static select(toSelect) {
            EventHandling.Helpers.setActivation(toSelect, "pie-slice");
        }
    }

    static BarChart = class {
        constructor(barChart) {
            this.barChart = barChart;
            this.bars = null;
            this.xAxis = null;
            this.yAxis = null;
        }
        
        static setup() {
            const margin = {top: 40, right: 40, bottom: 40, left: 40};
            const svgSize = {
                width: document.getElementById("bar-chart-container").clientWidth,
                height: document.getElementById("bar-chart-container").clientHeight
            };
            return new Results.BarChart(StatsPlot.BarChart.setup(svgSize, "svg#bar-chart", margin));
        }

        plot(data) {
            [this.bars, this.xAxis, this.yAxis] = this.barChart.plot(data);
            this.bars
                .on("mouseover", function(e, d) { return [EventHandling.Default.focus(e, this, "bar"), d.name]; })
                .on("mouseout", function(e, d) { return [EventHandling.Default.outOfFocus(e, this, "bar"), d.name]; })
                .on("click", function(e, d) { return [EventHandling.Default.activate(e, this, "bar"), d.name]; })
                .attr("disabled", d => (d.name == "Others" ? "true" : null));
            return this.bars;
        }

        findBarWith(partyName) {
            return this.bars.filter(d => partyName == d.name);
        }
        
        deselect() {
            if (this.bars) {
                this.bars.attr("class", "bar");
            }
        }

        clear() {
            if (this.bars) {
                this.bars.remove();
                this.xAxis.remove();
                this.yAxis.remove();
            }
        }
        
        static focus(toFocus) {
            EventHandling.Helpers.setFocus(toFocus, "bar");
        }

        static select(toSelect) {
            EventHandling.Helpers.setActivation(toSelect, "bar");
        }
    }

}