#!/bin/bash

kubectl delete -f ./Deployment.yml | true  &&
docker build . -t netcoreapi &&
docker build ./FlashTalk.UI/ -t netcoreapp &&
kubectl apply -f ./Deployment.yml