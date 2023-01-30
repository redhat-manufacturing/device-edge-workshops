# Workshop Exercise 6.1 - Adding Kubernetes Functionality to Device Edge

## Table of Contents

* [Objective](#objective)
* [Step 1 - Reviewing the Requirements for the Application](#step-1---reviewing-the-requirements-for-the-application)
* [Step 2 - Automated Device Update](#step-2---automated-device-update)

## Objective

In this exercise, we'll review creating a new image via automation to host a kubernetes application on small form factor hardware.

For a reminder on the application we're deploying, review [exercise 1.5](../1.5-application-intro).

> Note:
>
> Portions of Device Edge are in tech preview. Because of this, a few steps are necessary before starting microshift. In addition, the kubernetes functionality will not work on devices that only have a wireless connection. If you have a physical device on wifi, consult with your instructor for next steps.

### Step 1 - Reviewing the Requirements for the Application

We're now going to deploy a Kubernetes-based application to our edge devices. To accomplish this, we'll need to add a very small footprint Kubernetes build to our devices to enable the running of k8s-based applications.

A quick note: This was perviously referred to as [Microshift](https://github.com/openshift/microshift), and is in tech preview. Because of this, we'll need to take a few additional steps to get things going to address concerns that should be cleaned up before the GA date.

In the interest of time, thesse steps have been completed for you and will be made available by the instructor. This image was composed using the [infra.osbuild](https://github.com/redhat-cop/infra.osbuild) Ansible collection, which takes a common set of variables and completely automates interactions with Image Builder.

Specifically, this image was customized with the following variables:
{% raw %}
```yaml
- version: 4.0.0
  type: edge-commit
  repos:
    - name: EPEL8
      base_url: "https://dl.fedoraproject.org/pub/epel/{{ hostvars[inventory_hostname].ansible_distribution_major_version }}/Everything/x86_64/"
      type: yum-baseurl
      check_ssl: true
      check_gpg: false
    - name: microshift
      base_url: https://download.copr.fedorainfracloud.org/results/@redhat-et/microshift-testing/epel-8-x86_64/
      type: yum-baseurl
      check_ssl: true
      check_gpg: false
    - name: microshift-deps
      base_url: https://mirror.openshift.com/pub/openshift-v4/x86_64/dependencies/rpms/4.12-el8-beta/
      type: yum-baseurl
      check_ssl: true
      check_gpg: false
  packages:
    - vim-enhanced
    - git
    - nano
    - microshift
    - NetworkManager-wifi
    - ansible-core
```
{% endraw %}

### Step 2 - Automated Device Update

Proceed to [this exercise](../0.1-update-rhde/) for next steps on how to get your device updated to the correct image version.

---
**Navigation**

[Previous Exercise](../5.5-cleanup-containerized-app) | [Next Exercise](../0.1-upgrade-rhde)

[Click here to return to the Workshop Homepage](../README.md)