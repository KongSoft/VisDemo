
var dataTable =  function () {
    return{
        init:function (features) {
            colums = [];
            colums.push('name');
            for(var i = 0;i<features.length;i++)
            {
                colums.push(features[i]);
            }
            colums.push("clusterType");
            colums.push("finalType");
            d3.select("thead").select("tr").remove();
            ths = d3.select("thead").append("tr").selectAll("th").data(colums);
            ths.enter().append('th').text((d)=>d);
            ths.exit().remove();
        },
        updateTable:function (tableData) {
            d3.select("tbody").selectAll("tr").remove();
            var  length = tableData[0].length;
            trs = d3.select("tbody").selectAll("tr").data(tableData);
            trs_enter = trs.enter().append("tr");
            for (var i=0;i<length;i++)
            {
                trs_enter.append('td').text((d)=>d[i]);
            }
            trs_enter.on('click', function (d,i) {
                layer.prompt({
                    formType: 0,
                    value: d[n_feature+2],
                    title: '请输入值',
                }, function(value, index, elem){
                    showData[i][n_feature+2] = value;
                    layer.close(index);
                    dTable.updateTable(showData);
                    MakeBasicScatterData(showData,1,2);
                });
            });
        },

    }
}