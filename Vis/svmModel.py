# _*_ coding:utf-8 -*-
from sklearn.manifold import TSNE
from sklearn.datasets import load_iris
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import numpy as np
def tsneModel():
    # 加载数据集
    iris = load_iris()
    # 共有150个例子， 数据的类型是numpy.ndarray
    print(iris.data.shape)
    # 对应的标签有0,1,2三种
    print(iris.target.shape)
    # 使用TSNE进行降维处理。从4维降至2维。
    tsne = TSNE(n_components=2, learning_rate=100).fit_transform(iris.data)
    # y = iris.target.reshpe(iris.data.shape[0],1);
    # num = np.hstack((tsne,iris.target))
    iris.target.resize((150,1))
    result =  np.hstack((tsne,iris.target))
    return  result
def showTSNEView(data,n_feature):
    data = np.array(data)
    result = TSNE(n_components=2, learning_rate=100).fit_transform(data)
    return result
def showPCAView(data,n_feature):
    data = np.array(data)
    result = PCA(n_components=2).fit_transform(data)
    return result
def showAttributeTSNE(data,attribute):
    data = np.array(data)
    attribute = int(attribute)
    data_before = data[:,:attribute]
    data_after = data[:,attribute+1:]
    attributeData = data[:,attribute]
    attributeData = attributeData.reshape((data.shape[0],1))
    data = np.hstack((data_before, data_after))
    result = TSNE(n_components=1, learning_rate=100).fit_transform(data)
    result = np.hstack((attributeData, result))
    return result
if __name__ == '__main__':
    print(tsneModel())