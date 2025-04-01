import json
from django.shortcuts import render
from django.http import JsonResponse,HttpResponseBadRequest

# Create your views here.

def index(req):
    return render(req,'create/index.html')

def create_form(req):
    if req.method == 'POST':
        try:
            data=json.loads(req.body)
            print(data)
        except json.JSONDecodeError:
            return HttpResponseBadRequest('Invalid data')
    else:
        data={'error':'Invalid request method. Use GET.'}
        return render(req,'create/create.html',{'data':data})