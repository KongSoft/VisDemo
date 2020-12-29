import numpy
import csv
from sklearn import svm
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier, export_graphviz
from sklearn.model_selection import train_test_split
from sklearn.manifold import TSNE
import json
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
def show_accuracy(a, b, tip):
    acc = a.ravel() == b.ravel()
    print('%s Accuracy:%.3f' % (tip, numpy.mean(acc)))
def readFromCSV(path):
    data = numpy.loadtxt(path, dtype=float, delimiter=',')
    x, y = numpy.split(data, (4,), axis=1)
    return x,y
def saveAsCSV(path,x,y):
    n = numpy.concatenate((x, y), axis=1)
    with open(path, "w") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerows(n)
def svmPredict(train_x,train_y):
    svmModel = svm.SVC(C=0.8, kernel='rbf', gamma=20, decision_function_shape='ovr')
    svmModel.fit(train_x, train_y.ravel())
    iris = load_iris()
    x = iris.data
    y = iris.target
    result_y = svmModel.predict(x)
    show_accuracy(result_y,y,"svm预测")
    return x,result_y
def decisionTreePredict(train_x,train_y):
    decisionTreeMdel = DecisionTreeClassifier(criterion='entropy', max_depth=3)  # 建立决策树对象
    decisionTreeMdel.fit(train_x,train_y)
    iris = load_iris()
    x = iris.data
    y = iris.target
    result_y = decisionTreeMdel.predict(x)
    show_accuracy(result_y, y, "决策树预测")
    return x,result_y
def getIrisData():
    iris = load_iris()
    x = iris.data
    y = iris.target
    r = {}
    r["code"] = 0
    r["msg"] = ""
    r["count"] = 150
    r["data"] = [];
    i = 0
    while (i < x.shape[0]):
        record = {}
        record["p1"] = x[i][0]
        record['p2'] = x[i][1]
        record["p3"] = x[i][2]
        record["p4"] = x[i][3]
        record["p5"] = y[i]
        r["data"].append(record)
        i = i + 1
    return json.dumps(r, cls=MyEncoder)
def tsneModel():
    iris = load_iris()
    tsne = TSNE(n_components=2, learning_rate=100).fit_transform(iris.data)
    iris.target.resize((150,1))
    result = numpy.hstack((tsne,iris.target))
    return  result
if __name__ == '__main__':
    iris = load_iris()
    x = iris.data
    y = iris.target
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.9, random_state=0)
    x_train,y_train = svmPredict(x_train, y_train)
    x_train, y_train = decisionTreePredict(x_train, y_train)
    x_train, y_train = svmPredict(x_train, y_train)
    x_train, y_train = decisionTreePredict(x_train, y_train)
    x_train, y_train = svmPredict(x_train, y_train)
    x_train, y_train = decisionTreePredict(x_train, y_train)
    x_train, y_train = svmPredict(x_train, y_train)
    x_train, y_train = decisionTreePredict(x_train, y_train)
    x_train, y_train = svmPredict(x_train, y_train)
    x_train, y_train = decisionTreePredict(x_train, y_train)
    x_train, y_train = svmPredict(x_train, y_train)
    x_train, y_train = decisionTreePredict(x_train, y_train)
    x_train, y_train = svmPredict(x_train, y_train)
    x_train, y_train = decisionTreePredict(x_train, y_train)
    x_train, y_train = svmPredict(x_train, y_train)
    x_train, y_train = decisionTreePredict(x_train, y_train)