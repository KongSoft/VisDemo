function drawOverlapType(){
    var k = typeArray[0].length;
    var typeInfo = new Array();
    for(var i =0;i<k;i++)
    {
        typeInfo[i] = new Array();
        for (var j = 0;j<k;j++)
        {
            typeInfo[i][j] = 0;
        }
        for (var j = 0;j<typeArray.length;j++)
        {
            if(typeArray[j][i]==1)
            {
                for (var m = 0;m<k;m++)
                {
                    if (typeArray[j][m]==1)
                        typeInfo[i][m]++;
                }
            }
        }
    }
    let d = d3.select("#typeInfoView");
    for (let i = 0;i<k;i++)
    {
        let con = d.append("div").style("display","inline-block").style("width","200px").style("height","200px");
        makeBarData(typeInfo[i],con);
    }

    var out_num = typeArray.length;
    for(let k = 0;k<typeArray.length;k++)
    {
        for(let n = 0;n<typeArray[k].length;n++)
        {
            if(typeArray[k][n]==1)
            {
                out_num--;
                break;
            }
        }
    }
    let context = "当前共有"+typeArray.length+"个样本，划分为"+k+"个集群，每个集群的样本个数为";
    let count  = 0;
    for(let i  = 0;i<typeInfo.length;i++)
    {
        count+=typeInfo[i][i];
        context+=typeInfo[i][i]+",";
    }
    context+="异常值个数为"+out_num+"覆盖度为："+count/typeArray.length+"异常值比率为："+out_num/typeArray.length;
    d3.select("#stateInfoView").text(context);
    var maxNum =0;
    for(var i =0;i<k;i++){
         if(typeInfo[i][i]>maxNum)
             maxNum = typeInfo[i][i];
     }
    const chart = new Chart();
    chart.width(260);
    chart.scale = d3.scaleLinear()
                    .domain([0, maxNum])
                    .range([0, chart.getBodyWidth()]),
    chart.box(d3.select("#ruleTypeView"));
    chart.renderRect = function(){
        chart.body().selectAll('rect').remove();
        var rects = chart.body().selectAll('rect').data(typeInfo);
        rects.enter().append("rect")
            .attr("class","type")
            .attr("x",0)
            .attr("y",(d,i)=>i*50)
            .attr("width",(d,i)=>chart.scale(d[i]))
            .attr("height",30)
            .attr("fill",(d,i)=>chart._colors[i+1]);
        rects.enter().each(function (d,i) {
            var offset = d[i];
            for (var j =0;j<d.length;j++)
            {
                if(j!=i && d[j]!=0)
                {
                    offset = offset - d[j];
                    chart.body().append("rect")
                        .attr("x",chart.scale(offset))
                        .attr("y",i*50+20)
                        .attr("width",chart.scale(d[j]))
                        .attr("height",10)
                        .attr("fill",(d,i)=>chart._colors[j+1]);
                }
            }
        });

    }
    chart.addMouseOn = function(){
        d3.selectAll('.type').on('click',function (d,i) {
                typek = i;
                showRuleResult(i)
            });
    }
    chart.render = function(){
        chart.renderRect();
        chart.addMouseOn();
    }
    chart.renderChart();
}