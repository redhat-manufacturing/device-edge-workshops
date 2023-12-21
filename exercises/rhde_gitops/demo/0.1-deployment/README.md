# Preparation - Lab deployment

## Table of Contents

* [Prepare your AWS environment](#prepare-your-aws-environment)
* [Get your ZeroSSL free Account](#get-your-zerossl-free-account)
* [Get your Red Hat Customer Portal Offline Token](#get-your-red-hat-customer-portal-offline-token)
* [Get your Pull Secret](#get-your-pull-secret)
* [Get your Slack Token](#get-your-slack-token)
* [Get your Ansible Controller Manifest](#get-your-ansible-controller-manifest)
* [Copy the container images to your Quay account](#copy-the-container-images-to-your-quay-account)
* [Prepare your laptop and lab servers](#prepare-your-laptop-and-lab-servers)
* [Clone this repo and prepare files](#clone-this-repo-and-prepare-files)
* [Deploy the lab](#deploy-the-lab)
* [If something goes wrong during the deployment...](#if-something-goes-wrong-during-the-deployment)
* [Pre-flight checks](#pre-flight-checks)
* [BONUS - If not enough time for your demo...](#bonus---if-not-enough-time-for-your-demo)





## Prepare your AWS environment

The lab environment needs a valid domain name. As the playbooks are prepared to use AWS, the easier way is to use the AWS Route53 service.

If you are a Red Hatter you can order an [AWS Blank Open Environment in the Red Hat Demo Platform](https://demo.redhat.com/catalog?search=aws+open+blank+environment&item=babylon-catalog-prod%2Fsandboxes-gpte.sandbox-open.prod) than can be used just for the Route53 service (local lab architecture) or for both Route53 and EC2 to run the Management node (AAP + EDA + Image-builder + Gitea) in case of the remote lab architecture.
 

  >**Note**
  >
  >   Remember to include the right purpose and SFID or customer name just in case you need to contact the RHDP team to be sure that your environment won't be deleted or removed before your demo.


Once you have your environment, take note of:
* Route53 domain
* AWS_ACCESS_KEY_ID
* AWS_SECRET_ACCESS_KEY


## Get your ZeroSSL free Account

The Ansible playbooks will create Certificates to be used by the HTTPS services, so you need to issue valid SSL certs. An easy way to do it is by using ZeroSSL.

This is totally free to set up and allows wildcard certificates to be issued. Once registered, create an API key on the [developer page](https://app.zerossl.com/developer).


You need an "EAB Credential for ACME Clients", so generate one from that [developer page](https://app.zerossl.com/developer). It will be something like this:

```
EAB KID
XXXXXXXXXXXXXXXXXXX_XX

EAB HMAC Key
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX_XXXXXXXXXXXXXXXXXXXX
```

Take note of both the KID and Key.


## Get your Red Hat Customer Portal Offline Token

This token is used to authenticate to the customer portal and download software. It can be generated [here].

  >**Note**
  >
  >  Remember that the Offline tokens will expire after 30 days of inactivity.


Take note of the token.




## Get your Pull Secret

[Get your pull secret from the Red Hat Console](https://cloud.redhat.com/openshift/install/pull-secret)



## Get your Slack Token

The demo will send notifications to a Slack Channel, so you will need to generate a Token. You can [follow these steps](https://github.com/kasunkv/slack-notification/blob/master/generate-slack-token.md):

1. Goto https://api.slack.com/apps and click on the "Create New App" button to create a new slack application.

2. In the next popup add a new App Name and select the Slack Workspace and click on the Create App button

3. Once the application is created in the Add features and functionality section click on the Permissions button to set the token scopes. Enable the `chat:write` permission

3. Next step is to install the application in the desired workspace and allow access to the requested scopes. Click on the Install App to Workspace button

4. Then you get the OAuth Access Token.

You will end up with a token like this one:

```
xoxp-XXXXXXXXXXXXX-XXXXXXXXXXXXX-XXXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```



## Get your Ansible Controller Manifest

In order to use Automation controller you need to have a valid subscription via a `manifest.zip` file.  To retrieve your manifest.zip file you need to download it from access.redhat.com.  

- Here is a video by Colin McNaughton to help you retrieve your manifest.zip:
 [https://youtu.be/FYtilnsk7sM](https://youtu.be/FYtilnsk7sM).
- If you need to get a temporary license, get a trial here [http://red.ht/try_ansible](http://red.ht/try_ansible).
- Follow the following KCS on how to generate the manifest file https://access.redhat.com/solutions/5586461


Save apart your `manifest.zip` file.






## Copy the container images to your Quay account

During the demo you will need to push or move tags in certain container images (take a look at [minute 25:25 in the video](https://www.youtube.com/watch?v=XCtfy7AqLLY&t=25m25s)), so you will need to have access to a container image repository. Probably you want to use Quay.io so first, check that you can login:

```
podman login -u <your-quay-user> quay.io
```

Once you have access to the registry, copy the container images that we will be using (those are public in my Quay.io user `luisarizmendi`). You can pull them to your laptop and then push it to your registry, or you can just use `skopeo`:

```
skopeo copy docker://quay.io/luisarizmendi/2048:v1 docker://quay.io/<your-quay-user>/2048:v1
skopeo copy docker://quay.io/luisarizmendi/2048:v2 docker://quay.io/<your-quay-user>/2048:v2
skopeo copy docker://quay.io/luisarizmendi/2048:v3 docker://quay.io/<your-quay-user>/2048:v3
skopeo copy docker://quay.io/luisarizmendi/2048:prod docker://quay.io/<your-quay-user>/2048:prod
skopeo copy docker://quay.io/luisarizmendi/simple-http:v1 docker://quay.io/<your-quay-user>/simple-http:v1
skopeo copy docker://quay.io/luisarizmendi/simple-http:v2 docker://quay.io/<your-quay-user>/simple-http:v2
skopeo copy docker://quay.io/luisarizmendi/simple-http:prod docker://quay.io/<your-quay-user>/simple-http:prod
```

Remember to change visibility of both 2048 and simple-http images to "public" in each "Repository Settings" 


## Prepare your laptop and lab servers

Your laptop will need to run Ansible Playbooks. This can be ansible in a venv, or ansible-navigator, either will work but using ansible-navigator is recommended since it's already integrated with execution environments, which makes easier to fulfill all the required dependencies since those will be pre-provisioned in the container image (where you will be running the playbook) instead on your own laptop OS.

If you don't have it already on your machine you can [follow these steps to install ansible-navigator](https://ansible.readthedocs.io/projects/navigator/installation/).


You will also need `git` to clone the repo in the next step and, if using VMs, a virtualization hypervisor (`libvirt` and  Virtual Machine Manager are recommended).


You will also need to configure a SOCKS proxy to reach out to the internal services published in the edge device. What I usually do is to configure it in a separate Web Browser. The settings are:


```
SOCKS Host: <external IP of the local server or the one located in AWS>
Port: 1080
proto: SOCKS_v5
```

Besides your laptop, you will also need a server (or two if you decide to deploy the external architecture lab) where the services will be installed and an additional machine that will act as the edge device. 

You can use either VMs or physical hardware, also bear in mind that depending on if you plan to use the local or the external architecture you will need different minimum requirements in your local servers, since in the remote lab topology all the "heavy" services will be run in AWS.


### Using Virtual Machines

Let's start with the server VM.

That VM must have two NICs, one that can be attached to the default NAT virtual network and an additional that could be attached to a new "isolated" virtual network (with no DHCP enabled) that you have to create in advance.

The minimum resources for that VM will depend on the chosen lab architecture. 

If you plan to use the lab local architecture, the VM should have 4 cores/16GB RAM/ 50GB+ disk ( I was able to deploy it with just 10GB of RAM.. and even with just 8GB, but sometimes in that case the deployment failed due to timeouts... although you can always try to re-run the deployment to overcome that problem...)

If you choose the lab external architecture, this VM will only host the Ansible Execution Node and some network services (DHCP, PXE, ...) so you could go with 2 cores / 4GB RAM / 50GB+ Disk.

Once you have the server VM created, you have to to deploy RHEL 9 on it (lab tested with RHEL 9.2), "minimal install" is enough.

In addition to the server, you will need enough resources (2 cores, 2 GB RAM, 10GB disk) to create an additional VM that will act as edge device. That edge device VM will be attached with a single NIC to the isolated (with no DHCP) virtual network that you have created and where the previous server is attached to.

You don't need to create the VM before the lab, you just need to have enough resources to create it during the lab steps (you can take a look at [minute 11:57 of the recorded demo video](https://www.youtube.com/watch?v=XCtfy7AqLLY&t=11m57s) to check how it will be created with `libvirt` and Virtual Machine Manager. 


### Using Physical servers

Two machines: the server and the edge device.

Well... you can read the previous point about using VMs and translate that to the physical world (bear in  mind the comment about minimum resources depending on the type of lab architecture used).

The server must have at least two NICs, one connected to the Access Point / Router and the other one to the edge device.

You need to install RHEL 9 on that first server (lab tested with RHEL 9.2), "minimal install" is enough.

The edge device BIOS needs to be configured to perform boot from network as first option (or you can use `efibootmgr --bootnext XXX` if you have a Linux OS pre-installed)

You will also need to connect the video output to a screen (or use a [Video Capture card](https://m.media-amazon.com/images/I/71hI+11pk-L._AC_SL1500_.jpg) attached to your laptop) because you will need to show the boot console during the steps.


## Clone this repo and prepare files

Clone the main branch of this repo:

```
git clone https://github.com/redhat-manufacturing/device-edge-workshops
```

Now you have to perform some actions on the cloned repo:

1) Include the AAP Manifest

You have three options to use the Manifest during the deployment.

a. You can put the Manifest file into the `provisioner` folder of the cloned repo (with the exact name `manifest.zip`), so: `<your-git-clone-path>/provisioner/manifest.zip`

b. Turn the `manifest.zip` into a base64 variable and include it in the `extra-vars.yml` file (see next point):

```
base64 manifest.zip > base64_platform_manifest.txt
```

  >**Note**
  >
  >  On macs, specify the `-i` flag: `base64 -i manifest.zip`


c. Download the manifest.zip from a URL by specifying the following variables in the  `extra-vars.yml` file (see next point)

  ```
  manifest_download_url: https://www.example.com/protected/manifest.zip
  manifest_download_user: username
  manifest_download_password: password
  ```


2) Create the `extra-vars.yml` file

Copy the example extra-vars file from `<your-git-clone-path>/provisioner/example-extra-vars/rhde-gitops.yml` to the root of the project with the name extra-vars.yml (`<your-git-clone-path>/extra-vars.yml`)

Fill in all the `XXXXX` with the right values, more specifically:
* Domain name in `base_zone`
* Slack token in `slack_app_token`
* Pull Secret in `pull_secret`
* Red Hat subscription user and password in `redhat_username` and `redhat_password`
* ZeroSSL KID and Key in `zerossl_account.kid` and `zerossl_account.key`
* Red Hat offline token in `offline_token`
* Quay account in `apps.app1.registry` and `apps.app2.registry`

You can also change these values:

* Number of AAP,Gitea,... accounts in `student_total` (it could be useful to have more than one to run a dry-run before the demo)
* The AWS region to be used in `ec2_region`
* SSH public key to be injected in the server in `builder_pub_key`
* The AAP Manifest as base64 (if you chosed this option) in `base64_manifest`

You also need to configure an important parameter here, that will deploy either the local or external architecture. If you want to run the local architecture you should configure `run_in_aws: false` and if you want in contrast to deploy the lab external architecture this variable should be `run_in_aws: true` 


3) Copy the right `workshop_vars` file

Besides the variables in `extra-vars.yml` the deployment will use morevariables that can be found in `<your-git-clone-path>/provisioner/workshop_vars/rhde-gitops.yml`. Those variables are slightly different depending if you are deploying the local architecture or the external architecture.

To make it easier, two different workshop_var files have been created, you just need to copy the right one into the `rhde-gitops.yml` file, so if you want to run the local architecture:

```
cp <your-git-clone-path>/provisioner/workshop_vars/rhde-gitops-local.yml <your-git-clone-path>/provisioner/workshop_vars/rhde-gitops.yml
```

and if you choose the external architecture:

```
cp <your-git-clone-path>/provisioner/workshop_vars/rhde-gitops-external.yml <your-git-clone-path>/provisioner/workshop_vars/rhde-gitops.yml
```

You don't have to customize any value in that file, except if you ahve any conflict while using physical servers with the internal (isolated) IP range used (by default the 192.168.40.0/24 ). 


4) Create the local inventory file

You have to create an inventory file in `<your-git-clone-path>/local-inventory.yml` with the following contents.

If you are using the local architecture:

```
all:
  children:
    local:
      children:
        edge_management:
          hosts:
            edge-manager-local:
  vars:
    ansible_host: XXX.XXX.XXX.XXX
    ansible_user: XXXXXX 
    ansible_password: XXXXXXXX
    ansible_become_password: XXXXXXXX

    external_connection: XXXXXX # Connection name for the external connection
    internal_connection: XXXXXXX # Interface for the internal lab network
```

If you are using the external architecture (where `edge_management` has been changed by `edge_local_management` ):

```
all:
  children:
    local:
      children:
        edge_local_management:
          hosts:
            edge-manager-local:
  vars:
    ansible_host: XXX.XXX.XXX.XXX
    ansible_user: XXXXXX 
    ansible_password: XXXXXXXX
    ansible_become_password: XXXXXXXX

    external_connection: XXXXXX # Connection name for the external connection
    internal_connection: XXXXXXX # Interface for the internal lab network
```

  >**Note**
  >
  >  Even thought in the external architecture you will have the local "server" and the one running in AWS, you will only need to include the local one, since the inventory for the remote server will be created dynamically once the deployment playbooks create the VM in EC2. 




## Deploy the lab

In order to deploy you just need to:

1. Open a bash CLI in `<your-git-clone-path>`

2. Export the AWS credentials (I use to include them in `extra-vars.yml` file as reference as well)

```
export AWS_ACCESS_KEY_ID=XXXXXXXXXXXXXXXXXXXXXX
export AWS_SECRET_ACCESS_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

3. Run the playbooks with `ansible-navigator`:

```
ansible-navigator run provisioner/provision_lab.yml --inventory local-inventory.yml --extra-vars @extra-vars.yml -vvvv
```

4. Wait. Time will depend on the server resources, network, etc... but it takes a while.



## If something goes wrong during the deployment...

Sometimes due to the limited VM resources, the physical Hardware odds, network connectivity or the "Demo Gods" the deployment fails. Do not panic, if you followed the previous steps and have the right variables in place the first thing that you should do is to re-launch the deployment, that probably will do the trick...

  >**Tip**
  >
  > You can navigate through the ansible tasks in ansible-navigator by typing `:<task number>`, going back to the previous parent by pressing `ESC` or get the full output by typing `:stdout`. You can also review the log JSON file that is created in every ansible-navigator run under `<your-git-clone-path>/provisioner/provision_lab_artifact-<date>.json`

If re-deployment does not work and you don't find the issue, try to start over from scratch by re-installing RHEL on the server and, if using the external architecture, by running the following playbook that will delete the EC2 instance in AWS:

```
ansible-navigator run provisioner/teardown_lab.yml --inventory local-inventory.yml --extra-vars @extra-vars.yml -vvv
```


## Pre-flight checks

Go (`ssh ansible@<ip>`) to the server where AAP, Gitea, ... are deployed, so either the local server or the server deployed in AWS (external lab architecture) and check:

  >**Note**
  >
  > If you deployed the external lab architecture, you can find the AWS VM IP by just resolving any of the main services, for example controller.training.sandbox<your-number>.opentlc.com. If you need to jump into the AWS server you can go to `<your-git-clone-path>/provisioner/inventory` and use the SSH keys that you will find there.


* SOCKS proxy:

Check if the service is listening in port 1080 (be sure that is 1080 and not just 11080)

```
[ansible@edge-manager-local ~]$ ss -ltn | grep 1080
LISTEN 0      128          0.0.0.0:1080       0.0.0.0:*          
LISTEN 0      511                *:11080            *:*          
LISTEN 0      128             [::]:1080          [::]:*  
```

If not, run this command and check it again:

```
sudo ssh -o StrictHostKeyChecking=no -N -f -D *:1080 localhost
```

After that, with the Web Browser where you configured the SOCKS proxy, try to "Surf" (why we stopped using this word?) the Web .


* Containers:

  - Non-root containers:

```
[ansible@edge-manager-local ~]$ podman pod ps
POD ID        NAME                  STATUS      CREATED       INFRA ID      # OF CONTAINERS
c48dcb7aced7  workshop-rhde_gitops  Running     26 hours ago  fe4b2d9148f1  10


[ansible@edge-manager-local ~]$  podman ps
CONTAINER ID  IMAGE                                    COMMAND               CREATED       STATUS        PORTS       NAMES
fe4b2d9148f1  localhost/podman-pause:4.6.1-1701529524                        26 hours ago  Up 9 minutes              c48dcb7aced7-infra
fa40ba18c4d7  localhost/etherpad:latest                /bin/sh -c etherp...  26 hours ago  Up 9 minutes              workshop-rhde_gitops-etherpad
cf8327aa15cf  localhost/reverse-proxy:latest           -c chown -R nginx...  26 hours ago  Up 9 minutes              workshop-rhde_gitops-reverse-proxy
7c2e3978afc5  localhost/eda:latest                     /bin/sh -c ansibl...  26 hours ago  Up 9 minutes              workshop-rhde_gitops-eda
0f6ca7a5c32d  localhost/ipxe:latest                    -c exec /usr/sbin...  26 hours ago  Up 9 minutes              workshop-rhde_gitops-ipxe
00b991e049ec  localhost/database:latest                                      26 hours ago  Up 9 minutes              workshop-rhde_gitops-database
8e979d6c7a4e  localhost/gitea:latest                   /bin/s6-svscan /e...  26 hours ago  Up 9 minutes              workshop-rhde_gitops-gitea
fbad94197407  localhost/tftp:latest                    /sbin/init            26 hours ago  Up 9 minutes              workshop-rhde_gitops-tftp
6f5514afe4d3  localhost/ostree-repo:latest             -c exec /usr/sbin...  26 hours ago  Up 9 minutes              workshop-rhde_gitops-ostree-repo
192838ddff65  localhost/attendance:latest              npm start             26 hours ago  Up 9 minutes              workshop-rhde_gitops-attendance

```

  - Root containers:
```
[ansible@edge-manager-local ~]$ sudo podman pod ps
[sudo] password for ansible: 
POD ID        NAME                       STATUS      CREATED       INFRA ID      # OF CONTAINERS
ea07ed978253  workshop-rhde_gitops-priv  Running     26 hours ago  587a47ad5e76  2

[ansible@edge-manager-local ~]$ sudo podman ps
CONTAINER ID  IMAGE                                    COMMAND               CREATED       STATUS         PORTS       NAMES
587a47ad5e76  localhost/podman-pause:4.6.1-1701529524                        26 hours ago  Up 10 minutes              ea07ed978253-infra
b20d3154d26f  localhost/dnsmasq:latest                 -c /usr/sbin/dnsm...  26 hours ago  Up 10 minutes              workshop-rhde_gitops-priv-dnsmasq

```

* Services:

Open the following:
  - AAP Controller: https://controller.training.sandbox<your-number>.opentlc.com/
  - Gitea: https://gitea.training.sandbox<your-number>.opentlc.com/
  - Image Builder: image-builder.sandbox<your-number>.opentlc.com/


If you deployed the external lab architecture you should also double check:


* The reverse SSH tunnel between your local server and the AWS server:

Loging into the AAP controller using the admin user (password is the one defined in extra-vars.yml file). Go to Administration > Topology View and be sure that the execution node is green. If it is ok, that means that there is connectivity between the AWS server and your local server through the reverse SSH tunnel.

If it's not green you have to jump into your local server and check the `reverse-ssh-tunnel.service` Systemd unit status. If it failed try to restart it again, and if not directly run the system unit command, that must be something like this:

```
ssh -g -N -T -o ServerAliveInterval=10 -o ExitOnForwardFailure=yes -o StrictHostKeyChecking=no -i /home/<probably 'ansible'>/.ssh/id_rsa -R 2022:localhost:22 ec2-user@< IP of the AWS server>
```



## BONUS - If not enough time for your demo...

Sometimes it could happen that you don't have the 120 minutes to run the demo. One way to reduce the time is by creating the OS images in advance instead of running the build during the demo.

The demo will need to create at least three OS images  (take a look at [minute 49:37 in the video](https://www.youtube.com/watch?v=XCtfy7AqLLY&t=49m37s)):
1. The first one used to show how to onboard the device
2. The upgraded image without some of the required packages by Greenboot
3. The upgraded image but including the required packages

By default, when you "publish" an image the last one that you created is the one that is used. That behaviour can be changed by changing the value `latest` to the version that you want to publish in the `device-edge-images/production-image-deploy.yml` file located Gitea, so you could change that to `0.0.1`, then create the first image with the provided blueprint (just create, you don't need to publish until you run the demo), then create the second and third images using the v2 and v3 blueprints.

Then, during the demo, you can just use the "Publish" task. After showing the onboarding, change the  `device-edge-images/production-image-deploy.yml` file to version 0.0.2 in order to publish the second image (that was already created in the pre-demo steps) and then do the same with the third image.



Enjoy the demo!