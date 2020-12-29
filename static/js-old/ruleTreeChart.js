
 function getRuleNode(data,k) {
        allnum = getTypeNum(data.data.typeInfo);
        if(data.children == null)
        {
            alltypeInfo = getTypeInfo(showData);
            rule = {};
            rule.data= data.data.data;
            if(typeInfo.num !=0)
            {
                rule.rule = data.data.rule;
                rule.num = data.data.num;
                rule.support = data.data.num/alltypeInfo.num;
                rule.confidence = data.data.num/rule.data.length;
                rules.push(rule);
            }

        }
        else{
            getRuleNode(data.children[0],k);
            getRuleNode(data.children[1],k);
        }
    }
function makeRuleTreeData(feature,right,left,threshold,retdata){
    //定义每个决策树结点name:id,data:数据点数组，feature:特征，que_value:不同类的点数数组
    //threshold:属性划分点，parent:父结点id，children：子结点

    var Denode = function (id,data,feature, threshold, children,rule) {
        this.id = id;
        this.data=data;
        this.feature = feature;
        this.threshold = threshold;
        this.children = children;
        this.rule = rule;
        this.typeInfo = {};
    };

    var dectree_tmp = [];


    //存储结点数组
    for (var i = 0; i < feature.length; i++) {
        dectree_tmp.push(new Denode(i,[],feature[i], threshold[i],[],""));
    }
    //console.log(dectree_tmp);
    //dectree[0]=dectree_tmp[0];
    //赋予根结点data数组，其子结点逐层划分
    dectree_tmp[0].data=retdata;
    dectree_tmp[0].typeInfo = getTypeInfo(retdata);
    //对left.right数组做一边遍历，将每个结点的子结点的引用加入到结点的childran数组
    //对每个结点的data数组进行划分，根据划分的属性feature和阈值threshold进行划分
    for (var i = 0; i < feature.length; i++) {
        var sub_data=[];
        if (left[i] > 0) {
            dectree_tmp[i].children.push(dectree_tmp[left[i]]);
            sub_data = dectree_tmp[i].data.filter(function(d){
                //console.log(d);
                return d[dectree_tmp[i].feature+1]<= dectree_tmp[i].threshold;
            });
            dectree_tmp[left[i]].data=sub_data;
            dectree_tmp[left[i]].typeInfo = getTypeInfo(sub_data);
            if (dectree_tmp[i].rule=="")
                dectree_tmp[left[i]].rule = featureNames[feature[i]]+"<="+dectree_tmp[i].threshold;
            else
                dectree_tmp[left[i]].rule = dectree_tmp[i].rule+" && " +featureNames[feature[i]]+"<="+dectree_tmp[i].threshold;
            //dectree_tmp[i].da
        }
        if (right[i] > 0) {
            dectree_tmp[i].children.push(dectree_tmp[right[i]]);
            sub_data = dectree_tmp[i].data.filter(function (d) {
                return d[dectree_tmp[i].feature+1]>dectree_tmp[i].threshold;
            });
            dectree_tmp[right[i]].data=sub_data;
            dectree_tmp[right[i]].typeInfo = getTypeInfo(sub_data);
            if (dectree_tmp[i].rule=="")
                dectree_tmp[right[i]].rule =featureNames[feature[i]]+">"+dectree_tmp[i].threshold;
            else
                dectree_tmp[right[i]].rule = dectree_tmp[i].rule+" && " +featureNames[feature[i]]+">"+dectree_tmp[i].threshold;

        }

    }

    //console.log(dectree_tmp[0]);
    //treeData是参考决策树的数据名称，直接利用这个接口
    return  dectree_tmp[0];
}
function drawRuleTreeChart(data){
    /* ----------------------------配置参数------------------------  */
    const chart = new Chart();
     rules = [];
    const config = {
        margins: {top: 10, left: 10, bottom: 10, right: 10},
        textColor: 'black',
        title: '基础树图',
        hoverColor: 'gray',
        animateDuration: 1000,
        pointSize: 5,
        pointFill: 'white',
        pointStroke: 'red',
        paddingLeft: 20,
        lineStroke: 'gray'
    }

    chart.margins(config.margins);

    /* ----------------------------数据转换------------------------  */
    chart._nodeId = 0;  //用于标识数据唯一性

    const root = d3.hierarchy(data);

    const generateTree = d3.tree()
                    .size([chart.getBodyWidth()*0.8,chart.getBodyHeight()]);

    generateTree(root);

    /* ----------------------------渲染节点------------------------  */
    chart.renderNode = function(){

        const groups = chart.body().selectAll('.g')
                                    .data(root.descendants(), (d) => d.id || (d.id = ++chart._nodeId));

        const groupsEnter = groups.enter()
                                    .append('g')
                                    .attr('class', (d) => 'g g-' + d.id)
                                    .attr('transform-origin', (d) => {    //子树从点击位置逐渐放大
                                        if (d.parent){
                                            return chart.oldX + config.paddingLeft + ' ' + chart.oldY;
                                        }
                                        return d.x + config.paddingLeft + ' ' + d.y;
                                    })
                                    .attr('transform', (d) => {    //首次渲染进入不放缩
                                        if (d.parent && chart.first) return 'scale(0.01)' + 'translate(' + (chart.oldX + config.paddingLeft) + ',' + chart.oldY + ')';
                                        return 'scale(1)' + 'translate(' + (d.x + config.paddingLeft) + ',' + d.y + ')';
                                    })


        groupsEnter.selectAll('rect').remove();
        groupsEnter.append('rect')
            .attr('width',(d) => d.data.typeInfo.allNum)
            .attr('height',10)
            .attr('fill', "white")
            .attr('stroke',"black");
         groupsEnter.append('rect')
            .attr('width',(d) => d.data.typeInfo.num)
            .attr('height',10)
            .attr('fill', (d)=>chart._colors(d.data.typeInfo.name));
        groupsEnter.merge(groups)
            .transition().duration(config.animateDuration)
                    .attr('transform', (d) => 'translate(' + (d.x + config.paddingLeft) + ',' + d.y + ')');
        groups.exit()
            .attr('transform-origin', (d) => (chart.targetNode.x + config.paddingLeft) + ' ' + chart.targetNode.y)  //子树逐渐缩小到新位置
            .transition().duration(config.animateDuration)
            .attr('transform', 'scale(0.01)')
            .remove();


    }

    /* ----------------------------渲染文本标签------------------------  */
    chart.renderText = function(){
        d3.selectAll('.text').remove();

        const groups = d3.selectAll('.g');

        groups.append('text')
              .attr('class', 'text')
              .text((d) => d.data.name + ":"+ d.data.feature +" <" +Math.round( d.data.threshold*100)/100)
              .attr('dy', function(){
                  return chart.textDy || (chart.textDy = this.getBBox().height/4);
              })
              .attr('text-anchor', (d) =>{
                  return d.children ? 'end' : 'start';
              })
              .attr('dx', (d) =>{
                return d.children ? -config.pointSize*1.5 : config.pointSize*1.5;
            });
    }

    /* ----------------------------渲染连线------------------------  */
    chart.renderLines = function(){
        const nodesExceptRoot = root.descendants().slice(1);

        const links = chart.body().selectAll('.link')
                                .data(nodesExceptRoot, (d) => d.id || (d.id = ++chart._nodeId));

              links.enter()
                     .insert('path', '.g')
                     .attr('class', 'link')
                     .attr('transform-origin', (d) => {
                        if (d.parent){           //连线从点击位置逐渐放大
                            return chart.oldX + config.paddingLeft + ' ' + chart.oldY;
                        }
                        return d.x + config.paddingLeft + ' ' + d.y;
                    })
                    .attr('transform', (d) => {                //首次渲染进入不放缩
                        if (d.parent && chart.first) return 'scale(0.01)  translate(' + (d.data.typeInfo.num/2) + ',0)';
                        return 'scale(1) translate(' + (d.data.typeInfo.num/2) + ',0)';
                    })
                  .attr("stroke-width",(d)=> d.data.typeInfo.num != '0'?d.data.typeInfo.num:1)
                  .merge(links)
                  .transition().duration(config.animateDuration)
                  .attr('d', (d) => {
                      return generatePath(d, d.parent);
                  })
                  .attr('transform',(d)=> 'scale(1) translate(' + (d.data.typeInfo.num/2) + ',0) ')
                  .attr('fill', 'none').attr('stroke', (d)=>chart._colors(d.data.typeInfo.name))
                  .attr("opacity",0.4);

              links.exit()
                     .attr('transform-origin', (d) => {    //连线逐渐缩小到新位置
                         return chart.targetNode.x + config.paddingLeft + ' ' + chart.targetNode.y;
                     })
                     .transition().duration(config.animateDuration)
                     .attr('transform', 'scale(0.01)')
                     .remove();

        function generatePath(node1, node2){
            const path = d3.path();
            var offset = 0;
            for(var i = 0; node1!= node2.children[i];i++)
            {
                offset+=node2.children[i].data.typeInfo.num;
            }
            path.moveTo(node1.x + config.paddingLeft, node1.y);
            path.bezierCurveTo(
                                 node1.x+ config.paddingLeft,(node1.y + node2.y)/2 ,
                                 node2.x+offset+ config.paddingLeft,(node1.y + node2.y)/2 ,
                                 node2.x +offset+ config.paddingLeft, node2.y
                              );
            return path.toString();
        }
    }

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

    }

    /* ----------------------------绑定鼠标交互事件------------------------  */
    chart.addMouseOn = function(){

        d3.selectAll('.g')
            .on('click', function(d){
                showData = d.data.data;
                drawStreamChart(makeStreamData(showData,3));
                var parallelLineData = makeParallelLineData(d.data.data);
                drawParallelLineChart(parallelLineData);
                tmp = $("#select_1").val();
                if(tmp == "0")
                {
                    showProjec();
                }
                else
                {
                    showFeatureScatter();
                }
                rules = [];
                toggle(d);
                generateTree(root);
                chart.renderNode();
                chart.renderLines();
                chart.addMouseOn();
                getRuleNode(root,k);
                showRuleInfo(rules);

            });

        function toggle(d){
            chart.first = true;
            if (d.children){
                d._children = d.children;
                d.children = null;
            }else{
                d.children = d._children;
                d._children = null;
            }
            chart.oldX = d.x;  //点击位置x坐标
            chart.oldY = d.y;  //点击位置y坐标
            chart.targetNode = d;  //被点击的节点
        }
    }

    chart.render = function(){

        // chart.renderTitle();

        chart.renderNode();

        // chart.renderText();

        chart.renderLines();

        chart.addMouseOn();

    }
    chart.box(d3.select("#ruleTreeView"));
    chart.renderChart();
    rules = [];
    getRuleNode(root);
    showRuleInfo(rules);
}














