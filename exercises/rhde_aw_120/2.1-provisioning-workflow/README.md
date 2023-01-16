# Workshop Exercise 1.7 - Cloning Your Code Repository

## Table of Contents

* [Objective](#objective)
* [Step 1 - Introduction to the Workload](#step-1---introduction-to-the-workload)
* [Step 2 - The MQTT Broker](#step-2---the-mqtt-broker)
* [Step 3 - The Simulator](#step-3---the-simulator)
* [Step 4 - The Controller](#step4---the-controller)
* [Step 5 - The WebUI](#step-5---the-webui)
* [Step 6 - The Assembled Application](#step-1---the-assembled-application)


## Objective

In this exercise, we're going to build a workflow that will fully deploy our edge devices. We want to take several steps automatically when the devices boot and call home, so a workflow makes perfect sense.

The basic idea of a workflow is to link multiple Job Templates together. They may or may not share inventory, playbooks or even permissions. The links can be conditional:

* if job template A succeeds, job template B is automatically executed afterwards
* but in case of failure, job template C will be run.

And the workflows are not even limited to Job Templates, but can also include project or inventory updates.

This enables new applications for Ansible automation controller: different Job Templates can build upon each other.

### Step 1 - Creating a Workflow


---
**Navigation**

[Previous Exercise](../1.6-network-info) | [Next Exercise](../2.1-provisioning-workflow)

[Click here to return to the Workshop Homepage](../README.md)