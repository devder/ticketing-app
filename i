install typescript in dir
-> npm i typescript ts-node-dev express @types/express

generate tsc config file in dir
-> tsc --init

edit package.json files to start script

add the Dockerfiles, add the skaffold files, build the docker image and push the client to docker hub
run -> docker build -t devder/[dockerimg] .
run -> docker push devder/[dockerimg]
run -> skaffold dev

add the ingress-srv file, install ingress with
# -> kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.0.0/deploy/static/
-> kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.0/deploy/static/provider/cloud/deploy.yaml

edit the /etc/hosts file with the host name you want in the ingress file (127.0.0.1 example.com)
-> code /etc/hosts

chrome will not let u access the file normally so you will need to type -> thisisunsafe 

run cmd for creating secret pods in kubernetes, also rem to add the env var to the yaml file
kubectl create secret generic [pod-name] --from-literal=[key]=[value].. for example 👇🏼
-> kubectl create secret generic jwt-secret --from-literal=JWT_KEY=secretjwtsecret

install test packages for development and add the test scripts to package.json
-> npm i -D @types/jest @types/supertest jest mongodb-memory-server supertest ts-jest


install react react-dom and next in the client folder after npm init -y

from the client, we will need to reach out to the auth srv, to do that in a good and dynamic manner, we reach out to
ingress-nginx namespace which in turn serves the req to the auth srv
to reach out to another namespace from one namespace, we use the url 
-> http://[nameofservice].[nameofnamespace].svc.cluster.local/
-> http://ingress-nginx.ingress-nginx.svc.cluster.local/

run -> kubectl get services -n ingress-nginx for "Cross Namespace Service Communication"
to find the correct service name for your specific Kubernetes provider
which should be ingress-nginx-controller

create a package in npm then a folder called common 
change the name in the package.json
to publish the package, we need to create a new git repo in the directory 
then [note that we will write TS but publish JS]
-> npm publish --access public
-> npm version patch (to update the version from the cli)

the 'pub' script in the package.json is to help ave time with a single command

when a new service is added, create a docker file, build and push the docker image to docker hub,update the ingress-srv file to expose the new service
and the skaffold yaml file

NATS Streaming server is used to share events between services inside our application (docs.nats.io)
NATS is diff from NATS Streaming Server

create a NATS deployment in the k8s then port forward in the terminal to be able to test it locally
-> kubectl port-forward [podname] [port]:[port]

visit localhost:8222/streaming after portforwarding to the monitoring port to see more details about the running NATS

build NATS singleton 

use __mocks__ to fake file imports, naming the fake files exactly as the original

use the mongoose-update-if-current plugin for OCC (Optimistic Concurrency Control) - versioning fields in the db

generate stripe api secret in the pod
-> kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=*****

push code to github and create github actions
sign up to digital ocean

kubectl uses contexts to run commnads, the default is to use the local machine context
'brew install doctl' to use the digital Ocean CLI