var plotCal = function(dateCount,valuesArray,id,topLabels,titleHover) {

		/* Declare variables */

			var xLabelGArr = ["xLabelG"];

			var yLabelGArr = ["yLableG"];

			var legendGArr = ["legendG"];

			var rectGArr   = ["rectG"];

			var margin = { 
					top: 50, 
					right: 0, 
					bottom: 100, 
					left: 30 
				};

			var maxWidth = 800;
			var xAxisLeftMargin = 50;
			var xBuffer=1;
			var textBuffer = 10;
			
			var gridSize = Math.floor(maxWidth - margin.left - xAxisLeftMargin - 24 * xBuffer) /24;

			var yBuffer = 1;
			var yAxisTopMargin =  20;
			var maxHeight = ((dateCount.length + 2)* (gridSize+yBuffer) ) + margin.bottom + margin.top + yAxisTopMargin;
			var legendElementWidth = 50;
			var legendElementHeight = 13;
			var yAxisLegendMargin = 4;
			var buckets = 9;
			var colors = ["#FFF1B6","#FFE18D","#FDAE61","#F56D43","#D63E4F","#A82C3E","#8C155F","#6C1A55","#490A40"];

			var max = Number.POSITIVE_INFINITY;

			var heightChart = (dateCount.length * (gridSize+yBuffer)) + yAxisTopMargin;

		/* Get Max and min values */

			for(var i = 0;i < dateCount.length; i++){
				for(var j = 0;j < valuesArray[i].length; j++){
					if(max < valuesArray[i][j]){
						max = valuesArray[i][j];
					}
				}
			}

			var min = Number.NEGATIVE_INFINITY;

			for(var i = 0;i < dateCount.length; i++){
				for(var j = 0;j < valuesArray[i].length; j++){
					if(min > valuesArray[i][j]){
						min = valuesArray[i][j];
					}
				}
			}

		/* Other variables */

			if(max > 100){
				legendElementWidth = 60
			}

			var valMinMax = max - min;
			var xLabelVal;
			var xLabels;

		/* Append Tooltip */

			var tooltip = d3.select("body")
							.append("div")
							.attr('class', 'tooltipRectangle')
							.style("position", "absolute")
							.style("padding", "1em")
							.style({
								"visibility": "hidden", 
								"opacity":0
							});

		/* Define Colorscale */

			var colorScale = d3.scale.quantile()
								.domain([min, (max + 1)])
								.range(colors);
		
		/* Append Svg */

			var svg = d3.select(id)
						.append("svg")
						.attr("id","chartSvgDensity")
						.attr("width", maxWidth)
						.attr("height", maxHeight)
						.append("g")
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


		/* Append X Labels */

			var xLabelG = svg.selectAll(".xLabelG").data(xLabelGArr);

				xLabelG.enter().append("g").attr("class","xLabelG");

			xLabels = xLabelG.selectAll('.xLabel').data(topLabels);

			xLabelVal = topLabels;

			xLabels.enter()
				.append("text")
				.text(function (d) { return d; })
				.attr("y", 10)
				.attr("x", function (d, i) {
					return i * (gridSizeX +xBuffer) + xAxisLeftMargin + (gridSizeX + (2*xBuffer))/2

				})
				.attr("class", "dayLabel mono axis")
				.style('text-anchor', 'middle')
				.style("font-size", "12px"); 

		/* Append Y Labels */

			var yLabelG = svg.selectAll(".yLabelG").data(yLabelGArr);

				yLabelG.enter().append("g").attr("class","yLabelG");

			var yLabels =  yLabelG.selectAll(".yLabel")
							.data(dateCount)
							.enter()
							.append("text")
							.text(function(d) { return d})
							.attr("y", function(d, i) { return i * (gridSize+yBuffer) + yAxisTopMargin + (gridSize+(2*yBuffer))/2 })
							.attr("x",xAxisLeftMargin - textBuffer)
							//.attr("x", -28)
							.style("text-anchor", "end")
							.attr("class", "timeLabel mono axis")
							.style("font-size", "12px")
							.on("mouseover", function(d){

								d3.event.preventDefault();

								return tooltip.style({
											"visibility":"visible", 
											'opacity': 1
										})
										.html(d).moveToFront();
							})
							.on("mousemove", function(d){
								d3.event.preventDefault();
								return tooltip.style("top", (d3.mouse(this)[1] + maxWidth/4) - 50 + "px").style("left", (d3.mouse(this)[0]+maxWidth/2) -50 + "px").moveToFront();
							})
							.on("mouseout", function(){
								return tooltip.style({"visibility":"hidden", "opacity":0});
							})
							.on("mouseleave", function(){
								return tooltip.style({"visibility":"hidden", "opacity":0});
							});

			var valueTitle = titleHover[1];
			var valueTitle2 = titleHover[2];

		/* Append rectangles */

			var rectG = svg.selectAll(".rectG").data(rectGArr);

				rectG.enter().append("g").attr("class","rectG");

			var rowRectG = rectG.selectAll(".rowRectG").data(valuesArray);

				rowRectG.enter().append("g").attr("class","rowRectG")
						.attr("transform",function(d,i){

							var xTransform = 0;

							var yTransform = i * (gridSize+yBuffer);

							var str = "translate(" + xTransform + "," + yTransform + ")";

							return str;
						})
						.attr("yLabelValue", function(d,i){
							return dateCount[i];
						});

			var rectVal = rowRectG.selectAll(".rectVal").data(function(d){ return d});

				rectVal.enter().append("rect")
						.attr("x", function(d,i) {
							return i * (gridSizeX + xBuffer) + xAxisLeftMargin; 
						})
						.attr("y", yAxisTopMargin)
						.attr("class", "hour bordered")
						.attr("width", gridSizeX)
						.attr("height", gridSize)
						.attr("value", function(d,i){
							return d;
						})
						.attr("xLabelValue", function(d,i){
							return xLabelVal[i];
						})
						.style("stroke", "white")
						.style("stroke-width", 0.3)
						.style("fill", function(d,i) {
							if(max>0) {

								if(d === max){
									return colors[colors.length-1]
								}else if(d > 0){
									return colors[Math.floor(d * 9 /max)]
								}else if(d === 0){
									return "#f6f6f6";
								}
							} else {
								return "#f6f6f6";
							}
						})
						.on("mouseover", function(d,i){

							var yLabelValue = d3.select(this.parentNode).attr('yLabelValue');
							var xLabelValue = d3.select(this).attr('xLabelValue');

							var html = valueTitle  + " : " + yLabelValue + "<br />";
								html+= valueTitle2 + " : " + xLabelValue + "<br />";
								html+= "No. of Visitors :" + " " + d3.select(this).attr('value');

							d3.event.preventDefault();

							return tooltip.style({"visibility":"visible", 'opacity': 1})
										  .html( html )
										  .moveToFront();

						})
						.on("mousemove", function(d){
							d3.event.preventDefault();

							return tooltip.style("top", (d3.mouse(this)[1] + maxWidth/4) - 100 + "px")
										  .style("left", (d3.mouse(this)[0]+maxWidth/2) -50 + "px")
										  .moveToFront();

						})
						.on("mouseout", function(){
							return tooltip.style({"visibility":"hidden", "opacity":0});
						})
						.on("mouseleave", function(){
							return tooltip.style({"visibility":"hidden", "opacity":0});
						})

				rectVal.exit().remove();

				rowRectG.exit().remove();

				rectG.exit().remove();

		/* Append Legends */

			var exists = [1];

			var legendG = svg.selectAll(".legendG").data(legendGArr);

				legendG.enter().append("g").attr("class","legendG");

			var legend = legendG.selectAll(".legend")
							.data([0].concat(colorScale.quantiles()), function(d) { 
								if(valMinMax >= 9){
									return d;
								}else if(max <= 1){
									if(d >= 1){
										return d;
									}
								}else if(valMinMax < 9){
									var val = Math.round(d);
									exists.sort();
									if(exists.indexOf(val) === -1){
										exists.push(val);
										return val;
									}
								}
							})
							.enter().append("g")
							.attr("class", "legend");

			legendG.append("rect")
					.attr("class", "zeroLegend")
					.attr("x", xAxisLeftMargin)
					.attr("y", ( dateCount.length + 1 )*(gridSize+yBuffer) + yAxisTopMargin)
					.attr("width", legendElementWidth)
					.attr("height", legendElementHeight)
					.style("fill", "#f6f6f6");

			legendG.append("text")
					.attr("class", "mono")
					.text(" = 0 ")
					.attr("x", (xAxisLeftMargin + (legendElementWidth / 3 )))
					.attr("y", ( dateCount.length + 1 )*(gridSize+yBuffer) + yAxisTopMargin + legendElementHeight * 2 + yAxisLegendMargin)
					.style({"text-anchor":"end"});

			legend.append("rect")
						.attr("class","colorLegend")
						.attr("x", function(d, i) { 
							if(max <= 1){

								return legendElementWidth + xAxisLeftMargin;

							}else if(valMinMax < 9){
								var val = Math.round(d);
								var pos = exists.indexOf(val);
								return legendElementWidth * pos + ( 2 * xAxisLeftMargin); 
							}else{
								return legendElementWidth * i + ( 2 * xAxisLeftMargin); 
							}

						})
						.attr("y", ( dateCount.length + 1 )*(gridSize+yBuffer) + yAxisTopMargin)
						.attr("width", legendElementWidth)
						.attr("height", legendElementHeight)
						.style("fill", function(d, i) { return colors[i]; });

			legend.append("text")
						.attr("class", "mono")
						.text(function(d) { 
							if(Math.round(d) > 0){
								return "≥ " + Math.round(d); 
							}else {
								return "> " + Math.round(d); 
							}
						})
						.attr("x", function(d, i) { 
							if(max <= 1){
								return legendElementWidth + xAxisLeftMargin;
							}else if(valMinMax < 9){
								var val = Math.round(d);
								var pos = exists.indexOf(val);
								return legendElementWidth * pos + ( 2 * xAxisLeftMargin) + (legendElementWidth / 3 ); 
							}else{
								return legendElementWidth * i + ( 2 * xAxisLeftMargin) + (legendElementWidth / 3 ); 
							}
						})
						.attr("y", ( dateCount.length + 1 )*(gridSize+yBuffer) + yAxisTopMargin + legendElementHeight * 2 + yAxisLegendMargin);

};


var init = function(){

	var yVals = ["A","B","C"];

	var valuesArray = [];

	var xVals = [];

	for(var i = 0; i < 24; i++){
		xVals.push(i);
	}

	for(var i in yVals){

		var arr = [];

		for(var j in xVals){
			arr.push(j);
		}

		valuesArray.push(arr);
	}

	var titleHover = ["YLable","Hour Of Day"];

	plotCal(yVals,valuesArray,id,xVals,titleHover);
}