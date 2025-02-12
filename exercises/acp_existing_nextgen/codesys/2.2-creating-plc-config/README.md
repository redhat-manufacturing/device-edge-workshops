# Workshop Exercise 2.2 -  Creating configuration vPLCs

## Table of Contents

* [Objective](#objective)
* [Step 1 - Helm Chart Structure](#step-1---config-as-configmap)
* [Step 2 - Create the templates folder](#step-2---create-the-configmap)
* [Step 3 - Create the configmap](#step-3---create-the-configmap)

## Objective

* Understand the concept of ConfigMaps
* Update our HELM chart to include configuration for the PLC

## Step 1 - Config as ConfigMap
In Kubernetes having the ability to mount text-based configuration into a pod is a key method in firstly maintaining configuration and secondly having the ability to change configuration for several pods simultaneously.

For the Codesys PLC we deployed in [a previous step](../1.3-adding-deployment-template/), it has several config files located within the pod's "/conf/codesyscontrol/" directory.

Let's view that config by accessing the pod's terminal. Head over to the Openshift console, find the link in your student start page, and navigate to the Workloads->Deployments section. If you see an access denied error, remember to change the Project at the top to your team's namespace. 
![Openshift Pod view](../images/ocp-deployment-view.png)

Switch to the Pods tab and click on the name of the PLC deployment.


In order to get data into the pod, let's first create the configuration file in our gitea repo and allow ArgoCD to keep it in sync with out primary source of truth.

We will not be too concerned with the contents of this file for the scope of this exercise, so do not worry about changing values within the actual file for now.


## Step 2 - Create the configmap
Within the templates folder in your gitea repo, let us create a file named configmap.yaml
The contents for this file will look as follows:

```yaml
{% raw %}
{{- range .Values.plcs }}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .name }}-user-config
  labels:
    app.kubernetes.io/part-of: {{ .partOf }}
data: 
  user-config: |
      ;virtuallinux
      [CmpLog]
      Logger.0.Filter=0x0000000F

      [ComponentManager]
      Component.1=CmpBACnet
      Component.2=CmpBACnet2
      Component.3=CmpPLCHandler
      Component.4=CmpGwClient
      Component.5=CmpXMLParser
      Component.6=CmpGwClientCommDrvTcp
      ;Component.7=CmpGwClientCommDrvShm ; enable only if necessary, can result in higher cpu load
      ;Component.8=SysPci				; enable when using Hilscher CIFX
      ;Component.9=CmpHilscherCIFX	; enable when using Hilscher CIFX

      [CmpApp]
      Bootproject.RetainMismatch.Init=1
      ;RetainType.Applications=InSRAM
      Application.1={{ .appName }}

      [CmpRedundancyConnectionIP]

      [CmpRedundancy]

      [CmpSrv]

      [IoDrvEtherCAT]

      [SysTarget]
      SerialNumber=RTS-{{ .serialNo }}

      [CmpSecureChannel]
      SECURITY.CommunicationMode=ONLY_PLAIN

      [CmpUserMgr]
      AsymmetricAuthKey=0a41d6cf5363d976dce29a300697919b8ece69bd
      SECUTITY.UserMgmtEnforce=NO
      SECURITY.UserMgmtAllowAnonymous=YES

      [CmpSecureChannel]
      CertificateHash=3c0f5865dd0f0fa209668e8f68c2d1341f37a805

{{- end }}
{% endraw %}
```

The secion under "user-config:" will be mounted within our codesys runtime pod as a file located at "/conf/codesyscontrol/CODESYSControl_User.cfg"

The key values in here are the SECURITY configurations for the OPC-UA server, as well as the Application.1 line, which specifies the PLC's boot application - the one that will be loaded on startup.

In our application's case, it's very creatively called "Application" and matches the name of the application we copied to the PLC's storage in the [previous step](../2.1-deploying-plc-application/)

Update the deployment.yaml to utilize the config in a similar way to how we have done the Application files.
The Codesys container requires readwrite access to the config directory, so we'll use the initContainer to copy the config over into the right directory, and have that mounted as persisted storage.
Note how the configmap is mounted as a volume.

```yaml
{% raw %}
  initContainers:
      - name: init-plc-application
        image: 'ubi9/ubi-minimal'
        command:
          - sh
          - '-c'
          - mkdir -p cd /data/codesyscontrol/PlcLogic/Application && curl -O {{ .appUrl }}/Application.app && curl -O {{ .appUrl }}/Application.crc && cp -f /temp/conf/CODESYSControl_User.cfg /conf/codesyscontrol/ && 
        resources: {}
        volumeMounts:
          - name: data-storage
            mountPath: /data/codesyscontrol
          - name: codesys-user-config
            mountPath: /temp/conf/
          - name: config
            mountPath: /conf/codesyscontrol
...
  volumes:
    - name: codesys-user-config
      configMap:
        name: {{ .name }}-user-config
        items:
          - key: user-config
            path: CODESYSControl_User.cfg

{% endraw %}
```

Esure you save and commit the file, or push it to the repo if working within another editor.


---
**Navigation**

[Previous Exercise](../2.1-deploying-plc-application/) | [Next Exercise](../3.1-accessing-data-from-plc/)

[Click here to return to the Workshop Homepage](../../README.md)

