# Workshop Exercise 4.1 - Updating Image for a Bare Metal Application

## Table of Contents

* [Objective](#objective)
* [Step 1 - Reviewing the Requirements for the Application](#step-1---reviewing-the-requirements-for-the-application)
* [Step 2 - Automated Device Update](#step-2---automated-device-update)

## Objective

In this exercise, we'll review creating a new image via automation to host our bare metal application.

For a reminder on the application we're deploying, review [exercise 1.5](../1.5-application-intro).

> **Note**
>
> We will be purposefully configuring the device incorrectly in this exercise. It is important to avoid performing these same configurations in production environments. While running applications is suitable on RHDE and can be secured approperately, this lab focuses on RHDE and not SELinux/fapolicyd/etc. In addition, this reinforces that migrating to containers helps simplify the securing of appliccations. In addition, EPEL is not supported by Red Hat.

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

Here we can see that we've added `EPEL` as a repository for Image Builder, and `mosquitto` and `nodejs` packages are added to the image.

### Step 2 - Automated Device Update

Proceed to [this exercise](../0.1-upgrade-rhde/) for next steps on how to get your device updated to the correct image version.

---
**Navigation**

[Previous Exercise](../3.3-ztp-intro) | [Next Exercise](../4.3-bare-metal-app-automation)

[Click here to return to the Workshop Homepage](../README.md)
