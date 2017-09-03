/** 蜡烛图元素的宽高计算、D3伸缩计算 */
var width = window.innerWidth*0.9
var height = window.innerHeight*0.9

//函数式引用，月份更改格式[https://github.com/d3/d3-time-format/blob/master/README.md#locale_format]出错
var parseDate = d3.timeParse("%d-%b-%y"); 

//x轴金融比例尺
var x = techan.scale.financetime().range([0, width]);
//y轴d3线性比例尺
var y = d3.scaleLinear().range([height, 0]);
//蜡烛图元素(图区的宽、高是由这里的比例尺界定的！！)
var candlestick = techan.plot.candlestick().xScale(x).yScale(y);
//x,y轴定义，应用对应比例尺
var xAxis = d3.axisBottom().scale(x);
var yAxis = d3.axisLeft().scale(y);

/** 定义整体svg画布元素(外层根容器)，定义宽、高和初步位移!!! */
var svg = d3.select("body").append("svg")
    .attr("width",window.innerWidth*0.95)
    .attr("height",window.innerHeight*0.95)
    .append("g")//内层分组容器：包含蜡烛图区、x轴、y轴(为了显示，右移20像素)
    .attr("transform", "translate(" + 20+ "," + 0 + ")");

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
    }).sort(function (a, b) { 
        return d3.ascending(accessor.d(a), accessor.d(b)); 
    });

    //定义candlestick区
    svg.append("g").attr("class", "candlestick");
    //定义x轴
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .text("日期");
    //定义y轴
    svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("美元");

    // 初始绘制50条
    draw(data.slice(0, data.length - 150));
    // 更新按钮 绘制200条
    //d3.select("button").on("click", function () { draw(data); }).style("display", "inline");
});

function draw(data) {
    //这是对比例尺对象做的什么处理?? -- data数据的提取转换器????
    x.domain(data.map(candlestick.accessor().d));//提取日期
    y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());//没有文档!!!

    //执行绘制的地方，把candlestick轴的绘制当做轴一样处理
    svg.selectAll("g.candlestick").datum(data).call(candlestick);
    svg.selectAll("g.x.axis").call(xAxis);
    svg.selectAll("g.y.axis").call(yAxis);
}