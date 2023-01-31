# Red Hat Device Edge Workshop - Any Workload, 120 Minutes Edition

This workshop focuses on deploying various workloads to a Device Edge endpoint, focusing on ease of updating the image to support the workload type and leveraging automation to deploy the workload. Due to the smaller timeframe of this lab, most setup steps have been completed prior to the lab - see the lab diagram for more info. The first excercise will focus on investigating the existing components.

After finishing this lab, you are ready to start using Red Hat Device Edge to run your workloads.

## Table of Contents

- [Red Hat Device Edge Workshop - Any Workload, 120 Minutes Edition](#red-hat-device-edge-workshop---any-workload,-120-minutes-edition)
  - [Table of Contents](#table-of-contents)
  - [Presentations](#presentations)
  - [Time planning](#time-planning)
  - [Lab Diagram](#lab-diagram)
  - [Section 1 - Investigating the Lab Environment](#section-1---investigating-the-lab-environment)
  - [Section 2 - Setting Up for Zero Touch Provisioning](#section-2---setting-up-for-zero-touch-provisioning)
  - [Section 3 - Kickstarting a Device](#section-3---kickstarting-a-device)
  - [Section 4 - Deploying a Bare-Metal Workload](#section-4---deploying-a-bare-metal-workload)
  - [Section 5 - Deploying a Containerized Workload](#section-5---deploying-a-containerized-workload)
  - [Section 6 - Deploying a Kubernetes Native Application](#section-6---deploying-a-kubernetes-native-application)

## Presentations

The exercises are self explanatory and guide the participants through the entire lab. All concepts are explained as they are introduced.

Have a look at a general deck about Red Hat's Edge strategy:
[Red Hat Edge Compute Platform](../../decks/rh_edge_compute_platform.pdf)

Also, have a look at our Ansible Best Practices Deck:
[Ansible Best Practices](../../decks/ansible_best_practices.pdf)

## Time planning

The time required to do the workshops strongly depends on multiple factors: the number of participants, how familiar those are with Linux in general and how much discussions are done in between.

Having said that, this workshop is built to take roughly 2 hours.

## Lab Diagram

![Lab Diagram](../../images/rhde_aw_120_lab_diagram.png)

## Section 1 - Investigating the Lab Environment

* [Exercise 1.1 - Preflight Checks](1.1-preflight)
* [Exercise 1.2 - Investigating Ansible Controller](1.2-controller-intro)
* [Exercise 1.3 - Investigating Source Control](1.3-source-control-intro)
* [Exercise 1.4 - Investigating Your Edge Device](1.4-device-intro)
* [Exercise 1.5 - Investigating the Example Workload](1.5-application-info)
* [Exercise 1.6 - Gathering Networking Information](1.6-network-info)
* [Exercise 1.7 - Cloning Your Code Repository](1.7-coding-intro)

## Section 2 - Setting Up for Zero Touch Provisioning

* [Exercise 2.1 - Creating a Kickstart Template](2.1-kickstart-template)
* [Exercise 2.2 - Creating Custom Credentials for Kickstart Template](2.2-kickstart-creds)
* [Exercise 2.3 - Templating Out Our Kickstart](2.3-kickstart-playbook)
* [Exercise 2.4 - Creating a Customized ISO](2.4-build-iso)
* [Exercise 2.5 - Initial Device Configuration Automation](2.5-device-config-automation)
* [Exercise 2.6 - Creating a Provisioning Workflow](2.6-provisioning-workflow)

## Section 3 - Kickstarting a Device

* [Exercise 3.1 - Booting an Edge Device](3.1-boot-edge-device)
* [Exercise 3.2 - Booting an Edge Virtual Machine](3.2-boot-edge-vm)
* [Exercise 3.3 - Observing Zero Touch Provisioning](3.3-ztp-intro)
* [Exercise 3.4 - Red Hat Device Edge OS Investigation](3.4-rhde-os-intro)

## Section 4 - Deploying a Bare Metal Workload

* [Exercise 4.1 - Updating Image for a Bare Metal Application](4.1-bare-metal-image)
* [Exercise 4.2 - Automated Device Upgrade](0.1-upgrade-rhde)
* [Exercise 4.3 - Create Automation to Deploy Application](4.3-bare-metal-app-automation)
* [Exercise 4.4 - Deploy Bare Metal Application](4.4-deploy-bare-metal-app)
* [Exercise 4.5 - Cleaning Up after the Bare Metal Application](4.5-cleanup-bare-metal-app)

## Section 5 - Deploying a Containerized Workload

* [Exercise 5.1 - Updating the Image for Deploying a Containerized Application](5.1-containerized-image)
* [Exercise 5.2 - Automated Device Update](0.1-update-device)
* [Exercise 5.3 - Creating Automation to Deploy a Containerized Application](5.3-containerized-app-automation)
* [Exercise 5.4 - Deploy Containerized Application](5.4-deploy-containerized-app)
* [Exercise 5.5 - Cleaning Up the Containerized Application](5.5-cleanup-containerized-app)

## Section 6 - Deploying a Kubernetes Native Application

* [Exercise 6.1 - Adding Kubernetes to the Image](6.1-add-k8s)
* [Exercise 6.2 - Preparing to Add Kubernetes Functionality](0.1-update-device)
* [Exercise 6.3 - Starting Up Kubernetes on Device Edge](6.3-startup-k8s)
* [Exercise 6.4 - Create Application Definitions](6.4-app-definitions)
* [Exercise 6.5 - Deploy Application](6.5-deploy-k8s-app)

## Supplamental Resources
* [infra.osbuild](https://github.com/redhat-cop/infra.osbuild)
* [redhat_cop.controller_configuration](https://github.com/redhat-cop/controller_configuration)

## Instructor Resources
* [Instructor Page](instructor)