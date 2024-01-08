# Red Hat Device Edge GitOps demo

In this technical demo, we showcase the power of Ansible Automation Platform and Event-Driven Automation in orchestrating and managing the Red Hat Device Edge ecosystem (RHEL and Microshift). Embracing the GitOps methodology, our demonstration highlights how organizations can efficiently manage both the platform and applications by treating infrastructure as code and leveraging version-controlled repositories. 

GitOps principles enable a seamless and auditable approach to infrastructure and application management, offering numerous benefits. By centralizing configuration in Git repositories, organizations gain versioning, change tracking, and collaboration advantages. The demo illustrates how Ansible, a powerful automation tool, combined with GitOps practices, ensures consistency, traceability, and repeatability in the deployment and configuration of Red Hat Device Edge components.


## Table of Contents


- [Red Hat Device Edge GitOps demo](#red-hat-device-edge-gitops-demo)
  - [Table of Contents](#table-of-contents)
  - [Demo duration](#demo-duration)
  - [Lab Architecture](#lab-architecture)
  - [Required connectivity](#required-connectivity)
  - [Recommended Hardware](#recommended-hardware)
  - [Pre-recorded video](#pre-recorded-video)
  - [Preparation - Deployment and Pre-Flight Checks](#preparation---deployment-and-pre-flight-checks)
  - [Summary and demo step guide](#summary-and-demo-step-guide)
  - [Introduction](#introduction)
  - [Section 1 - Creating RHEL Images the GitOps way](#section-1---creating-rhel-images-the-gitops-way)
  - [Section 2 - Automated device onboarding](#section-2---automated-device-onboarding)
  - [Section 3 - Consistent edge device configuration at scale](#section-3---consistent-edge-device-configuration-at-scale)
  - [Section 4 - Edge computing APPs lifecycle management](#section-4---edge-computing-apps-lifecycle-management)
  - [Section 5 - Bulletproof system upgrades](#section-5---bulletproof-system-upgrades)
  - [Closing](#closing)


## Demo duration

The demo can take between 90 and 120 minutes (closer to 120 min.) with no breaks. If you have time, a break after each main section is recommended. 


## Lab Architecture

This lab has two different setups:

1. In the "local" lab architecture you will deploy a Server with all services (AAP, Gitea, Image-builder, Network services, ...) and the Edge device locally, either in your laptop/virtualization server or in your local physical environment (when using physical servers)
2. In the "external" lab architecture option you will deploy a Server running the main services (AAP, Gitea, Image-builder) on AWS (no other cloud providers have been configured on the Ansible playbooks that deploy this lab) and additionally, you will also deploy a local server (Ansible execution node and local Network services) and the Edge Device locally (again, either in VMs or physical servers).

This is the diagram for the "local" lab architecture:

![Lab Diagram Local](../images/rhde_gitops_lab_diagram_local.png)


In the following diagram you can see the "external" lab architecture:

![Lab Diagram Remote](../images/rhde_gitops_lab_diagram_remote.png)



## Required connectivity
Internet Connection with access to Red Hat sites, GitHub, Slack and Quay.io.

The external lab architecture has been designed so you can deploy it where you don't have access to the network to re-configure NAT entries. This is done (for demo pruposes, do not use at production please) using a reverse SSH tunnel between the local and the remote server, so be sure that outgoing SSH connections are allowed in the Venue firewall if using this setup.



## Recommended Hardware
If you plan to use VMs you just need enough free resources in your laptop/server (>6vCPUs, >14GB RAM, >50GB disk)

If you use physical hardware you probably will need:
+ Two (mini)servers, one of them with (4vCPUs, 16GB RAM, 50GB+ disk and two network interfaces)
+ USB Keyboard (I use one of [this USB RFID mini keyboards](https://www.amazon.es/dp/B07RQBRRR7?psc=1&ref=ppx_yo2ov_dt_b_product_details), but be sure that it does not use just Bluetooth)
+ Video Cable (and HDMI - DisplayPort adapter if needed) and external Monitor to show boot console. If you don't want to use an external screen you can also use a [Video Capture card like this one](https://www.amazon.es/dp/B0CLNHT29F?ref=ppx_yo2ov_dt_b_product_details&th=1) that I use that can show the physical device video output as a video input (camera) in your laptop.
+ Access Point or Router if you don't have a cabled connection to Internet
+ Network Switch if you Access Point / Router does not have at least 2 free interfaces
+ At least 3 RJ45 cables
+ Depending on your laptop you will need aditional adapters (ie. to provide RJ45 interface). Also in certain venues where use HDMI over RJ45 sometimes you could find that your Linux machine does not mirror the screen correctly when using direct HDMI cable, but it works if you connect it to an HDMI port in a USB C adapter (???), so I finally got [this adapter that has both RJ45 and HDMI output](https://www.amazon.es/dp/B0CBVDRPZD?ref=ppx_yo2ov_dt_b_product_details&th=1).
 



## Pre-recorded video

You can [take a look at this video](https://youtu.be/XCtfy7AqLLY) where you can see the flow of the demo. In that case, the lab local architecture was used.

  >**Note**
  >
  > The demo steps below have some differences with the video due to the addition of Microshift. First the order of the sections `Consistent edge device configuration at scale` and `Edge computing APPs lifecycle management` are swapped in order to give more time to Microshift to start. Second, in the section `Edge computing APPs lifecycle management` additional steps relative to Microshift were introduced.


## Preparation - Deployment and Pre-Flight Checks

You can find the steps to deploy the lab here:

* [Lab deployment](0.1-deployment)



## Summary and demo step guide

This is the summarized list of the steps (below you will find the detailed description in each section):

0. Introduction
    1. De

1. Section 1 - Creating RHEL Images the GitOps way
    1. De

2. Section 2 - Automated device onboarding
    1. Bo

3. Section 3 - Consistent edge device configuration at scale
    1. Bo

4. Section 4 - Edge computing APPs lifecycle management
    1. Bo

5. Section 5 - Bulletproof system upgrades
    1. Bo

6. Closing
    1. Bo



## Introduction
TBD


## Section 1 - Creating RHEL Images the GitOps way
TBD

## Section 2 - Automated device onboarding
TBD

## Section 3 - Consistent edge device configuration at scale
TBD

## Section 4 - Edge computing APPs lifecycle management
This section is divided in two. In the first part, we will manage applications that are deployed with just Podman/Systemd (no Kubernetes at all) and during the second one we will introduce Kubernetes workloads by using `Microshift`.

In this section, we will be accessing the Apps deployed on the edge device from our laptop. This device is connected to the "internal network" which is isolated (take a look again to the lab diagram) so by default that won't be possible. We have two solutions here, we can connect our laptop to the isolated environment or we can use the SOCKS server that is pre-installed in the local server on port `1080`.

By configuring the edge local server as SOCKS server in our Web Browser we will be using that server as "jump host" and we will get access to the edge device without having to move our laptop to the isolated network. I use to use two Browsers, the main (Chrome) where I show AAP, Gitea and others; and the secondary (Firefox) where I configure the SOCKS server and where I show the APPs deployed in the edge device. This is an example configuration for Firefox (192.168.140.202 is the external IP of the local edge server in this case):


![Firefox SOCKS](../images/rhde_gitops_firefox_socks.png)

  >**Note**
  >
  > Remember to run the [Pre-flight checks](0.1-deployment/README.md#pre-flight-checks) which involves the SOCKS server testing before running the demo/workshop.



### APPs with Podman and Systemd
In this section we will explore how just using Podman and Systemd we can obtain advanced capabilities without using Kubernetes.

In this first part, we have two test applications already deployed, both as rootless containers, thanks to the `kickstart` file that we prepared during Section 1: One of them is a simple HTTP server, and the other is a web browser game.


### Serverless APP with Podman and Systemd


The "simple HTTP server" is deployed as a Serverless container at the port `8080`, which means that if you take a look at the running containers in the edge device you will only see the web browser game at port `8081` in the edge device:

1. Run `podman ps` in the edge device as the non-root user (probably `ansible` if you didn't change in the lab deployment playbooks)

```bash
[ansible@edge-848bcd4d1537 ~]$ podman ps
CONTAINER ID  IMAGE                            COMMAND     CREATED         STATUS         PORTS                          NAMES
ef90da4894db  quay.io/luisarizmendi/2048:prod              35 minutes ago  Up 35 minutes  <edge device ip>:8081->8081/tcp  app1
```

The Serverless container will be created as soon as a request comes to the port `8080`.  Bear in mind that to prevent starting pulling the container image on the first request, there is a Systemd unit pre-configured in the server that pre-pulls that image, so when you query the Serverless service you get the answer instantaneously, without having to wait to get the Container image ready on the server.

  >**Note**
  >
  > It's a good idea to run `podman image list` as the non-root user to double check that the image (`quay.io/<your registry>/simple-http`) is there and, if not, pull it manually before continuing with the steps below.


At this point, we can query the Serverless service (on port 8080) and we'll see how the new container is launched:

1. Run `watch podman ps` in the edge device as the non-root user. Keep this terminal visible to show how the new container is created automatically.

```bash
watch podman ps
```
2. Open the browser (where the SOCKS proxy is configured) in your laptop and query the Serverless application at `http://<edge device IP>:8080`. You will get a `v1 is working! ` message.

3. Show what happened in the terminal where `watch podman ps` was running. The new container should be created now

```bash
[ansible@edge-848bcd4d1537 ~]$ podman ps
CONTAINER ID  IMAGE                                   COMMAND               CREATED         STATUS         PORTS                          NAMES
ef90da4894db  quay.io/luisarizmendi/2048:prod                               36 minutes ago  Up 36 minutes  <edge device ip>:8081->8081/tcp  app1
823e10fa4a3c  quay.io/luisarizmendi/simple-http:prod  /usr/sbin/nginx -...  35 seconds ago  Up 35 seconds  127.0.0.1:8080->8080/tcp       httpd
```

4. (optional) You could wait 90 seconds and show how the Container is stopped automatically if no new request are made to the service



### Podman container image auto-update

If you create a new version of the container image and push it to the registry, two options exist in order automate the upgrade. You can configure a webhook in the container image registry to start a workflow in Ansible Controller, as we've seen when reviewing the OS configuration, or, as a second option, you can use a Podman feature called `podman auto-update` to check the registry for updates and apply them automatically. In our case we will use the second option.

But beyond just deploying new versions when they are available, we will show how podman auto-update can check if the new version is "ok". If the health-checks are not passed while booting the new version, it will automatically rollback to the previous one. We will demonstrate this by introducing an error in the second version of the image and then fixing it in the third version.

This time we will be using the game app deployed on port `8081` in the edge device, where the Podman auto-update has been configured. Let's see a possible image upgrade workflow:

1. Open the Web Browser where the SOCKS proxy is configured and open the port `8081` on the edge device ip: `http:<edge device ip>:8081`. You will see a 2048 Web Browser game.

  >**Note**
  >
  > Remember to run the [Pre-flight checks](0.1-deployment/README.md#pre-flight-checks) before demo to be sure that the 2048 container image tags are correctly set in `quay.io`.

2. Show a problem with the APP: an embed image is not loading:

![2048 Image error](../images/rhde_gitops_2048-image-error.png)



3. Now the developer should fix the problem on the app and then `push` the new container image version into the registry. Open `Quay.io` and explain by showing the tags on the 2048 repository that in order to save time what we did is pre-push the new container image in the registry, and we can change from one version to another by just changing where the `prod` tag is pointing to.

![2048 tags](../images/rhde_gitops_quay-2048.png)


4. The `v2` image is the one that the developer created to fix the image problem... but he introduced an additional (big) issue while creating the Containerfile that will make the image not able to boot. He mistyped `nginx` in the Containerfile. You can show this by clicking in quay.io in the "Manifest" while in the "tag" page of the repository (it will show something like "SHA256 1b5e115a1717"):

![2048 v2 nginx](../images/rhde_gitops_2048-v2.png)


  >**Note**
  >
  > Even though we know that this image won't boot, we will update the `prod` tag to point to `v2` so we will see two things, first that `podman auto-update` will detect that a new version of the container image is availabe, and second how the self-healing capability of `podman auto-update` rollback to version `v1` because `v2` is not able to boot.


5. Run the `watch 'podman auto-update --dry-run; echo ""; podman ps'` command on the edge device as the non-root user. 

```bash
watch 'podman auto-update --dry-run; echo ""; podman ps'
```
This will show the status of Podman auto-update (if it detects a new version) and the running containers. Keep this terminal visible during the next step.

```bash
Every 2.0s: podman auto-update --dry-run; echo ""; podman ps                                                                       edge-848bcd4d1537: Mon Jan  8 14:58:56 2024

            UNIT                    CONTAINER            IMAGE                            POLICY      UPDATED
            container-app1.service  1ec5693e0e3d (app1)  quay.io/luisarizmendi/2048:prod  registry    false

CONTAINER ID  IMAGE                            COMMAND     CREATED         STATUS         PORTS                          NAMES
1ec5693e0e3d  quay.io/luisarizmendi/2048:prod              34 minutes ago  Up 34 minutes  <edge device ip>:8081->8081/tcp  app1
```


6. Go to the tag page on the 2048 repository in `Quay.io` and click "Add New Tag" on the gearwheel (at the right) for the `v2`image. Create a new tag `prod` (it will say "Move" instead of "Create" because the tag `prod` already exists).


7. Show how the new image is detected ( "UPDATED" changed to `pending`) in CLI Terminal. Then show how the new container is created (check the "CREATED" time that will move to 1 seconds when the image is deployed). Finally show how Podman re-generates a new container version (which in fast is `v1`) as rollback by going again to the APP in `http:<edge device IP>:8081`. You will be able to reach out to the APP because of the rollback (otherwise no APP will be running during the intentionally added issue in the Containerfile of `v2`).

8. Finally go to `quay.io` and move tag `prod` to `v3` where both the image and the Containerfile issues have been solved. You will see how Podman auto-update is able to deploy the new version and if you access the AAP you will see how the image is now loaded. 

  >**Note**
  >
  > If the image does not appear, be sure that you are not caching the page by opening the page in Private/Incognito mode.




### Deploying an APP in Podman in a declarative way

Those APPs were deployed by default as part of the onboarding, but what happens if I need to deploy a specific APP in a specific device? and what If you want to do it in a declarative way? The answer is [Quadlet](https://www.redhat.com/sysadmin/quadlet-podman).

You can create new containerized applications by just putting a descriptor in` /usr/share/containers/systemd/` or `/etc/containers/systemd` (`HOME/.config/containers/systemd/` for rootless containers). During this step we will demo how we can use AAP and EDA to create this kind of APPs in a GitOps way.

There is Job already created to deploy (root) container images based on a file descriptor located in GIT.


1. Open Gitea and show the `device-edge-configs/APPs/podman/quadlet` folder. There will be the descriptors that will be created on the edge devices. You have one preloaded: `app_fuxa_scada.container`. Open that file and show the config (mainly the image and port).

  >**Note**
  >
  > That application needs quite large container images. If you are running the demo/workshop in an environment with low bandwidth you might use any other container image that you know would work better.


2. Here you have two options. First you can go into the AAP and run the Template "Create Quadlet APP" or you can change something (for example, change the port) on the descriptor on Gitea and see how EDA gets the Job launched for you. If you choose the second option remember to open first the "Jobs" page in the AAP so people can see how the Job is auto-launched. 

  >**Note**
  >
  > You can also open a Terminal in the edge device and run `watch podman ps` command as root and keep that CLI visible to check how the new Containers created right after running the AAP Template or changing the file in Gitea.

3. Go to the edge device Terminal and as the root user (this time we deployed a root container in contrast with all the rest of containers that were rootless) check the running containers:

```bash
[root@edge-848bcd4d1537 ~]# podman ps
CONTAINER ID  IMAGE                             COMMAND     CREATED         STATUS         PORTS                   NAMES
a164ed35c012  docker.io/frangoteam/fuxa:latest  npm start   17 seconds ago  Up 17 seconds  0.0.0.0:1882->1882/tcp  systemd-app_fuxa_scada
```

4. Show the APP by visiting http:<edge device IP>:<configured port>



### APPs with Microshift

Before starting this section is a good idea to double-check that Microshift is running by reviewing if all pods are in "running state". As root user in the edge device run:

```bash
[root@edge-848bcd4d1537 ~]# oc --kubeconfig /var/lib/microshift/resources/kubeadmin/kubeconfig get pod --all-namespaces
NAMESPACE                  NAME                                       READY   STATUS    RESTARTS       AGE
kube-system                csi-snapshot-controller-85cc4fd76b-v2hp8   1/1     Running   0              168m
kube-system                csi-snapshot-webhook-869fcd59f8-ljrs8      1/1     Running   0              168m
openshift-dns              dns-default-5wk47                          2/2     Running   0              164m
openshift-dns              node-resolver-s87rt                        1/1     Running   0              168m
openshift-ingress          router-default-7bf6cc7bbd-rnfx8            1/1     Running   0              168m
openshift-ovn-kubernetes   ovnkube-master-vpgbf                       4/4     Running   1 (164m ago)   168m
openshift-ovn-kubernetes   ovnkube-node-czhfw                         1/1     Running   2 (164m ago)   168m
openshift-service-ca       service-ca-585c8dc78-bzbmd                 1/1     Running   0              168m
openshift-storage          topolvm-controller-6457fbcd6c-ld9sz        5/5     Running   0              168m
openshift-storage          topolvm-node-62sbm                         4/4     Running   0              164m
test                       test-hello-f9974746-52fjv                  1/1     Running   0              168m
```

  >**Note**
  >
  > Microshift, which is a Kubernetes node, will rely on a wildcard domain name to publish the APPs. Since the edge device IP is not fixed by the playbooks we don't setup any DNS entry on the edge local server. The easiest way to obtain a wildcard for this demo is by using the [nio.ip](http://nio.io) service which resolves to the IP that you use as a prefix on the domain name (so `http://1.1.1.1.nip.io` will resolve to `1.1.1.1`). As you can see there is already a deployed test app that you can check on `http://test.apps.<edge device ip>.nip.io` on the Web Browser with the SOCKS proxy configured..


### Deploy an APP on Microsift from Manifest files on Gitea

1. Go to `device-edge-configs/APPs/microshift/manifest` in Gitea. There you will find example manifest files that you can use to deploy the 2048 Web Browser application on top Microshift. Show the files.

2. Go to the edge device and as root user run `watch "oc --kubeconfig /var/lib/microshift/resources/kubeadmin/kubeconfig get pod --all-namespace"`. Keep the terminal visible to show how new PODs are created while proceeding with the steps below.

3. Again two options: Launch manually the Template "Microshift APP Deploy - Manifest" or change something on those Manifest files (ie. adding `demo: gitops` label on the deployment.yaml) to use EDA (again, if you choose this option let visible the AAP "Jobs" list while pushing your change in Gitea). 

4. Once you see the new POD "Running" (namespace `game2048`) on the edge device CLI Terminal running `watch` you can show the application using the Web Browser with the SOCKS proxy configured at `http://frontend-game2048.apps.<edge device ip>.nip.io`


In the manifest `deployment.yaml` file you can see how we are using the 2048 app `v1`, the one with the problem (image not loading). You can take advantage of that and show how to perform a day-2 action: update the image version, but just changing it on the manifest on Gitea.

1. Be sure that you have AAP "Jobs" and the edge device CLI Terminal running `watch` visible.

2. Open the `device-edge-configs/APPs/microshift/manifest/2-deployment.yml` in Gitea and change the image tag from `v1` to `v3` (remember that `v2` does not work).

3. Wait until the new POD is running (you can see it on the CLI running `watch`)

4. Clear the cache of the Web Browser where SOCKS proxy is configured (or use Private/Incognito mode) and open again the 2048 game app. This time the image will be loaded since we are using the new version.


### Deploy an APP on Microsift with external Helm repo and vars file on Gitea 

Now we are going to deploy an APP on Microshift by using Helm from AAP and by gathering the vars from a file hosted in Gitea.

1. Be sure that you have AAP "Jobs" and the edge device CLI Terminal running `watch` visible.

2. Open `device-edge-configs/APPs/microshift/helm/wordpress_vars.yml` where you will find the definition of the variables for a Helm Chart that deploys `Wordpress`.

3. Either change something in that file (ie. the `wordpressBlogName`) or launch manually the AAP Template "Microshift APP Deploy - Helm" to get installed the APP on the edge device

  >**Note**
  >
  > The Helm Chart repo (`https://raw.githubusercontent.com/luisarizmendi/helm-chart-repo/main/packages`) and Chart (the one that deploys `Wordpress`) are defined on the variables associated to the AAP Template. This is just an example for the demo, in production there might be better ways to do it, more if you use many different Helm Charts.

4. Wait until the PODs are running and show the APP on the Web Browser with the SOCKS proxy configured at `http://wordpress-wordpress.apps.<edge device ip>.nip.io`

Now you can show how to modify the APP by just changing the values on the Gitea.

1. Be sure that you have AAP "Jobs" and the edge device CLI Terminal running `watch` visible.

2. Open `device-edge-configs/APPs/microshift/helm/wordpress_vars.yml` and change the `replicaCount` number

3. Wait and see how that number of replicas is deployed on Microshift.

  >**Note**
  >
  > That will be the replicaCount of just the Wordpress frontend, the mysql database will keep one single replica.

## Section 5 - Bulletproof system upgrades
TBD

## Closing
TBD





