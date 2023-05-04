# Workshop Exercise 3.1 - Introduction to FDO

## Table of Contents

* [Objective](#objective)
* [Step 1 - An Overview of FDO](#step-1---an-overview-of-fdo)
* [Step 2 - The Overall Workflow](#step-2---the-overall-workflow)
* [Step 3 - Creating the Ownership Voucher](#step-3---creating-the-ownership-voucher)
* [Step 4 - First Boot at Destination](#step-4---first-boot-at-destination)
* [Special Thanks](#step-4---first-boot-at-destination)

## Objective

In this exercise, we'll learn about what FDO is and review the key principles of Red Hat's implimentation of secure device onboarding.

### Step 1 - An Overview of FDO

[FDO, or FIDO Device Onboard](https://fidoalliance.org/specifications/download-iot-specifications/) is actually a specification for securely onboarding devices, specifically edge and IoT devices. It works to solve the fundamental challenge of "how do I know this edge device is mine, and hasn't been tampered with".

A few of the key design principles for FDO are:
- Leveraging standard tools for authentication and trust
- Compatibility with other tooling
- Hardware/platform agnostic
- Open specification
- "Late binding" - devices can be pre-configured without needing to know the final destination

Red Hat's implimentation integrates with the Device Edge stack to provide the ability to securely onboard Device Edge at remote sites.

### Step 2 - The Overall Workflow

![FDO Workflow](https://www.redhat.com/architect/sites/default/files/styles/embed_large/public/2022-09/FDO-schema_crop.png)

The FDO workflow involves 7 major steps:
1. The device manufacturer preps devices with the FDO client and certifcates, and creates an ownership voucher
2. The device manufacturer stores the ownership voucher and sends the device to its destination
3. The device owner boots the device
4. The devices calls out to the rendezvous server
5. The rendezvous server sends the information of the onboarding server
6. The device forms a secure channel with the onboarding server
7. The device grabs secrets and files, as well as automated configuration steps


### Step 3 - Creating the Ownership Voucher

![Ownership Voucher](https://www.redhat.com/architect/sites/default/files/styles/embed_large/public/2022-08/2ownershipvoucher.png)

In Red Hat's implimenation of FDO, the ownership voucher steps are handled by the `edge-simplified-installer`. We'll provide the address of our manufacturing server, and the installer will handle the rest while applying our image to the edge device.

### Step 4 - First Boot at Destination

![First Boot](https://www.redhat.com/architect/sites/default/files/styles/embed_large/public/2022-08/3summary.png)

Once the device has reached its destination, steps 3-7 from above happen. For our lab today, we'll be using the 'all-in-one' setup of FDO, so all the components will reside on the same system, however production implimentations will have the various functionality spread out across different systems.

### Special Thanks

A special thank you to [Luis Arizmendi Alonso](https://www.redhat.com/architect/users/luis-arizmendi) for his deep dives on FDO, which are referenced heavily throughout this workshop.

---
**Navigation**

[Previous Exercise](../2.5-aap-image-build) | [Next Exercise](../3.2-fdo-install-config)

[Click here to return to the Workshop Homepage](../README.md)
