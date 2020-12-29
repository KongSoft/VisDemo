function doUPLoadFile(result){
    featureNames = result.feature_names;
    showData = [];
    n_feature = featureNames.length;
    typeList = [];
    dTable.init(featureNames);
    tableData = [];
    for(var i = 0;i<result.data.length;i++)
    {
        dataRow =[];
        showRow= [];
        dataRow.push(i);
        for(var j = 0;j<n_feature;j++)
        {
            dataRow.push(parseFloat(result.data[i][j]));
            showRow.push(parseFloat(result.data[i][j]));
        }
        dataRow.push(0);
        typeList.push("0");
        tableData.push(dataRow);
        showData.push(showRow);
    }

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
    dTable.updateTable(tableData);
    drawBasicScatter();

}
function showRuleResult(k){
    var test_url = "/getRuleTree/";
    $.ajax({
        type:"post",
        url:test_url,
        data:{
            "data":JSON.stringify(showData),
            "type":k,
            "typeArray":JSON.stringify(typeArray)
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
             makeRuleTreeData(feature,right,left,threshold,k);

        }
    });
}
function showClusterResult(){

        var test_url = "/cluster/";
        a = $("#cluster_num").val();
        b = $("#cluster_Overlap").val();
        c = $("#cluster_Outlier").val();
        if(a == "" || b == "" || c=="")
        {
            layer.msg('请输入聚类参数');
            return;
        }
        $.ajax({
            type: "post",
            //async: false,
            url: test_url,
            data: {
                'out_val': c,
                'over_val': b,
                'num_val':a,
                "showData":JSON.stringify(showData),
                "n_feature":n_feature,
            },
            //JSON.stringify(d.ind),
            dataType: "json",
            success: function (dataRes) {
                //console.log(dataRes);

                typeList = dataRes['type'];
                for (var i = 0;i<typeList.length;i++)
                {
                    if (typeList[i] =="")
                        typeList[i]="0";
                }
                typeArray = dataRes['assment'];
                centerPoint = dataRes['center'];
                drawBasicScatter();
                drawOverlapType();
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
    drawBasicScatter();
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
function changeRiverChart() {
    tmp = parseInt($("#select_5").val())+1;
    drawStreamChart(makeStreamData(showData,tmp));
}
// function getTypeNum(data){
//     var TypeSet = [];
//     for(var i = 0;i<data.length;i++)
//     {
//         flag = true;
//         for(var j = 0;j<TypeSet.length;j++) {
//             if(TypeSet[j].name == data[i][n_feature+1])
//             {
//                 TypeSet[j].num++;
//                 flag = false;
//                 break;
//             }
//         }
//         if(flag)
//         {
//             typeNum = {};
//             typeNum.name = data[i][n_feature+1];
//             typeNum.num = 1;
//             TypeSet.push(typeNum);
//         }
//     }
//     return TypeSet;
// }
// function getTypeInfo(data){
//     typeInfo = {};
//     typeInfo.name =0;
//     typeInfo.num = 0;
//     typeInfo.allNum = data.length;
//     for(var i = 0;i<data.length;i++)
//     {
//
//         if(data[i][n_feature+1]!=9)
//         {
//             typeInfo.name = data[i][n_feature+1];
//             typeInfo.num++;
//         }
//
//     }
//     return typeInfo;
// }
function getTypeNum(data,k){
    s =0;
    for(var i = 0;i<data.length;i++)
        s+=parseInt(data[i][k]);
    return s;
}