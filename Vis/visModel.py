import sklearn
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, export_graphviz
import pydotplus
import numpy
import json
from IPython.display import display, Image
from sklearn.tree.export import export_text
class MyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, numpy.integer):
            return int(obj)
        elif isinstance(obj, numpy.floating):
            return float(obj)
        elif isinstance(obj, numpy.ndarray):
            return obj.tolist()
        else:
            return super(MyEncoder, self).default(obj)
def  decisionTree():
    iris = load_iris()
    x = iris.data
    y = iris.target
    r = {}
    r["code"] = 0
    r["msg"] = ""
    r["count"] = 150
    r["data"] = [];

    i =0
    while (i<x.shape[0]):
        record = {}
        record["p1"] = x[i][0]
        record['p2'] = x[i][1]
        record["p3"] = x[i][2]
        record["p4"]= x[i][3]
        record["p5"] = y[i]
        r["data"].append(record)
        i=i+1
    return json.dumps(r, cls=MyEncoder)

def decisionTreeVis():
    iris = load_iris()
    x = iris.data
    y = iris.target
    x_train,x_test,y_train,y_test=train_test_split(x,y,test_size=0.1,random_state=0)
    dtc = DecisionTreeClassifier(criterion='entropy',max_depth= 3) #建立决策树对象
    dtc.fit(x_train, y_train) #决策树拟合
    y_test_pre = dtc.predict(x_test) #预测
    print(y_test_pre)

    num = x.shape[0] #样本总数
    num_train = x_train.shape[0] #训练集样本数目
    num_test = num - num_train #测试集样本数D:/目
    acc = sum(y_test_pre == y_test) / num_test
    print('The accuracy is ', acc)
    dot_data = export_graphviz(dtc,out_file=None,feature_names=iris.feature_names,class_names=iris.target_names,filled=True,rounded=True,special_characters=True)
    print(dot_data)
    graph = pydotplus.graph_from_dot_data(dot_data)
    print(dtc.tree_.decision_path)
    graph.write_pdf("tree-vis.pdf")
    graph.write_png('iris.png')
    Image(graph.create_png())

decisionTreeVis()
