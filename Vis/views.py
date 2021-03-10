from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from Vis.svmModel import tsneModel,showTSNEView,showAttributeTSNE
from Vis.ReadFile import ReadCSVFile
from Vis.VisData import getData,getDectree,makeRuleTree
from Vis.NEOKmeans import NeoKmeans
from sklearn.datasets import load_iris
from Vis.BackendModel import getIrisData
import  numpy
import  json
import  json
# Create your views here.
def index(request):
    context = {}
    context['hello'] = 'Hello DXK'
    return render(request,'index.html',context)
def tsneView(request):
    dic = {}
    dic['index'] = tsneModel().tolist()
    return JsonResponse(dic)
def getdata(request):
    x = getIrisData()
    return  HttpResponse(x)


#@csrf_exempt
def test(request):
    return JsonResponse(getData(request))

def divide(request):
    dectree_val = request.POST.get('dectree_val')
    cluster_val = request.POST.get('num_val')
    tmp = request.POST.get('showData')
    n_feature = request.POST.get('n_feature')
    data = json.loads(tmp)
    return JsonResponse(getDectree(cluster_val,dectree_val,data,n_feature))
def cluster(request):
    out_val = request.POST.get('out_val')
    over_val = request.POST.get('over_val')
    num_val = request.POST.get('num_val')
    tmp = request.POST.get('showData')
    n_feature = int(request.POST.get('n_feature'))
    over_val = float(over_val)
    num_val = int(num_val)
    out_val = float(out_val)
    data = json.loads(tmp)
    data = numpy.array(data)
    clusterType,clusterAssment,centeroids  = NeoKmeans(data, num_val, over_val, out_val)
    result = {};
    result["type"] = clusterType
    result["assment"] = clusterAssment
    result['center'] = centeroids
    return JsonResponse(result)
#@csrf_exempt
def upload_file(request):
    if request.method == "POST":
        myFile = request.FILES.get("file",None)
        if not myFile:
            return HttpResponse("no file for upload")

        # destination = open(myFile.name,"wb+")
        # for chunk in myFile.chunks():
        #     destination.write(chunk)
        # destination.close()
        feature, data = ReadCSVFile("data2.csv")
        Result_data = {
            "code": 1,
            "data": data.tolist(),
            "feature_names": feature.tolist(),
        }
        return JsonResponse(Result_data)

#@csrf_exempt
def showTSNE(request):
    if request.method == "POST":
       tmp = request.POST.get('showData')
       tmp = json.loads(tmp)
       n_feature = int(request.POST.get('n_feature'))
       dic = {}
       dic['data'] = showTSNEView(tmp,n_feature).tolist()
       return JsonResponse(dic)
#@csrf_exempt
def showPCA(request):
    if request.method == "POST":
       tmp = request.POST.get('showData')
       tmp = json.loads(tmp)
       n_feature = int(request.POST.get('n_feature'))
       dic = {}
       dic['data'] = showTSNEView(tmp,n_feature).tolist()
       return JsonResponse(dic)
#@csrf_exempt
def getRuleTree(request):
    if request.method == "POST":
        data = request.POST.get('data')
        data = json.loads(data)
        type = int(request.POST.get('type'))
        typeArray = request.POST.get('typeArray')
        typeArray = json.loads(typeArray)
        return JsonResponse(makeRuleTree(data,type,typeArray))
def getAttributeTSNE(request):
    if request.method == "POST":
        data = request.POST.get('data')
        attribute = request.POST.get('attribute')
        data = json.loads(data)

        dic = {}
        dic['data'] = showAttributeTSNE(data, attribute).tolist()
        return JsonResponse(dic)

