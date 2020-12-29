function showRuleInfo(rules) {
    d3.select("#ruleInfoView").selectAll("div").remove();
    divs = d3.select("#ruleInfoView").selectAll("div").data(rules);
    divs = divs.enter().append("div");

    divs.append("div").text((d,i)=>("规则"+i+":"))
    divs.append("div").text((d,i)=>("      "+d.rule+":"))
    divs.append("div").text(function (d,i) {
        return "样本数："+ d.num+"支持度："+d.support+"  置信度："+d.confidence;
    })
    divs.append("hr");

}