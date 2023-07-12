# Red Hat Device Edge Workshop - Trade Show Edition

This workshop focuses on providing a polished experience with Device Edge. Students will walk through creating an image, booting a device over the network, and deploying a workload to the device. This is a more "click-through" experience, in that students will spend less time configuring components, and more time interacting with devices, the workload, and optionally interacting with a scaled down industrial control system.

## Table of Contents

- [Red Hat Device Edge Workshop - Trade Show Edition](#red-hat-device-edge-workshop---trade-show-edition)
  - [Table of Contents](#table-of-contents)
  - [Presentations](#presentations)
  - [Time planning](#time-planning)
  - [Lab Diagram](#lab-diagram)
  - [Section 1 - Investigating the Lab Environment](#section-1---investigating-the-lab-environment)
  - [Section 2 - Creating an Image via tha Image Builder WebUI](#section-2---creating-an-image-via-tha-image-builder-webui)
  - [Section 3 - Creating an Image via the infra.osbuild Collection](#section-3---creating-an-image-via-the-infraosbuild-collection)
  - [Section 4 - Provisioning an Edge Device](#section-4---provisioning-an-edge-device)
  - [Section 5 - Deploying an Application](#section-5---deploying-an-application)
  - [Section 6 - Optional - Leveraging the community.cip Collection](#section-6---leveraging-the-communitycip-collection)
  - [Supplamental Resources](#supplamental-resources)
  - [Instructor Resources](#instructor-resources)

## Presentations

The exercises are self explanatory and guide the participants through the entire lab. All concepts are explained as they are introduced.

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

## Section 3 - Creating an Image via the infra.osbuild Collection

* [Exercise 3.1 - Reviewing Execution Environments](3.1-execution-environment-review)
* [Exercise 3.2 - Converting Our Image Definition to Code](3.2-image-definition-in-code)
* [Exercise 3.3 - Using the infra.osbuild Collection in a Playbook](3.3-using-collection-in-playbook)
* [Exercise 3.4 - Running Our Playbook through Controller](3.4-aap-image-build)

## Section 4 - Provisioning an Edge Device

* [Exercise 4.1 - Network Provisioning an Edge Device](4.1-network-provision)
* [Exercise 4.2 - Initial Call Home](4.2-initial-call-home)

## Section 5 - Deploying an Application

* [Exercise 5.1 - Creating Automation to Deploy a Containerized Application](5.1-containerized-app-automation)
* [Exercise 5.2 - Deploying the Application via Ansible Controller](5.2-deploying-the-app)

## Section 6 - Leveraging the community.cip Collection

* [Exercise 6.1 - Introduction to the community.cip Collection](6.1-cip-intro)
* [Exercise 6.2 - Adding an Inventory for CIP Devices](6.2-inventory-and-host)
* [Exercise 6.3 - Creating a Playbook to Modify Tags](6.3-tags-playbook)
* [Exercise 6.4 - Creating a Job Template for the CIP Playbook](6.4-cip-job-template)
* [Exercise 6.5 - Running the CIP Job Template](6.5-run-cip-automation)

## Supplamental Resources
* [infra.osbuild](https://github.com/redhat-cop/infra.osbuild)
* [redhat_cop.controller_configuration](https://github.com/redhat-cop/controller_configuration)

## Instructor Resources
* [Instructor Page](instructor)