class StatsPlot {
    static PieChart = class {
        static setup(svgSize, svgSelector) {
            const svg = d3.select(svgSelector)
                .attr("width", svgSize.width)
                .attr("height", svgSize.height)
                .attr("transform", "translate(" + 0 + "," + 0 + ")");
            svg.append("g")
                .attr("transform", "translate(" + svgSize.width / 2 + "," + svgSize.height / 2 + ")");
            return svg;
        }

        static plot(parent, data, radius) {
            // Create the pie chart layout
            const pie = d3.pie();

            // Use the arc generator to create the path data for the pie chart slices
            const arc = d3.arc()
                .outerRadius(radius)
                .innerRadius(0);

            // Arc for each data point
            const arcs = parent.select("g")
                .selectAll("arc")
                .data(pie(data.map(v => v.value)))
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

            return slices;
        }
    }

    static BarChart = class {
        static setup(svgSize, svgSelector, margin) {
            const svg = d3.select(svgSelector)
                .attr("width", svgSize.width)
                .attr("height", svgSize.height)
                .attr("transform", "translate(" + 0 + "," + 0 + ")");
            svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            return svg;
        }

        static plot(parent, data, width, height) {
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