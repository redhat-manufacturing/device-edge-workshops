# Workshop Exercise 3.4 - Red Hat Device Edge OS Investigation

## Table of Contents

* [Objective](#objective)
* [Step 1 - Copying Our Customized ISO to the VM Storage](#step-1---copying-our-customized-iso-to-the-vm-storage)
* [Step 2 - Attaching the ISO to your Virtual Machine](#step-2---attaching-the-iso-to-your-virtual-machine)
* [Step 3 - Adjusting the Boot Options](#step-3---adjusting-the-boot-options)
* [Step 4 - Powering On the Virtual Machine](#step-4---powering-on-the-virtual-machine)
* [Solutions](#solutions)

## Objective

In this exercise, we'll review creating a new image via automation to host our bare metal application.

For a reminder on the application we're deploying, review [exercise 1.5](../1.5-application-intro).

> Note:
>
> We will be purposefully configuring the device incorrectly in this exercise, do not do these things in production. While running applications is perfectable fine on RHDE and can be secured, this lab focuses on RHDE and not SELinux/fapolicyd/etc. In addition, this reinforces that migrating containers helps simplify the securing of appliccations. In addition, EPEL is not supported by Red Hat.

### Step 1 - Reviewing the Requirements for the Application

Since this application requires the Mosquitto MQTT broker and nodeJS 16, we need to add packages to our image to run the application.

In the interest of time, this has been done for you and will be made available by the instructor. This image was composed using the [infra.osbuild](https://github.com/redhat-cop/infra.osbuild) Ansible collection, which takes a common set of variables and completely automates interactions with Image Builder.

Specifically, this image was customized with the following variables:
```
- version: 2.0.0
   type: edge-commit
   repos:
   - name: EPEL8
      base_url: https://dl.fedoraproject.org/pub/epel/8/Everything/x86_64/
      type: yum-baseurl
      check_ssl: true
      check_gpg: false
    packages:
      - vim-enhanced
      - git
      - nano
      - mosquitto
      - nodejs
      - NetworkManager-wifi
      - ansible-core
```

---
**Navigation**

[Previous Exercise](../3.3-ztp-intro) | [Next Exercise](../4.1-bare-metal-image)

[Click here to return to the Workshop Homepage](../README.md)