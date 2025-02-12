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

For example, team1 would use the following to create a host within Controller for their virtual machine named `ft01`:
```yaml
{% raw %}
controller_hosts:
    # Display name
  - name: ft01
    # What inventory to add the host to
    inventory: team1 Process Control Systems
    variables:
      # FQDN from service
      ansible_host: ft01-winrm.team1.svc.cluster.local
{% endraw %}
```

With hosts defined under the `controller_hosts` variable, the Ansible collections outlined earlier will handle the creation of the hosts.

## Step 2 - Adding Hosts to Groups
In the same fashion, group membership within an inventory can be defined as code, and the Ansible collections will handle the configuration for us.

Since we've created two virtual machines with two distinct purposes, we can use groups to steer our automation to the right system.

In our case, one virtual machine will act as the primary domain controller, while the other will be a secondary or replica domain controller.

To place the virtual machines in the correct inventory, the following data structure will be used:

```yaml
{% raw %}
controller_groups:
  - name: factorytalk_controller
    inventory: team1 Process Control Systems
    hosts:
      - ft01
{% endraw %}
```

> Note:
>
> Team1 is used as an example here, replace with your team number.

## Step 3 - Committing the Code
For now, we can place the created variables into a file in our code repository, as we'll be referencing them later on.

Add all the variables from above, with the proper modifications for your team, into a file called `controller_configuration.yaml` in your code repository. Be sure to commit and push if using an IDE.

---
**Navigation**

[Previous Exercise](../3.1-contorller-as-code/) | [Next Exercise](../3.3-linking-to-automation/)

[Click here to return to the Workshop Homepage](../../README.md)
