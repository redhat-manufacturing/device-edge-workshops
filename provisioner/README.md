# Red Hat Device Edge Workshop Provisioner

The `https://github.com/redhat-manufacturing/device-edge-workshops` contains an Ansible Playbook `provision_lab.yml`, which is an automated lab setup for Ansible training on AWS (Amazon Web Services).  Set the `workshop_type` variable below to provision the corresponding workshop.

| Workshop | Workshop Type Var |
| --- | --- |
| Red Hat Device Edge - Any Workload, 120 Minutes | `workshop_type: rhde_aw_120`  |
| Red Hat Device Edge - Trade Show Edition | `workshop_type: rhde_tse`  |
| Red Hat Device Edge - GitOps | `workshop_type: rhde_gitops`  |
| Red Hat Device Edge - FDO Secure Onboarding and the Realtime Kernel | `workshop_type: rhde_fdo_rtk`  |

## Table Of Contents

<!-- TOC titleSize:2 tabSpaces:2 depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 skip:0 title:1 charForUnorderedList:* -->

* [Ansible Automation Workshop Provisioner](#ansible-automation-workshop-provisioner)
  * [Table Of Contents](#table-of-contents)
  * [prerequisites](#prerequisites)
  * [Requirements](#requirements)
  * [Lab Setup](#lab-setup)
  * [Using Ansible-Navigator](#using-ansible-navigator)
    * [1. AWS Creds for Execution Environments](#1-aws-creds-for-execution-environments)
    * [2. Running Ansible-Navigator from the project root](#2-running-ansible-navigator-from-the-project-root)
    * [Setup (per workshop)](#setup-per-workshop)
    * [The Student Variable](#the-student-variable)
    * [Building Local Resources](#building-local-resources)
    * [Automation controller license](#automation-controller-license)
    * [Additional examples](#additional-examples)
    * [Accessing student documentation and slides](#accessing-student-documentation-and-slides)
    * [Accessing instructor inventory](#accessing-instructor-inventory)
    * [DNS](#dns)
    * [Smart Management](#smart-management)
  * [Developer Mode and understanding collections](#developer-mode-and-understanding-collections)
  * [Lab Teardown](#lab-teardown)
  * [Demos](#demos)
  * [FAQ](#faq)
  * [More info on what is happening](#more-info-on-what-is-happening)
<!-- /TOC -->

## Introduction

The provisioner prepares RHDE workshops to be run by an instructor. Generally speaking, workshops take ~30 minutes to provision, however they can take longer depending on the number of students. 

## Prerequisites

The provisioner requires a few things to get started:

### 1. An Edge Management System

This can be any system that can run RHEL9 and meets the minimum system requirements for AAP (4cores/16gb ram), and has some disk space available (50gb+). It should also have two available network interfaces, at least one wired connection for the "internal" connection, and a second "external" connection that can be wired or wireless. The external connection requires internet access during provisioning and during the workshop.

The system should be standard RHEL registered to the customer portal. Minimal installs and workstation installs are both fine. If you choose "Server", be sure to uninstall dnsmasq before attempting to provision a workshop.

>**Note**
>
> If you requested edge devices and would like to use them, sample kickstarts can be found in the [example-kickstarts](./example-kickstarts/) directory.

### 2. An AWS Account

By default, no infrastructure runs in AWS, the only service leveraged is Route53 for creation of a wildcard certificate for a reverse proxy. If you are a Red Hat associate, a blank open AWS environment requested through RHDPS will work, and comes with a generic DNS domain that can be used.

Ensure you export the AWS credentials before running the provisioner:
```
export AWS_ACCESS_KEY_ID=YOURACCESSKEYHERE
export AWS_SECRET_ACCESS_KEY=YouRS3dh4TKEYHeRE
```

To make environment variables permanent and persistent you can set this to your `~/.bash_rc`.  See Red Hat Knowledge Base article: [https://access.redhat.com/solutions/157293](https://access.redhat.com/solutions/157293)

### 3. A ZeroSSL Account

This is totally free to set up and allows wildcard certificates to be issued. Once registered, create an API key on the [developer page](https://app.zerossl.com/developer).

### 4. A Red Hat Customer Portal Account

This account needs to be able to access the container registry and pull images, but does not need any further access.

### 5. A Red Hat Customer Portal Offline Token

This token is used to authenticate to the customer portal and download software. It can be generated [here](https://access.redhat.com/management/api).

### 6. Lab Network Infrastructure

It's highly recommended to provide WiFi for students and student devices so everyone is on the same network without needing cables run to all student spots. Any generic wireless access point will work, as long as it's set to just "access point" mode, meaning no DHCP, DNS, routing, NAT, etc. The Edge Managemnet box will be providing those services, all that needs to be done is for the wireless router to extend the network.

### 7. An Imaging Station

This is just a wired connection into the lab network (such as the ports on a wireless access point), a keyboard, monitor, and a few outlets. The devices provision on the wired network then connect to the wireless network, and can be safely disconnected from the wired network.

Generally speaking, one imaging station per ten students is a good ratio to keep things moving, but technically you only need one.

### 8. The Ability to Run Ansible Playbooks

This can be ansible in a venv, or ansible-navigator, either will work.

### 9. An Ansible Controller Manifest

In order to use Automation controller (i.e. `controllerinstall: true`), which is the default behavior (as seen in group_vars/all.yml) you need to have a valid subscription via a `manifest.zip` file.  To retrieve your manifest.zip file you need to download it from access.redhat.com.  

- Here is a video by Colin McNaughton to help you retrieve your manifest.zip:
 [https://youtu.be/FYtilnsk7sM](https://youtu.be/FYtilnsk7sM).
- If you need to get a temporary license, get a trial here [http://red.ht/try_ansible](http://red.ht/try_ansible).
- Follow the following KCS on how to generate the manifest file https://access.redhat.com/solutions/5586461

**How do you use the manifest.zip with the workshop?**

These are the ways to integrate your license file with the workshop:

1. Put the manifest.zip file into provisioner folder

  The first way is to make sure your license/manifest has the exact name `manifest.zip` and put it into the same folder as the `provision_lab.yml` playbook (e.g.) `<your-path>/workshops/provisioner/manifest.zip`

2. Turn the manifest.zip into a variable

  The second way is to turn the `manifest.zip `into a base64 variable.

  This allows the `manifest.zip` to be treated like an Ansible variable so that it can work with CI systems like Github Actions or Zuul.  This also makes it easier to work with Automation controller, in case you are spinning up a workshop using Automation controller itself.

  To do this use the `base64` command to encode the manifest:

  ```
  base64 manifest.zip > base64_platform_manifest.txt
  ```
  Take the output of this command and set it to a variable `base64_manifest` in your extra_vars file.

  e.g.
  ```
  base64_manifest: 2342387234872dfsdlkjf23148723847dkjfskjfksdfj
  ```

  On macs, specify the `-i` flag:
  ```
  base64 -i manifest.zip > base64_platform_manifest.txt
  ```

  >**Note**
  >
  >The manifest.zip is substantially larger than the tower.license file, so the base64_manifest base64 might be several hundred lines long if you have text wrapping in your editor.

  >**Note**
  >
  >base64 is not encryption, if you require encryption you need to work within your CI system or Automation controller to encrypt the base64 encoded manifest.zip.

3. Download the manifest.zip from a URL

  If you specify the following variables, the provisioner will download the manifest.zip from an authenticated URL:

  ```
  manifest_download_url: https://www.example.com/protected/manifest.zip
  manifest_download_user: username
  manifest_download_password: password
  ```

## Creating An Extra-Vars File and an Inventory File

### Inventory File

You'll need an inventory file to tell ansible about the device that will be used as your Edge Management system. Create a file locally with the following information, substituting where necessary:

```yaml
all:
  children:
    local:
      children:
        edge_management:
          hosts:
            edge-manager-local:
  vars:
    ansible_host: 1.2.3.4
    ansible_user: ansible
    ansible_password: ansible
    ansible_become_password: ansible
    external_connection: enp0s31f6 # Connection name for the external connection, could be wifi
    internal_connection: enp2s0 # Interface for the lab network, should be wired
```

>**Note**
>
> Do not use `root` as your ansible_user, use a non-root account that can sudo.

>**Note**
>
> ini-formatted inventories are fine, as well as using ssh keys, this is just a standard inventory file. Since the provisioner isn't creating the host (like for aws instances), connection information must be provided.


### Extra-Vars File

Most variables are re-used between workshops, however sometimes there are unique variables. Copy the example extra-vars file for your desired workshop from `provisioner/example-extra-vars/$(workshop_var).yml` to the root of the project and modify accordingly.


## Running the Provisioner

* The provisioner has an execution environment available on [quay.io](https://quay.io/repository/device-edge-workshops/provisioner-execution-environment) with all requirements baked in. In addition, `ansible-navigator` is required, which can be installed into a virtual environment locally.


### 1. Using Ansible-Navigator

You must run from the project root rather than the `/provisioner` folder.  This is so all the files in the Git project are mounted, not just the provisioner folder.  This is also best practice because it matches the behavior in Automation controller.

```
ansible-navigator run provisioner/provision_lab.yml --inventory local-inventory.yml --extra-vars @extra-vars.yml -v
```
You can add *-m stdout* to ansible-navigator to make the output explicit.

>**Note**
>
> Parts of the provisioner create files locally then push them to the provisioned services. There's no harm in having the provisioner re-template out these files, however to speed things up a volume mount can be used. Ensure your user owns the directory that will be bind mounted. See below for an example.

```
ansible-navigator run provisioner/provision_lab.yml --inventory local-inventory.yml --extra-vars @extra-vars.yml --mode stdout --execution-environment-volume-mounts /path/to/tmpdir:/tmp:Z -v
```

### 2. Using Ansible-Playbook

It's recommended to create a [virtual environment](https://docs.python.org/3/library/venv.html) to house the python libraries required for the provisioner.

Make sure to install the prerequired python libraries by running:
```
pip install -r execution-environment/requirements.txt
```

Make sure to install the prerequired collections by running:
```
ansible-galaxy install -r execution-environment/requirements.yml
```

Then run the provisioner:

```
ansible-playbook provisioner/provision_lab.yml -e @extra_vars.yml -i inventory.yml
```

## IGNORE BELOW

### Accessing student documentation and slides

* Exercises and instructor slides are hosted at [aap2.demoredhat.com](aap2.demoredhat.com)

* Workbench information is stored in two places after you provision:

  * in a local directory named after the workshop (e.g. testworkshop/instructor_inventory)
  * By default there will be a website `ec2_name_prefix.workshop_dns_zone` (e.g. `testworkshop.rhdemo.io`)

    * **NOTE:** It is possible to change the DNS domain (right now this is only supported via a AWS Route 53 Hosted Zone) using the parameter `workshop_dns_zone` in your `extra_vars.yml` file.

### Accessing instructor inventory

* The instructor inventory will be copied to `/tmp` on student1's control_node as part of the control_nodes role.
* The instructor can see all assigned students and what their workbench is by visiting `ec2_name_prefix.workshop_dns_zone/list.php` (e.g. `testworkshop.rhdemo.io/list.php`)

### DNS

The provisioner currently supports creating DNS records per control node with valid SSL certs using [Lets Encrypt](https://letsencrypt.org/).  Right now DNS is only supported via AWS Route 53, however we are building it in a way that this can be more pluggable and take advantage of other public clouds.

This means that each student workbench will get an individual DNS entry.  For example a DNS name will look like this: `https://student1.testworkshop.rhdemo.io`

* **NOTE:** The variable `dns_type` defaults to `aws`.  This can also be set to `dns_type: none`.
* **NOTE:**  If Lets Encrypt fails, the workshop provisioner will still pass, and alert you of errors in the `summary_information` at the end of the `provision_lab.yml` Ansible Playbook.

### Smart Management

The Smart Management Lab relies on a prebuilt AMI for Red Hat Satellite Server. An example for building this AMI can be found [here](https://github.com/willtome/ec2-image-build).

The Smart Management Lab also requires AWS DNS to be enabled. See [sample vars](./sample_workshops/sample-vars-smart_mgmt.yml) for required configuration.

## Developer Mode and understanding collections

The Ansible Workshops are actually a collection.  Every role is called using the FQCN (fully qualified collection name).  For example to setup the control node (e.g. install Automation controller) we call the role

```
- include_role:
    name: ansible.workshops.control_node
```

This installs locally from Git (versus from Galaxy or Automation Hub).  If the galaxy.yml version **matches** your installed version, it will skip the install (speed up provisioning).  Using `developer_mode: true` if your extra_vars will force installation every time.  This is super common when you are editing a role and want to immediately see changes without publishing the collection.

If you want to contribute to the workshops, check out the [contribution guide](../docs/contribute.md).

## Lab Teardown

The `teardown_lab.yml` playbook deletes all the training instances as well as local inventory files.

To destroy all the EC2 instances after training is complete:

* Run the playbook:

```bash
ansible-playbook teardown_lab.yml -e @extra_vars.yml
```

* Optionally you can enable verbose debug output of the information gathered that drives the teardown process by passing the extra optional variable `debug_teardown=true`. Example:

```bash
ansible-playbook teardown_lab.yml -e @extra_vars.yml -e debug_teardown=true
```

Note: Replace `ansible-playbook` with `ansible-navigator run` if using `ansible-navigator`.

## More info on what is happening

The `provision_lab.yml` playbook creates a work bench for each student, configures them for password authentication, and creates an inventory file for each user with their IPs and credentials. An instructor inventory file is also created in the current directory which will let the instructor access the nodes of any student.  This file will be called `instructor_inventory.txt`

What does the AWS provisioner take care of automatically?

* AWS VPC creation (Amazon WebServices Virtual Private Cloud)
* Creation of an SSH key pair (stored at ./WORKSHOPNAME/WORKSHOPNAME-private.pem)
* Creation of a AWS EC2 security group
* Creation of a subnet for the VPC
* Creation of an internet gateway for the VPC
* Creation of route table for VPC (for reachability from internet)
