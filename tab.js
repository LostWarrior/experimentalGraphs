var barPlotComponent = (function(){

  var init = function(data,metric,id){

    var attr = _getAttr(metric);

    _appendSort(data, attr,id,'#aggregatedBars');

    var data = _sortDataInitial(data, attr);

    _plotHorizontalBar(data,metric,id);


  }

  var _getAttr = function(metric){

    var attr = "Param";

    return attr;
  }

  var _plotHorizontalBar = function(data,metric,id){

      _cleanBars();

      /* Variables */

      var columns      = _extractKeysObject(data);

      var metricLength = Object.keys(data[0]).length;

      var tableWidth   = _getTableWidth(data);

      var widthId      = $(id).width();

      var colLen       = metricLength + 1;

      var colWidth     = parseInt(tableWidth) / colLen;

      var spanWidth    = 55;

      var rangeOfBar   = colWidth - spanWidth;

      var colors       = ['#fff','#1fb1bc',"#df5786","#ff8f63"];

      var allStoreData = ['1'];

      var paddingTable = (widthId - tableWidth) /2 ;

      var xMax         = graphHelperFunctions.maxNestedArrayObj(data);

      var x            = d3.scale.linear()
                           .domain([0, xMax])
                           .range([0, rangeOfBar]);



      $(id).append('<table class="dThreeBars" ><thead><tr class="head-tr"></tr></thead><tbody></tbody></table>')

      /* Basic structure of table */

      var theTable    = d3.select(id).select('table');
      var tHead       = theTable.select("thead");
      var tBody       = theTable.select("tbody");
      var tHeadRow    = tHead.select("tr");

      theTable.attr("width",tableWidth);

      /* Appending th and td elements to table */


      var heads       = tHeadRow.selectAll(".allStoreHead").data(columns);

                        /* If changing column values; write a function to select sort values from an array */

                          heads.enter()
                               .append("th")
                               .attr("class", "allStoreHead")
                               .attr({"text-align":"left","width":colWidth})
                               .attr("sortOn", function(d){ return d;}); 
                            
                          heads.text(function(d,i) {

                            var str = graphHelperFunctions.getHeadersBarPlot(d);

                            return str;

                          });

                          heads.exit().remove();

      var firstHead   = tHeadRow.select(".allStoreHead")
                                //.attr("width", "50px")
                                .attr('class','allMetricHead');


      var rows        = tBody.selectAll(".body-tr").data(data);

                        rows.enter().append("tr")
                            .attr("class","body-tr");

                        rows.exit().remove();
              

      var cells       = rows.selectAll("td")
                            .data(function(row) {
                                return columns.map(function(column) {
                                    return {column: column, value: row[column]};
                                });
                            })

                        cells.enter()
                            .append("td")
                            .append("span")
                            .attr('title',function(d){

                                var val = String(getVal(d));

                                var txtStoreVal = graphHelperFunctions.addSpacesToString(val);

                                return txtStoreVal;
                            })
                            .text(function(d){

                                var txtStoreVal = getVal(d);

                                var finalDisplayVal = graphHelperFunctions.clipDisplayVal(txtStoreVal);

                                return finalDisplayVal;
                             })
                            .style({"font-size":"13px", "display":"inline-block","min-width":spanWidth +"px" ,"margin-left":"1px" })
                            .style({"text-align":"left","letter-spacing":"0.1px","padding": "10px 0px 10px 0px"})
                            .attr('data-toggle', function(d){

                                if(d.column === 'store'){

                                  var sel = d.value;

                                  var str = '';

                                  var selection = String(main.getName(sel));

                                  str = graphHelperFunctions.addSpacesToString(selection);

                                  if(str.length > 15){
                                    return "tooltip";
                                  }
                                  
                                }

                                return 'false';
                            });
                            
                            function getVal(d){
                                if(d.column === 'store'){
                                  var txtStoreVal = '';
                                  txtStoreVal = main.getName(d.value);

                                }else {
                                    txtStoreVal =  d.value; 
                                }

                                return txtStoreVal;
                            }

                        cells.append("span")
                             .attr({"class":"pBar"})
                             .attr("value",function(d,i) { return d.value; } )
                             .style("width", function(d){
                                    var vWidth = d.value;
                                    var barFinalWidth = x(vWidth);
                                    return (vWidth > 0) ? (barFinalWidth + 'px') : "0px";
                             })
                             .style({"height":"8px","display":"inline-block","margin-right":"5px"})
                             .style("background-color",function(d,i){ 
                                    return colors[i];
                                
                             } );

      /* Updating first column of the table */

      var firstColumn = rows.select("td");

                        //firstColumn.style("max-width","120");
                        firstColumn.select(".pBar").style("display","none");

      paginationController.init(data);

  }

  var _getTableWidth = function(data){

    var divWidth = 700;

    var columns = _extractKeysObject(data);

    var dLen = Object.keys(data[0]).length;

    var numCols = dLen + 1;

    var columnWidth = (divWidth / numCols);

    var tableWidth = columnWidth * numCols;

    return tableWidth;


  }

  var _appendSort = function(data,sortOn,id,divId,metric){

      $(id).empty();

      var width = $(id).width();

      var height = 30; 

      var singleData = ["1"];

      var columns = _extractKeysObject(data);

      var metricLength = Object.keys(data[0]).length;

      var tableWidth   = _getTableWidth(data);

      var colLen = metricLength;

      var widthId = $(divId).width();

      var colWidth = parseInt(tableWidth) / colLen;
   
      /* 

        150 = width of first column + width for text box + padding.
        Another way to do it could be calculating two different column widths
        and changing the above columnwidth var for that

      */

      var paddingTable = (width - tableWidth)/2;

      var initialX = paddingTable;

      var paddingXToLine = 10;

      var svg = d3.select(id)
                  .append("svg")
                  .attr({"width":width,"height":height});

      var line = svg.selectAll("line")
                    .data(singleData);

                line.enter().append("line")
                    .attr({"x1":initialX,"x2":width-initialX,"y1":20,"y2":20})
                    .attr({"stroke-width":0.5,"stroke":"#e1e1e1"});

      line.attr("x1",initialX)
          .attr("x2",width-initialX);

      var gIcon = svg.selectAll(".gIcon")
                     .data(columns);

          gIcon.enter().append('g')
               .attr("class","gIcon")
               .attr("sortVal",function(d){return d});

      var appendAscIcons = gIcon.selectAll("sortAsc")
                           .data(singleData);

          appendAscIcons.enter().append("svg:image")
                     .attr("xlink:href","img/sortAGray.png")
                     .attr({"width":"12px","height":"12px",'class': 'grayedOut sortAsc'})
                     .attr("sortHow","asc")
                     .attr("x", (initialX + 10))
                     .attr("y",15)
                     .on("click",function(d){

                          var allAsc = d3.selectAll('.sortAsc');
                          var allDsc = d3.selectAll('.sortDsc');

                          allAsc.attr('xlink:href','img/sortAGray.png');
                          allDsc.attr('xlink:href','img/sortDGray.png');

                          var clickedIcon = d3.select(this);

                          clickedIcon.attr("xlink:href","img/sortAOrange.png");

                          var sortOn = d3.select(this.parentNode).attr('sortVal');

                          function sortData(data, sortOn){

                            data = data.sort(function(a,b){

                                  return graphHelperFunctions.sortValsAsc(a[sortOn], b[sortOn]);

                            });

                            return data;
                          }
                          data = sortData(data, sortOn);

                          _plotHorizontalBar(data,metric,id);
                      });

          appendAscIcons.exit().remove();


      var appendDscIcon = gIcon.selectAll("sortDsc")
                               .data(singleData);

          appendDscIcon.enter().append("svg:image")
                       .attr("xlink:href","img/sortDGray.png")
                       .attr({"width":"12px","height":"12px",'class': 'grayedOut sortDsc'})
                       .attr("sortOn", function(d){ return d3.select(this.parentNode).attr('sortVal');})
                       .attr("sortHow","desc")
                       .attr("x",(initialX + 35))
                       .attr("y",15)
                       .on("click",function(d){

                          var allAsc = d3.selectAll('.sortAsc');
                          var allDsc = d3.selectAll('.sortDsc');

                          allAsc.attr('xlink:href','img/sortAGray.png')
                          allDsc.attr('xlink:href','img/sortDGray.png')

                          d3.select(this).attr('xlink:href','img/sortDOrange.png');

                          var sortOn = d3.select(this.parentNode).attr('sortVal');
                          
                          function sortData(data, sortOn){

                            data = data.sort(function(a,b){

                                  return graphHelperFunctions.sortValsDesc(a[sortOn], b[sortOn]);

                            });

                            return data;
                          }

                          data = sortData(data, sortOn);

                          _plotHorizontalBar(data,metric,id);

                      });
                      
          svg.select(".sortAsc") 
            .attr("xlink:href","img/sortAOrange.png");

          appendDscIcon.exit().remove();


          svg.selectAll(".gIcon")
             .each(function(d,i){

                  var transformXVal = (i * colWidth);

                      transformXVal = (i > 0) ? (transformXVal - paddingXToLine) : transformXVal;

                 d3.select(this).attr('transform', 'translate(' + transformXVal + ',' + 0 + ')')
              
             })

      line.exit().remove();

      gIcon.exit().remove();
  }

  var _sortDataInitial = function(data, attr){

    data = data.sort(function(a,b){

          return graphHelperFunctions.sortValsAsc(a[attr], b[attr]);
    });

    return data;
  }

  var _cleanBars = function(){

    $(".dThreeBars").empty();

    $(".dThreeBars").remove();

  }

    /** [extractKeysObject description] 
        Usage: keys of nested objects in an array
        Using Object.keys() method and not for in because 
        for in enumerated properties in the prototype chain as well.
    */
    var _extractKeysObject = function(data){
        var keys = [];
        for(var i = 0; i < data.length; i++){
            var objKeys = Object.keys(data[i]);
            if(!arrayEquality(objKeys,keys)){
                keys = objKeys
            }
        }
        return keys;
    }  

  return {
    init:init
  }


})();