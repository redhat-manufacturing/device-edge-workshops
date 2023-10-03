# Demo: Summit Connect 2023

This demo is a deep dive on [Red Hat Device Edge](https://cloud.redhat.com/blog/meet-red-hat-device-edge-with-microshift)'s functionality, including an introduction to [Image Builder](https://www.redhat.com/en/topics/linux/what-is-an-image-builder) and the [infra.osbuild](https://github.com/redhat-cop/infra.osbuild) Ansible collection, [greenboot](https://www.redhat.com/en/blog/automating-rhel-edge-image-rollback-greenboot), and [microshift](https://next.redhat.com/project/microshift/). Particular attention will be given to building applications into an image, along with configuring health checks to trigger rollbacks.

## Table of Contents

## Presentations

The exercises are self explanatory and guide the participants through the entire lab. All concepts are explained as they are introduced.

Have a look at a general deck about Red Hat's Edge strategy:
[Red Hat Edge Compute Platform](../../decks/rh_edge_compute_platform.pdf)

Also, have a look at our Ansible Best Practices Deck:
[Ansible Best Practices](../../decks/ansible_best_practices.pdf)

## Section 1 - Composing an Initial Image

* [Exercise 1.1 - Introduction to Image Builder](1.1-image-builder-intro)
* [Exercise 2.1 - Reviewing the Workflow to Build Images](2.1-image-builder-workflow)
* [Exercise 2.2 - Reviewing Execution Environments](2.2-execution-environment-review)
* [Exercise 2.3 - Creating an Image Definition](2.3-image-definition-in-code)
* [Exercise 2.4 - Using the infra.osbuild Collection in a Playbook](2.4-using-collection-in-playbook)
* [Exercise 2.5 - Running Our Playbook through Controller](2.5-aap-image-build)

## Section 2 - Creating an Image with the Realtime Kernel via the infra.osbuild Collection



## Section 3 - Installing and Configuring FDO

* [Exercise 3.1 - Introduction to FDO](3.1-fdo-intro)
* [Exercise 3.2 - Installing and Configuring FDO](3.2-fdo-install-config)

## Section 4 - Creating an Edge Simplified Installer Image via the Composer CLI

* [Exercise 4.1 - Building a Blueprint](4.1-build-blueprint)
* [Exercise 4.2 - Starting a Compose via the Composer CLI](4.2-start-compose-cli)

## Section 5 - Imaging a Device as a Device Manufacturer

* [Exercise 5.1 - Imaging a Device as a Device Manufacturer](5.1-device-manufacturer-image)

## Section 6 - Finishing Device Installation at their Final Destination

* [Exercise 6.1 - Finishing the Process at the Device Destination](6.1-finish-install)
* [Exercise 6.1 - Adding out Host to an Inventory](6.2-add-host-to-inventory)

## Section 7 - Deploying an Application that Requires Deterministic Compute

* [Exercise 7.2 - Creating Automation to Deploy a Containerized Application](7.1-containerized-app-automation)
* [Exercise 7.3 - Deploying the Application via Ansible Controller](7.2-deploying-the-app)

## Supplamental Resources
* [infra.osbuild](https://github.com/redhat-cop/infra.osbuild)
* [redhat_cop.controller_configuration](https://github.com/redhat-cop/controller_configuration)

## Instructor Resources
* [Instructor Page](instructor)