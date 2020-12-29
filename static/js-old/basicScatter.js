function MakeBasicScatterData(data,i ,j){
    Indata = [];
    for(m =0;m<data.length;m++)
    {
        tmp = [data[m][i],data[m][j],showData[m][typeOrder+1]];
        Indata.push(tmp);
    }
    drawBasicScatter(Indata);
}
function  drawBasicScatter(data) {
    /* ----------------------------配置参数------------------------  */
    const chart = new Chart();
    const config = {
        pointColor: chart._colors(0),
        margins: {top: 20, left: 80, bottom: 50, right: 80},
        textColor: 'black',
        gridColor: 'gray',
        title: '散点图',
        pointSize: 5,
        hoverColor: 'white',
        animateDuration: 1000
    }

    chart.margins(config.margins);

    /* ----------------------------尺度转换------------------------  */
    chart.scaleX = d3.scaleLinear()
                    .domain([d3.min(data, (d) => d[0]), d3.max(data, (d) => d[0])])
                    .range([0, chart.getBodyWidth()]),

    chart.scaleY = d3.scaleLinear()
                    .domain([d3.min(data, (d) => d[1]), d3.max(data, (d) => d[1])])
                    .range([chart.getBodyHeight(), 0]);

    /* ----------------------------渲染数据点------------------------  */
    chart.renderPoints = function(){
        let points = chart.body().selectAll('.point')
                    .data(data);

        var arc=d3.arc()
		    .innerRadius(0)
		    .outerRadius(5);
            arcs = points.enter()
                .append('g')
                .attr("class","point")
                .attr("transform",(d)=>"translate("+chart.scaleX(d[0])+","+chart.scaleY(d[1])+")");
            arcs.each(function (d,i) {
                a = d[2].toString().split("_");
                for(var i  = 0;i<a.length;i++)
                {
                    d3.select(this).append("path").attr("fill", chart._colors(a[i]))
                    .attr("d",arc.startAngle((Math.PI*2/a.length)*i).endAngle((Math.PI*2/a.length)*(i+1)));
                }
            });
            points.exit()
                    .remove();
    },

    /* ----------------------------渲染坐标轴------------------------  */
    chart.renderX = function(){
        chart.svg().insert('g','.body')
                .attr('transform', 'translate(' + chart.bodyX() + ',' + (chart.bodyY() + chart.getBodyHeight()) + ')')
                .attr('class', 'xAxis')
                .call(d3.axisBottom(chart.scaleX));
    },

    chart.renderY = function(){
        chart.svg().insert('g','.body')
                .attr('transform', 'translate(' + chart.bodyX() + ',' + chart.bodyY() + ')')
                .attr('class', 'yAxis')
                .call(d3.axisLeft(chart.scaleY));
    },

    chart.renderAxis = function(){
        chart.renderX();
        chart.renderY();
    },

    /* ----------------------------渲染文本标签------------------------  */
    chart.renderText = function(){
        d3.select('.xAxis').append('text')
                            .attr('class', 'axisText')
                            .attr('x', chart.getBodyWidth())
                            .attr('y', 0)
                            .attr('fill', config.textColor)
                            .attr('dy', 30)
                            .text('X');

        d3.select('.yAxis').append('text')
                            .attr('class', 'axisText')
                            .attr('x', 0)
                            .attr('y', 0)
                            .attr('fill', config.textColor)
                            .attr('dx', '-30')
                            .attr('dy', '10')
                            .text('Y');
    },

    /* ----------------------------渲染网格线------------------------  */
    chart.renderGrid = function(){
        d3.selectAll('.yAxis .tick')
            .each(function(d, i){
                    d3.select(this).append('line')
                        .attr('class','grid')
                        .attr('stroke', config.gridColor)
                        .attr('x1', 0)
                        .attr('y1', 0)
                        .attr('x2', chart.getBodyWidth())
                        .attr('y2', 0);
            });

        d3.selectAll('.xAxis .tick')
            .each(function(d, i){
                    d3.select(this).append('line')
                        .attr('class','grid')
                        .attr('stroke', config.gridColor)
                        .attr('x1', 0)
                        .attr('y1', 0)
                        .attr('x2', 0)
                        .attr('y2', -chart.getBodyHeight());
            });
    },

    /* ----------------------------渲染图标题------------------------  */
    chart.renderTitle = function(){
        chart.svg().append('text')
                .classed('title', true)
                .attr('x', chart.width()/2)
                .attr('y', 0)
                .attr('dy', '2em')
                .text(config.title)
                .attr('fill', config.textColor)
                .attr('text-anchor', 'middle')
                .attr('stroke', config.textColor);

    },

    /* ----------------------------绑定鼠标交互事件------------------------  */
    chart.addMouseOn = function(){
        //防抖函数
        function debounce(fn, time){
            let timeId = null;
            return function(){
                const context = this;
                const event = d3.event;
                timeId && clearTimeout(timeId)
                timeId = setTimeout(function(){
                    d3.event = event;
                    fn.apply(context, arguments);
                }, time);
            }
        }

        // d3.selectAll('.point')
        //     .on('mouseover', function(d){
        //         const e = d3.event;
        //         const position = d3.mouse(chart.svg().node());
        //         e.target.style.cursor = 'hand'
        //         chart.svg()
        //             .append('text')
        //             .classed('tip', true)
        //             .attr('x', position[0]+5)
        //             .attr('y', position[1])
        //             .attr('fill', config.textColor)
        //             .text('x: ' + d[0] + ', y: ' + d[1]);
        //     })
        //     .on('mouseleave', function(){
        //         const e = d3.event;
        //
        //         d3.select('.tip').remove();
        //     })
        //     .on('mousemove', debounce(function(){
        //             const position = d3.mouse(chart.svg().node());
        //             d3.select('.tip')
        //             .attr('x', position[0]+5)
        //             .attr('y', position[1]-5);
        //         }, 6)
        //     );
    },

    chart.render = function(){

        chart.renderAxis();

        chart.renderText();

        //chart.renderGrid();

        chart.renderPoints();

        chart.addMouseOn();

    },
    chart.box(d3.select("#scatterView")),
    chart.renderChart()
}













