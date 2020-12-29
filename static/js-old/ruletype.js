function drawRuleTreeType(){
    const chart = new Chart();
    chart.box(d3.select("#ruleTypeView"));
    chart.renderRect = function(){
        chart.body().append("rect")
            .attr("x",0)
            .attr("width",150)
            .attr("height",30)
            .attr("fill",chart._colors(1));
        chart.body().append("rect")
            .attr("x",140)
            .attr("y",20)
            .attr("width",10)
            .attr("height",10)
            .attr("fill",chart._colors(2));
        chart.body().append("rect")
            .attr("x",130)
            .attr("y",20)
            .attr("width",10)
            .attr("height",10)
            .attr("fill",chart._colors(0));
        chart.body().append("rect")
            .attr("x",0)
            .attr("y",50)
            .attr("width",70)
            .attr("height",30)
            .attr("fill",chart._colors(0));
        chart.body().append("rect")
            .attr("x",60)
            .attr("y",70)
            .attr("width",10)
            .attr("height",10)
            .attr("fill",chart._colors(1));
        chart.body().append("rect")
            .attr("x",0)
            .attr("y",100)
            .attr("width",100)
            .attr("height",30)
            .attr("fill",chart._colors(2));

        chart.body().append("rect")
            .attr("x",90)
            .attr("y",120)
            .attr("width",10)
            .attr("height",10)
            .attr("fill",chart._colors(1));
    }
    chart.render = function(){

        // chart.renderTitle();

        chart.renderRect();

        // chart.renderText();

        // chart.renderLines();
        //
        // chart.addMouseOn();

    }
    chart.renderChart();
}