function doUPLoadFile(result){
    featureNames = result.feature_names;
    n_feature = featureNames.length;
    typeOrder = n_feature+1;
    db.init(TableName,featureNames);
    dTable.init(featureNames);
    showData = [];
    for(var i = 0;i<result.data.length;i++)
    {
        dataRow =[];
        dataRow.push(i);
        for(var j = 0;j<n_feature;j++)
        {
            dataRow.push(parseFloat(result.data[i][j]));
        }
        dataRow.push(0);
        dataRow.push(0);
        showData.push(dataRow);
    }
    objString = JSON.stringify(showData);
    analyData = JSON.parse(objString);
    db.insertData(showData,++version)
    dTable.updateTable(showData);
    MakeBasicScatterData(showData,1,2);
    var typeSet = [];
    sql = "select clusterType ,count (*) as num from "+TableName+" where version = "+version +"  group by clusterType";
    db.doQuery(sql,function(resultSet) {
        for (var i =0;i<resultSet.length;i++)
        {
            type = {};
            type.name = resultSet[i].clusterType;
            type.num = resultSet[i].num;
            typeSet.push(type);

        }
        drawBasicPieChart(typeSet);
    });
    d3.select("#select_5").selectAll("option").remove();
             options =  d3.select("#select_5").selectAll("option").data(featureNames);
             options.enter().append("option")
                 .attr("value",(d,i)=>i)
                .text((d)=>d);
              d3.select("#select_4").selectAll("option").remove();
             options =  d3.select("#select_4").selectAll("option").data(featureNames);
             options.enter().append("option")
                 .attr("value",(d,i)=>i)
                .text((d)=>d);
              d3.select("#select_3").selectAll("option").remove();
             options =  d3.select("#select_3").selectAll("option").data(featureNames);
             options.enter().append("option")
                 .attr("value",(d,i)=>i)
                .text((d)=>d);


}
function showRuleResult(data){
    var test_url = "/getRuleTree/";
    $.ajax({
        type:"post",
        url:test_url,
        data:{
            "showData":JSON.stringify(data ),
            "n_feature":n_feature,
        },
        dataType:"json",
        success:function (dataRes) {
            var feature = dataRes['feature'];
            var right=dataRes['children_right'];
            var left=dataRes['children_left'];
            var threshold=dataRes['threshold'];
            for(var i = 0;i<threshold.length;i++){
                threshold[i] = threshold[i].toFixed(2);
            }
            var treeData = makeRuleTreeData(feature,right,left,threshold,data);
            drawRuleTreeChart(treeData);
        }
    });
}
function showClusterResult(){

        var test_url = "/divide/";
        a = $("#cluster_num").val();
        b = $("#dectree_val").val();
        if(a == "" || b == "")
        {
            layer.msg('请输入聚类参数');
            return;
        }
        $.ajax({
            type: "post",
            //async: false,
            url: test_url,
            data: {
                'dectree_val': b,
                'num_val':a,
                "showData":JSON.stringify(showData),
                "n_feature":n_feature,
            },
            //JSON.stringify(d.ind),
            dataType: "json",
            success: function (dataRes) {
                //console.log(dataRes);

                var feature = dataRes['feature'];
                var right=dataRes['children_right'];
                var left=dataRes['children_left'];
                var data=dataRes['data'];
                var threshold=dataRes['threshold'];
                var que_value=dataRes['value'];
                showData = data;
                for(var i = 0; i<data.length;i++)
                {
                    showData[i][typeOrder+1] = showData[i][typeOrder];
                }
                objString = JSON.stringify(showData);
                analyData = JSON.parse(objString);
                db.insertData(showData,++version);
                var typeSet = [];
                sql = "select clusterType ,count (*) as num from "+TableName+" where version = "+version +"  group by clusterType";
                db.doQuery(sql,function(resultSet) {
                    for (var i =0;i<resultSet.length;i++)
                    {
                        type = {};
                        type.name = resultSet[i].clusterType;
                        type.num = resultSet[i].num;
                        typeSet.push(type);

                    }
                    drawBasicPieChart(typeSet);
                });

               dTable.updateTable(showData);
                var treeData = makeTreeData(feature,right,left,que_value,threshold,data);

                drawBasicTreeChart(treeData);
                MakeBasicScatterData(data ,1,2);


            }
        });

    }
function changeScatterType() {
    tmp = $("#select_1").val();
    if (tmp == "0")
    {
         $("#select_2").show();
         $("#select_3").hide();
         $("#select_4").hide();
    }
    else
    {
         $("#select_2").hide();
         $("#select_3").show();
         $("#select_4").show();
    }
}
function showFeatureScatter() {
    temp1 = parseInt($("#select_3").val());
    temp2 = parseInt($("#select_4").val());
    MakeBasicScatterData(showData,temp1+1,temp2+1);
}
function  array2Json(colName) {
    var json=[];
    colName.forEach(function(item){
        var temp={};
        item.forEach(function(value,index){
            temp[index]=value;
        });
        json.push(temp);
    })
    return json;
}
function showProjec() {
    tmp = $("#select_2").val();
    url = "";
    if(tmp == "0")
    {
        url = "/showPCA/";
    }
    else
    {
        url= "/showTSNE/";
    }
    $.ajax({
        type:"POST",
        url:url,
        data:{
            "showData":JSON.stringify(showData ),
            "n_feature":n_feature,
        },
        success:function (dataRes) {
                data = dataRes.data;

                MakeBasicScatterData(data,0,1);
        }
    });

}
function changeRiverChart() {
    tmp = parseInt($("#select_5").val())+1;
    drawStreamChart(makeStreamData(showData,tmp));
}
function getTypeNum(data){
    var TypeSet = [];
    for(var i = 0;i<data.length;i++)
    {
        flag = true;
        for(var j = 0;j<TypeSet.length;j++) {
            if(TypeSet[j].name == data[i][n_feature+1])
            {
                TypeSet[j].num++;
                flag = false;
                break;
            }
        }
        if(flag)
        {
            typeNum = {};
            typeNum.name = data[i][n_feature+1];
            typeNum.num = 1;
            TypeSet.push(typeNum);
        }
    }
    return TypeSet;
}
function getTypeInfo(data){
    typeInfo = {};
    typeInfo.name =0;
    typeInfo.num = 0;
    typeInfo.allNum = data.length;
    for(var i = 0;i<data.length;i++)
    {

        if(data[i][n_feature+1]!=9)
        {
            typeInfo.name = data[i][n_feature+1];
            typeInfo.num++;
        }

    }
    return typeInfo;
}
