class StatsPlot {
    static PieChart = class {
        constructor(svg, radius) {
            this.svg = svg;
            this.radius = radius;
        }

        static setup(svgSize, svgSelector, margin) {
            const svg = d3.select(svgSelector)
                .attr("width", svgSize.width)
                .attr("height", svgSize.height)
                .attr("transform", "translate(" + 0 + "," + 0 + ")");
            svg.append("g")
                .attr("transform", "translate(" + (svgSize.width) / 2 + "," + (svgSize.height) / 2 + ")");
            const radius = Math.min(
                svgSize.width - margin.right - margin.left, 
                svgSize.height - margin.top - margin.bottom
            ) / 2;
            return new StatsPlot.PieChart(svg, radius);
        }

        plot(data) {
            const 
                parent = this.svg,
                radius = this.radius;

            // Create the pie chart layout
            const pie = d3.pie().value(d => d.value);

            // Use the arc generator to create the path data for the pie chart slices
            const arc = d3.arc()
                .outerRadius(radius)
                .innerRadius(0);

            const label = d3.arc()
                .outerRadius(radius+20)
                .innerRadius(radius);

            // Arc for each data point
            const arcs = parent.select("g")
                .selectAll("arc")
                .data(pie(data))
                .enter()
                .append("g")
                .attr("class", "arc");

            const color = d3.scaleOrdinal(data.map(v => v.color)); 

            // Plot arc and add title
            const slices = arcs
                .append("path")
                .attr("d", arc)
                .attr("fill", (d, i) => color(i));
                
            slices
                .append("title")
                .text((d, i) => data[i].name);

            arcs.append("text")
                .attr("transform", d => "translate(" + label.centroid(d) + ")")
                .style("text-anchor", "middle")
                .attr("dy", ".35em")
                .text(d => d.data.shortName);

            return slices;
        }
    }

    static BarChart = class {
        constructor(svg, size) {
            this.svg = svg;
            this.size = size;
        }

        static setup(svgSize, svgSelector, margin) {
            const svg = d3.select(svgSelector)
                .attr("width", svgSize.width)
                .attr("height", svgSize.height)
                .attr("transform", "translate(" + 0 + "," + 0 + ")");
            svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            const size = {
                width: svgSize.width - margin.left - margin.right,
                height: svgSize.height - margin.top - margin.bottom
            };
            return new StatsPlot.BarChart(svg, size);
        }

        plot(data) {
            const 
                parent = this.svg,
                width = this.size.width,
                height = this.size.height;

            // Set ranges
            var x = d3.scaleBand().range([0, width]).padding(0.2);
            var y = d3.scaleLinear().range([height, 0]);
    
            // Scale the range of the data in the domains
            x.domain(data.map(d => d.shortName));
            y.domain([0, d3.max(data, d => d.value)]);

            const color = d3.scaleOrdinal(data.map(v => v.color));

            const bars = parent.select("g")
                .selectAll(".bar")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", d => x(d.shortName))
                .attr("width", x.bandwidth())
                .attr("y", d => y(d.value))
                .attr("height", d => height - y(d.value))
                .attr("fill", (d, i) => color(i))

            
            bars
                .append("title")
                .text((d, i) => data[i].name);

            // Add x axis
            parent.select("g").append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                    // Rotate x-labels
                    // .selectAll("text")  
                    // .style("text-anchor", "end")
                    // .attr("dx", "-.8em")
                    // .attr("dy", ".15em")
                    // .attr("transform", "rotate(-65)");;
    
            // Add y axis
            parent.select("g").append("g")
                .call(d3.axisLeft(y));

            return bars;
        }
    }
}