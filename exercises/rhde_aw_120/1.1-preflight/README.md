# Workshop Exercise - Preflight Checks

## Table of Contents

* [Objective](#objective)
* [Guide](#guide)
   * [Your Lab Environment](#your-lab-environment)
   * [Step 1 - Edge Device vs Virtual Device](#step-1---edge-device-vs-virtual-device)
   * [Step 2 - Investigating the Edge Device](#step-2---investigating-the-edge-device)
   * [Step 3 - Accessing the Virtual Device Host](#step-3---accessing-the-virtual-device-host)

## Objective

* Understand the lab topology, provided hardware (if applicable), and how to access virtual instances (again, if applicable).
* Understand how to work the workshop exercises.

These first few lab exercises will be exploring the lab and gathering baseline information for use in later excercises.

## Guide

### Your Lab Environment

In this lab you work in a pre-configured lab environment. You will have access to the following services:

| Service | Purpose |
| --- | --- |
| Ansible Controller | Automation controller for running Ansible automation |
| Gitea Source Control | SCM with a webUI for code storage |
| CDN Mirrors | Local copies of the appropriate CDN repos |
| rpm-osree Repo | Repo with various versions of an edge image available over an http server |

Since this is a shortened lab, the Image Builder related steps have already been completed, and images are hosted and ready for consumption.

> Note: If you need more information on new Ansible Automation Platform components bookmark this landing page [https://red.ht/AAP-20](https://red.ht/AAP-20)

### Step 1 - Edge Device vs Virtual Device

- If physical devices are available at your lab station, proceed to [Step 2 - Investigating the Edge Device](#step-2---using-the-terminal)
- If a physical device is not available at your lab station, proceed to [Step 3 - Accessing the Virtual Device Host](#step-3---accessing-the-virtual-device-host)

### Step 2 - Investigating the Edge Device

- A device should be available at your station, along with the usual swite of peripherals (keyboard, mouse, monitor, cables).
- There may be doubling up of students to devices depending on availability.

### Step 3 - Accessing the Virtual Device Host

A baremetal instance has been created in RHPDS that will host virtual instances meant to represent an edge device. Ask the lab instructor to provide login and authentication details.

<table>
<thead>
  <tr>
    <th>It is highly encouraged to use the Cockpit web interface to complete the workshop exercises. Cockpit provides:
    <ul>
    <li>An easy to access interface to managing virtual machines running on RHEL</li>
    <li>Tooling for creating, starting, and stopping virtual machines</li>
    <li>A web based console for bootstraping and troubleshooting</li>
    </ul>
    SSH access may be available as a backup, which provides access to the underlying tooling (such as virsh).
</th>
</tr>
</thead>
</table>

---
**Navigation**

[Next Exercise](../1.2-controller-intro)

[Click here to return to the Workshop Homepage](../README.md)