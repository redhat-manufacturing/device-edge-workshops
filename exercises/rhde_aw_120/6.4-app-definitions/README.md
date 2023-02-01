# Workshop Exercise 6.4 - App Definitions

## Table of Contents

* [Objective](#objective)
* [Step 1 - MQTT Service and Deployment](#step-1---mqtt-service-and-deployment)
* [Step 2 - Simulate Deployment](#step-2---simulate-deployment)
* [Step 3 - Control Deployment](#step-3---control-deployment)
* [Step 4 - UI Service and Deployment](#step-4---ui-service-and-deployment)
* [Conclusion](#conclusion)

## Objective

Since we're deploying our application to Kubernetes, we can now use native definitions to define what we would like to deploy.

Remember: our application has four main components, two of which we'll want to also create services for. These can all be defined in yaml, and Ansible will apply them.

### Step 1 - MQTT Service and Deployment

Return to your code repo and create a file at `playbooks/files/mqtt-service.yaml` with the following contents:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: mqtt
spec:
  ports:
  - port: 1883
    protocol: TCP
    targetPort: 1883
  selector:
    app: mqtt
  type: NodePort
```
Also create `playbooks/files/mqtt-deployment.yaml` with the following contents:
```yaml
apiVersion: apps/v1 
kind: Deployment
metadata:
  name: mqtt-deployment
spec:
  selector:
    matchLabels:
      app: mqtt
  replicas: 1
  template:
    metadata:
      labels:
        app: mqtt
    spec:
      containers:
        - name: mqtt
          image: quay.io/device-edge-workshops/process-control-mqtt:1.0.0
          ports:
            - containerPort: 1883
              name: mqtt-port
```

These will create a Service and a Deployment for our mqtt broker.

### Step 2 - Simulate Deployment

Now, create a file at `playbooks/files/simulate-deployment.yaml` with the following contents:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: simulate-deployment
spec:
  selector:
    matchLabels:
      app: simulate
  replicas: 1
  template:
    metadata:
      labels:
        app: simulate
    spec:
      containers:
        - name: simulate
          image: quay.io/device-edge-workshops/process-control-simulate-k8s:1.0.0
```

This will create a Deployment for the simulator portion of our app.

### Step 3 - Control Deployment

Next, create a file at `playbooks/files/control-deployment.yaml` with the following contents:
```yaml
apiVersion: apps/v1 
kind: Deployment
metadata:
  name: control-deployment
spec:
  selector:
    matchLabels:
      app: control
  replicas: 1
  template:
    metadata:
      labels:
        app: control
    spec:
      containers:
      - name: control
        image: quay.io/device-edge-workshops/process-control-control-k8s:1.0.0
```

### Step 4 - UI Service and Deployment

Finally, we'll get the UI running and accessible.

First, create a file at `playbooks/files/ui-service.yaml` with the following contents for the service:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: ui
spec:
  ports:
  - port: 1881
    protocol: TCP
    targetPort: 1881
  selector:
    app: ui
  type: NodePort
```

And a second at `playbooks/files/ui-deployment.yaml` with the the following:
```yaml
apiVersion: apps/v1 
kind: Deployment
metadata:
  name: ui-deployment
spec:
  selector:
    matchLabels:
      app: ui
  replicas: 1
  template:
    metadata:
      labels:
        app: ui
    spec:
      containers:
      - name: ui
        image: quay.io/device-edge-workshops/process-control-ui-k8s:1.0.0
        ports:
          - containerPort: 1881
            name: http-ui-port
```

### Conclusion

These YAML files define our application. Next, we'll leverage Ansible to talk directly to the k8s API to manage these resources.

---
**Navigation**

[Previous Exercise](../6.3-startup-k8s) | [Next Exercise](../6.5-deploy-k8s-app)

[Click here to return to the Workshop Homepage](../README.md)
