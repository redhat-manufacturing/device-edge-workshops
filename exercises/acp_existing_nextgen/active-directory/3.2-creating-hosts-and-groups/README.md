# Workshop Exercise 3.2 - Creating Hosts and Groups

## Table of Contents

* [Objective](#objective)
* [Step 1 - Defining Hosts in an Inventory](#step-1---defining-hosts-in-an-inventory)
* [Step 2 - Adding Hosts to Groups](#step-2---adding-hosts-to-groups)
* [Step 3 - Committing the Code](#step-3---committing-the-code)

## Objective

* Understand the data structure for controller configurations
* Push a starting controller configuration into a code repository that defines hosts and groups

## Step 1 - Defining Hosts in an Inventory
The previous exercise laid out the resources that will be used to interact with the Controller API, so all we need to do is define what we'd like applied to Controller.

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
  - name: ad02
    inventory: team1 Active Directory Infrastructure
    variables:
      ansible_host: ad02-winrm.team1.svc.cluster.local
```

With hosts defined under the `controller_hosts` variable, the Ansible collections outlined earlier will handle the creation of the hosts.

We're going to be adding additional information to complete our controller configuration, so create a new file named `controller_configuration.yaml` in your code repo, and add content to it as you complete the following exercises.

> Note:
>
> We won't actually use this file, but we will use the contents later on. Thus, the location of the file doesn't matter - just put it at the root of the repository for safe-keeping.

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
```

> Note:
>
> Team1 is used as an example here, replace with your team number.

## Step 3 - Committing the Code
For now, we can place the created variables into a file in our code repository, as we'll be referencing them later on.

Add all the variables from above, with the proper modifications for your team, into a file called `controller_configuration.yaml` in your code repository. Be sure to commit and push if using an IDE.

---
**Navigation**

[Previous Exercise](../3.1-controller-as-code/) | [Next Exercise](../3.3-linking-to-automation/)

[Click here to return to the Workshop Homepage](../../README.md)
