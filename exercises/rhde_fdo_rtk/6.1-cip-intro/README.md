# Workshop Exercise 6.1 - Introduction to the community.cip Collection

## Table of Contents

* [Objective](#objective)
* [Step 1 - Overview of CIP](#step-1---syncing-our-project)
* [Step 2 - Overview of the community.cip Collection](#step-2---creating-a-job-template)

## Objective

In this exercise, we'll take a look at CIP and the community.cip Ansible collection.

### Step 1 - Overview of CIP

CIP, or the Common Industrial Protocol, is a media independent protocol using a producer-consumer communication model, and is a strictly object oriented protocol at the upper layers. Each CIP object has attributes (data), services (commands), connections, and behaviors (relationship between attribute values and services). CIP includes an extensive object library to support general purpose network communications, network services such as file transfer, and typical automation functions such as analog and digital input/output devices, HMI, motion control and position feedback.

For more info, visit the [ODVA page on CIP](https://www.odva.org/technology-standards/key-technologies/common-industrial-protocol-cip/).

### Step 2 - Overview of the community.cip Collection

The [community.cip](https://github.com/ansible-collections/community.cip) Ansible collection is an attempt to leverage the common industrial protocol to bring industrual devices under management similar to more traditional devices, such as linux server, network devices, and so on.

Many industrual devices leverage CIP for communication, potentially opening up the possibility of management with Ansible. For more information, check out this [blog post about the collection](https://developers.redhat.com/articles/2023/01/10/automate-devices-using-ansible-cip#).

---
**Navigation**

[Previous Exercise](../5.2-deploying-the-app) | [Next Exercise](../6.2-inventory-and-host)

[Click here to return to the Workshop Homepage](../README.md)
