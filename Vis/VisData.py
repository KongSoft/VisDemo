import numpy as np
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE
import random
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier
from sklearn.cluster import KMeans
from sklearn.tree import _tree
def getData(c):
    p = r'lucky2.txt'
    with open(p,encoding = 'utf-8') as f:
        data = np.loadtxt(f,delimiter = ",")
    y_Kmeans = KMeans(n_clusters=2, random_state=9).fit_predict(data)
    y_Kmeans.resize((data.shape[0],1))
    result = np.hstack((data, y_Kmeans))
    #print(y_Kmeans)
    dtc = DecisionTreeClassifier(criterion='entropy', max_depth=3)  # 建立决策树对象
    dtc.fit(data, y_Kmeans)  # 决策树拟合
    y_tree = dtc.predict(data)
    y_tree.resize((data.shape[0], 1))
    print("y_tree:::::::::::::::::::::")
    print("y_tree:::::::::::::::::::::")
    print(type(y_tree))
    result = np.hstack((result, y_tree))
    lable = np.zeros(data.shape[0])
    for i in range(data.shape[0]):
        lable[i]=i
    lable.resize((data.shape[0], 1))
    result = np.hstack((result, lable))
    #sub_data=[elem for elem in result if elem[0]<8.29]
    #print(result)
    #print(len(sub_data))
    dic ={}
    dic['data'] = result.tolist()
    dic['feature'] = dtc.tree_.feature.tolist()
    dic['children_right']=dtc.tree_.children_right.tolist()
    dic['children_left']= dtc.tree_.children_left.tolist()
    dic['value'] = dtc.tree_.value.tolist()
    dic['threshold'] = dtc.tree_.threshold.tolist()
    return dic


def  getDectree(cluster_val,dectree_val,data,n_feature):
    data = np.array(data)
    n_feature = int(n_feature)
    data_before = data[:, 0:1]
    data_after = data[:, n_feature+2:]
    data = data[:,1:n_feature+1]
    cluster_val=int(cluster_val)
    dectree_val = int(dectree_val)
    y_Kmeans = KMeans(n_clusters=cluster_val, random_state=9).fit_predict(data)
    y_Kmeans.resize((data.shape[0], 1))
    # tsne = TSNE(n_components=2)
    # data_tsne = tsne.fit_transform(data)
    # print("data_tsne::::::::::",data_tsne)
    result = np.hstack((data, y_Kmeans))
    result = np.hstack((data_before,result))
    result = np.hstack((result, data_after))
    dtc = DecisionTreeClassifier(criterion='entropy', max_depth=dectree_val)  # 建立决策树对象
    dtc.fit(data, y_Kmeans)  # 决策树拟合
    # lable =np.zeros(data.shape[0])
    # for i in range(data.shape[0]):
    #     lable[i]=i
    # lable.resize((data.shape[0], 1))
    # result = np.hstack((result, lable))
    #sub_data=[elem for elem in result if elem[0]<8.29]
    #print(result)
    #print(len(sub_data))
    dic ={}
    dic['data'] = result.tolist()
    dic['feature'] = dtc.tree_.feature.tolist()
    dic['children_right']=dtc.tree_.children_right.tolist()
    dic['children_left']= dtc.tree_.children_left.tolist()
    dic['value'] = dtc.tree_.value.tolist()
    dic['threshold'] = dtc.tree_.threshold.tolist()
    return dic
def makeRuleTree(data,type,typeArray):
    data = np.array(data)
    typeArray = np.array(typeArray)
    data_y = typeArray[:,type:type+1]
    dtc = DecisionTreeClassifier(criterion='entropy', max_depth=2)  # 建立决策树对象
    dtc.fit(data, data_y)  # 决策树拟合
    dic = {}
    dic['feature'] = dtc.tree_.feature.tolist()
    dic['children_right'] = dtc.tree_.children_right.tolist()
    dic['children_left'] = dtc.tree_.children_left.tolist()
    dic['value'] = dtc.tree_.value.tolist()
    dic['threshold'] = dtc.tree_.threshold.tolist()
    return dic
if __name__ == '__main__':
    res = getDectree(1,4)

    #print("feature:::::::", res['data'])
    #print("feature:::::::", res['data'][:][4])
    #print("feature:::::::",res['feature'])
    #print("right::::::::", res['children_right'])
    #print("left::::::::", res['children_left'])
    print("value::::::::", res['data'])
    #print("threshold::::::::", res['threshold'])
