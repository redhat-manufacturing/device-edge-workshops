# Workshop Exercise 1.6 - Gathering Network Information

## Table of Contents

* [Objective](#objective)
* [Step 1 - Obtaining Information for Physical Edge Devices](#step-1---obtaining-information-for-physical-edge-devices)
* [Step 2 - Network Information in AWS](#step-2---network-information-in-aws)
* [Step 3 - Saving the Information](#step-3---saving-the-information)

## Objective

In this exercise, we are going to gather the required information to be used for kickstarting our edge devices, whether it be physical devices in the room or virtualized instances in AWS.

This exercise will cover:

* Determing the IP addresses/DNS records to use
* (if applicable) Determing the Network to use

### Step 1 - Obtaining Information for Physical Edge Devices

For the physical devices, an "edge manager" node should be available. This will have been configured by the workshop provisioner before the lab was started. Your instructor should have the information ready for you.

In addition, the devices will be connected to the same network (wired or wireless) for provisioning and management. The instructor will be communicating this information to you as well.

### Step 2 - Network Information in AWS

For edge devices being virtualized in AWS, the "edge manager" node is the same as the node running Ansible Controller. DNS/DHCP should be available within the VPC of the edge hypervisor, so simply reuse those details.

> **Note**
>
> A quick reminder: Ansible Controller information can be found on your student page.

### Step 3 - Saving the Information

We'll need the networking information for kickstarting devices in a later exercise, so feel free to save this information somewhere handy or refer back to your student page/instructor provided information.

---
**Navigation**

[Previous Exercise](../1.5-application-intro) | [Next Exercise](../1.7-coding-intro)

[Click here to return to the Workshop Homepage](../README.md)
