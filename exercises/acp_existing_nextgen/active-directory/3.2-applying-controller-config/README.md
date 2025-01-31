# Workshop Exercise 2.1 - Defining Controller Configuration as Code

## Table of Contents

* [Objective](#objective)
* [Guide](#guide)
   * [Your Lab Environment](#your-lab-environment)
   * [Completing the Exercises](#completing-the-exercises)

## Objective

* Understand the data structure for controller configurations
* Push a starting controller configuration into a code repository

## Step 1 - Defining Hosts in an Inventory
The pervious exercise laid out the resources that will be used to interact with the Controller API, so all we need to do is define what we'd like applied to Controller.

To start, we can define hosts, which point Ansible at the services created earlier - allowing Controller to use the service to communicate with the virtual machines.

For example, team1 would use the following to create a host within Controller for their virtual machine named `ad01`:
```yaml
controller_hosts:
    # Display name
  - name: ad01
    # What inventory to add the host to
    inventory: team1 Active Directory Infrastructure
    variables:
      # FQDN from service
      ansible_host: ad01-winrm.team1.svc.cluster.local
```

With hosts defined under the `controller_hosts` variable, the Ansible collections outlined earlier will handle the creation of the hosts.

## Step 2 - Adding Hosts to Groups
In the same fashion, group membership within an inventory can be defined as code, and the Ansible collections will handle the configuration for us.

Since we've created two virtual machines with two distinct purposes, we can use groups to steer our automation to the right system.

In our case, one virtual machine will act as the primary domain controller, while the other will be a secondary or replica domain controller.

To place the virtual machines in the correct inventory, the following data structure will be used:

```yaml
controller_groups:
  - name: primary_domain_controller
    inventory: team1 Active Directory Infrastructure
    hosts:
      - ad01
  - name: secondary_domain_controller
    inventory: team1 Active Directory Infrastructure
    hosts:
      - ad02
```

> Note:
>
> Team1 is used as an example here, replace with your team number.

## Step 3 - Committing the Code
For now, we can place the created variables into a file in our code repository, as we'll be referencing them later on.

Add all the variables from above, with the proper modifications for your team, into a file called `controller_configuration.yaml` in your code repository.

ADD PICTURES HERE

---
**Navigation**

[Next Exercise](../1.2-student-pages/)

[Click here to return to the Workshop Homepage](../README.md)
