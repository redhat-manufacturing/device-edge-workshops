# Red Hat Device Edge - FDO Secure Onboarding and the Realtime Kernel

This workshop focuses on building edge devices that feature the realtime kernel for deterministic compute, and how to onboard devices securely using FDO. The FDO workflow differs from other onboarding workflows, so students should have some familiarity with onboarding edge devices prior to running this workshop.

## Table of Contents

- [Red Hat Device Edge - FDO Secure Onboarding and the Realtime Kernel](#red-hat-device-edge---fdo-secure-onboarding-and-the-realtime-kernel)
  - [Table of Contents](#table-of-contents)
  - [Presentations](#presentations)
  - [Time planning](#time-planning)
  - [Lab Diagram](#lab-diagram)
  - [Section 1 - Investigating the Lab Environment](#section-1---investigating-the-lab-environment)
  - [Section 2 - Creating an Image with Image Builder WebUI](#section-2---setting-up-for-zero-touch-provisioning)
  - [Section 3 - Creating an Image with infra.osbuild](#section-3---kickstarting-a-device)
  - [Section 4 - Kickstarting a Device](#section-4---deploying-a-bare-metal-workload)
  - [Section 5 - Deploying an Application](#section-5---deploying-an-application)
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

## Section 2 - Creating an Image with the Realtime Kernel via the infra.osbuild Collection

* [Exercise 2.1 - Reviewing the Workflow to Build Images](2.1-image-builder-workflow)
* [Exercise 2.2 - Reviewing Execution Environments](3.1-execution-environment-review)
* [Exercise 2.3 - Creating an Image Definition](3.2-image-definition-in-code)
* [Exercise 2.4 - Using the infra.osbuild Collection in a Playbook](3.3-using-collection-in-playbook)
* [Exercise 2.5 - Running Our Playbook through Controller](3.4-aap-image-build)

## Section 3 - Installing and Configuring FDO

* [Exercise 3.1 - Introduction to FDO](3.1-fdo-intro)
* [Exercise 3.2 - Installing and Configuring FDO](3.2-fdo-install-config)

## Section 4 - Creating an Edge Simplified Installer Image via the Composer CLI

* [Exercise 4.1 - Network Provisioning an Edge Device](4.1-network-provision)
* [Exercise 4.2 - Initial Call Home](4.2-initial-call-home)

## Section 5 - Initial Imaging of Edge Devices

* [Exercise 5.1 - Creating Automation to Deploy a Containerized Application](5.1-containerized-app-automation)
* [Exercise 5.2 - Deploying the Application via Ansible Controller](5.2-deploying-the-app)

## Section 6 - Finishing Device Installation at their Final Destination

## Section 7 - Deploying an Application that Requires Deterministic Compute

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