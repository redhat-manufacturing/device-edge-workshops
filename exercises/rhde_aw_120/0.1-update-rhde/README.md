# Workshop Exercise 3.4 - Red Hat Device Edge OS Investigation

## Table of Contents

* [Objective](#objective)
* [Step 1 - Copying Our Customized ISO to the VM Storage](#step-1---copying-our-customized-iso-to-the-vm-storage)
* [Step 2 - Attaching the ISO to your Virtual Machine](#step-2---attaching-the-iso-to-your-virtual-machine)
* [Step 3 - Adjusting the Boot Options](#step-3---adjusting-the-boot-options)
* [Step 4 - Powering On the Virtual Machine](#step-4---powering-on-the-virtual-machine)
* [Solutions](#solutions)

## Objective


### Step 1 - Reviewing the Requirements for the Application


```
[root@Colossus ~]# rpm-ostree upgrade
⠤ Writing objects: 1 
Writing objects: 1... done
Staging deployment... done
Added:
  libev-4.24-6.el8.x86_64
  libuv-1:1.41.1-1.el8_4.x86_64
  libwebsockets-4.0.1-2.el8.x86_64
  mosquitto-1.6.15-1.el8.x86_64
  nodejs-1:16.18.1-3.module+el8.7.0+17465+1a1abd74.x86_64
Run "systemctl reboot" to start a reboot

```

```
[root@Colossus ~]# rpm-ostree status
State: idle
Deployments:
  rhel:rhel/8/x86_64/edge
                  Version: 2.0.0 (2023-01-20T13:34:53Z)
                     Diff: 5 added

* rhel:rhel/8/x86_64/edge
                  Version: 1.0.0 (2023-01-19T18:51:54Z)
```

---
**Navigation**

[Previous Exercise](../3.3-ztp-intro) | [Next Exercise](../4.1-bare-metal-image)

[Click here to return to the Workshop Homepage](../README.md)