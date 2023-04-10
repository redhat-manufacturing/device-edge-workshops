# Red Hat Device Edge Workshop - Trade Show Edition

This workshop focuses on providing a polished experience with Device Edge. Students will walk through creating an image, booting a device over the network, and deploying a workload to the device. This is a more "click-through" experience, in that students will spend less time configuring components, and more time interacting with devices, the workload, and optionally interacting with a scaled down industrial control system.

## Table of Contents

- [Red Hat Device Edge Workshop - Any Workload, 120 Minutes Edition](#red-hat-device-edge-workshop---any-workload,-120-minutes-edition)
  - [Table of Contents](#table-of-contents)
  - [Presentations](#presentations)
  - [Time planning](#time-planning)
  - [Lab Diagram](#lab-diagram)
  - [Section 1 - Investigating the Lab Environment](#section-1---investigating-the-lab-environment)
  - [Section 2 - Creating an Image with Image Builder WebUI](#section-2---setting-up-for-zero-touch-provisioning)
  - [Section 3 - Creating an Image with infra.osbuild](#section-3---kickstarting-a-device)
  - [Section 4 - Kickstarting a Device](#section-4---deploying-a-bare-metal-workload)
  - [Section 5 - Deploying a Containerized Workload](#section-5---deploying-a-containerized-workload)
  - [Section 6 - Optional - Ansible and CIP](#section-6---deploying-a-kubernetes-native-application)

## Presentations

The exercises are self explanatory and guide the participants through the entire lab. All concepts are explained as they are introduced.

Have a look at a general deck about Red Hat's Edge strategy:
[Red Hat Edge Compute Platform](../../decks/rh_edge_compute_platform.pdf)

Also, have a look at our Ansible Best Practices Deck:
[Ansible Best Practices](../../decks/ansible_best_practices.pdf)

## Time planning

The time required to do the workshops strongly depends on multiple factors: the number of participants, how familiar those are with Linux in general and how much discussions are done in between.

Having said that, this workshop is built to take roughly 4 hours.

## Lab Diagram

![Lab Diagram](../../images/rhde_aw_120_lab_diagram.png)

## Section 1 - Investigating the Lab Environment

* [Exercise 1.1 - Preflight Checks](1.1-preflight)
* [Exercise 1.2 - Investigating Ansible Controller](1.2-controller-intro)
* [Exercise 1.3 - Investigating Source Control](1.3-source-control-intro)
* [Exercise 1.4 - Investigating Your Edge Device](1.4-device-intro)
* [Exercise 1.5 - Investigating the Example Workload](1.5-application-intro)
* [Exercise 1.6 - Gathering Networking Information](1.6-network-info)
* [Exercise 1.7 - Cloning Your Code Repository](1.7-coding-intro)
* [Exercise 1.8 - Getting Logged Into the Image Builder WebUI](1.8-image-builder-intro)

## Section 2 - Creating an Image via tha Image Builder WebUI

* [Exercise 2.1 - Reviewing the Workflow to Build Images](2.1-image-builder-workflow)
* [Exercise 2.2 - Building an Image via the WebUI](2.2-build-image-webui)

THE BELOW ARE NOT DONE YET

## Section 3 - Creating an Image via the infra.osbuild Collection

* [Exercise 3.1 - Reviewing Execution Environments](3.1-execution-environment-review)
* [Exercise 3.2 - Converting Our Image Definition to Code](3.2-image-definition-in-code)
* [Exercise 3.3 - Calling the Collection from a Playbook]()
* [Exercise 3.4 - Configuring Controller to Run Our Playbook]()
* [Exercise 3.5 - Validating in the Image Builder WebUI]()

## Section 4 - Provisioning an Edge Device

* [Exercise 4.1 - Updating Image for a Bare Metal Application](4.1-bare-metal-image)
* [Exercise 4.2 - Automated Device Upgrade](0.1-upgrade-rhde)
* [Exercise 4.3 - Create Automation to Deploy Application](4.3-bare-metal-app-automation)
* [Exercise 4.4 - Deploy Bare Metal Application](4.4-deploy-bare-metal-app)
* [Exercise 4.5 - Cleaning Up after the Bare Metal Application](4.5-cleanup-bare-metal-app)

## Section 5 - Deploying a Containerized Workload

* [Exercise 5.1 - Updating the Image for Deploying a Containerized Application](5.1-containerized-image)
* [Exercise 5.2 - Automated Device Update](0.1-upgrade-rhde)
* [Exercise 5.3 - Creating Automation to Deploy a Containerized Application](5.3-containerized-app-automation)
* [Exercise 5.4 - Deploy Containerized Application](5.4-deploy-containerized-app)
* [Exercise 5.5 - Cleaning Up the Containerized Application](5.5-cleanup-containerized-app)

## Section 6 - Leveraging the community.cip Collection

* [Exercise 6.1 - Adding Kubernetes to the Image](6.1-add-k8s)
* [Exercise 6.2 - Preparing to Add Kubernetes Functionality](0.1-upgrade-rhde)
* [Exercise 6.3 - Starting Up Kubernetes on Device Edge](6.3-startup-k8s)
* [Exercise 6.4 - Create Application Definitions](6.4-app-definitions)
* [Exercise 6.5 - Deploy Application](6.5-deploy-k8s-app)

## Supplamental Resources
* [infra.osbuild](https://github.com/redhat-cop/infra.osbuild)
* [redhat_cop.controller_configuration](https://github.com/redhat-cop/controller_configuration)

## Instructor Resources
* [Instructor Page](instructor)