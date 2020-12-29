import matplotlib.pyplot as plt
from sklearn.datasets.samples_generator import make_blobs
from sklearn.cluster import KMeans
from sklearn.tree import DecisionTreeClassifier, export_graphviz
import pydotplus
from IPython.display import display, Image
import numpy as np
from sklearn.tree import _tree
import  json
from sklearn.manifold import TSNE
# X为样本特征，Y为样本簇类别，共1000个样本，每个样本2个特征，对应x和y轴，共4个簇，
# 簇中心在[-1,-1], [0,0],[1,1], [2,2]， 簇方差分别为[0.4, 0.2, 0.2]
# X, y = make_blobs(n_samples=1000, n_features=2, centers=[[0, 0], [2, 2]],
#                   cluster_std=[0.2, 0.2], random_state=9)

def try3(tree, feature_names):
    tree_ = tree.tree_
    feature_name = [feature_names[i]
                    if i != _tree.TREE_UNDEFINED else "undefined!"
                    for i in tree_.feature]
    print("def tree({}):".format(", ".join(feature_names)))

    def recurse(node, depth):
        indent = "    " * depth
        if tree_.feature[node] != _tree.TREE_UNDEFINED:

            name = feature_name[node]
            threshold = tree_.threshold[node]
            print("{}if {} <= {}:".format(indent, name, threshold))
            recurse(tree_.children_left[node], depth + 1)
            print("{}else:  # if {} > {}".format(indent, name, threshold))
            recurse(tree_.children_right[node], depth + 1)
        else:
            print("{}return {}".format(indent, np.argmax(tree_.value[node])))

    recurse(0, 1)


with open("D://track_hour_entro.json") as f:
    js = json.load(f)
ls = []
for k, v in js.items():
    ls.append(v)
y_Kmeans = KMeans(n_clusters=4, random_state=9).fit_predict(ls)

tsne = TSNE(n_components= 2)
data = tsne.fit_transform(ls)
plt.scatter(data[:, 0], data[:, 1], c=y_Kmeans)
plt.show()
dtc = DecisionTreeClassifier(criterion='entropy',max_depth=4) #建立决策树对象
dtc.fit(ls, y_Kmeans)  # 决策树拟合
y_tree = dtc.predict(ls)
plt.scatter(data[:, 0], data[:, 1], c=y_tree)
plt.show()

try3(dtc,['x1','x2','x3'])
dot_data = export_graphviz(dtc,out_file=None,filled=True,rounded=True,special_characters=True)
graph = pydotplus.graph_from_dot_data(dot_data)
graph.write_png("tree.png")
Image(graph.create_png())

