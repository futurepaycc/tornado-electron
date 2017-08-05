/** 进行宽高计算、D3伸缩计算 */
var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.timeParse("%d-%b-%y"); //函数式引用

var x = techan.scale.financetime().range([0, width]);

var y = d3.scaleLinear().range([height, 0]);

var candlestick = techan.plot.candlestick().xScale(x).yScale(y);

var xAxis = d3.axisBottom().scale(x);

var yAxis = d3.axisLeft().scale(y);

/** 生成svg画布 */
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/** 请求填充数据、绘制图形 */
d3.csv("/static/data.csv", function (error, data) {
    var accessor = candlestick.accessor();
    //取出200条数据进行转换并排序
    data = data.slice(0, 200).map(function (d) {
        return {
            date: parseDate(d.Date),
            open: +d.Open,
            high: +d.High,
            low: +d.Low,
            close: +d.Close,
            volume: +d.Volume
        };
    }).sort(function (a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });

    svg.append("g").attr("class", "candlestick");
    //绘制x轴
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")");
    //绘制y轴
    svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("美元");

    // Data to display initially 绘制50条
    draw(data.slice(0, data.length - 150));
    // Only want this button to be active if the data has loaded 绘制200条
    d3.select("button").on("click", function () { draw(data); }).style("display", "inline");
});

function draw(data) {
    x.domain(data.map(candlestick.accessor().d));
    y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());

    svg.selectAll("g.candlestick").datum(data).call(candlestick);
    svg.selectAll("g.x.axis").call(xAxis);
    svg.selectAll("g.y.axis").call(yAxis);
}