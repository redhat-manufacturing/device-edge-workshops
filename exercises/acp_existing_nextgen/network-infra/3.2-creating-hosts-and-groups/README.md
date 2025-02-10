# Workshop Exercise 3.2 - Creating Hosts and Groups

## Table of Contents

* [Objective](#objective)
* [Step 1 - Defining Hosts in an Inventory](#step-1---defining-hosts-in-an-inventory)
* [Step 2 - Adding Hosts to Groups](#step-2---adding-hosts-to-groups)
* [Step 3 - Adding Credentials](#step-3---adding-credentials)
* [Step 4 - Committing the Code](#step-3---committing-the-code)

## Objective

* Understand the data structure for controller configurations
* Push a starting controller configuration into a code repository that defines hosts and groups

## Step 1 - Defining Hosts in an Inventory
The pervious exercise laid out the resources that will be used to interact with the Controller API, so all we need to do is define what we'd like applied to Controller.

To start, we can define hosts, which point Ansible at the services created earlier - allowing Controller to use the service to communicate with the virtual machines.

For example, team1 would use the following to create a host within Controller for their network appliance named `cisco-8000v`:
```yaml
controller_hosts:
    # Display name
  - name: cisco-8000v
    # What inventory to add the host to
    inventory: team1 Network Infrastructure
    variables:
      # FQDN from service
      ansible_host: cisco-8000v-ssh.team1.svc.cluster.local
```

With hosts defined under the `controller_hosts` variable, the Ansible collections outlined earlier will handle the creation of the hosts.

Add this to a new file in your code repository named `controller_configuration_for_network_automation.yaml` for safe keeping.

## Step 2 - Adding Hosts to Groups
In the same fashion, group membership within an inventory can be defined as code, and the Ansible collections will handle the configuration for us.

Since we've created two virtual machines with two distinct purposes, we can use groups to steer our automation to the right system.

In our case, one virtual machine will act as the primary domain controller, while the other will be a secondary or replica domain controller.

To place the virtual machines in the correct inventory, the following data structure will be used:

```yaml
controller_groups:
  - name: cisco_ios
    inventory: team1 Network Infrastructure
    hosts:
      - cisco-8000v
```

> Note:
>
> Team1 is used as an example here, replace with your team number.

Add this to your existing file named `controller_configuration_for_network_automation.yaml`.

## Step 3 - Adding Credentials
Earlier, we configured our network appliance with a admin user, and set a password for local authentication. Now, we're going to create the appropriate credentials in Controller to allow for authentication to the network appliance.

Adding to our `controller_configuration_for_network_automation.yaml` file:

```yaml
controller_credentials:
  - name: Network Appliance Credentials
    organization: Team 1
    credential_type: Machine
    inputs:
      username: ansible
      password: PASSWORDSETEARLIER
```

Be sure to save the file when done editing.

## Step 4 - Committing the Code
For now, we can place the created variables into a file in our code repository, as we'll be referencing them later on.

Add all the variables from above, with the proper modifications for your team, into a file called `controller_configuration_for_network_automation.yaml` in your code repository. Be sure to commit and push if using an IDE.

---
**Navigation**

[Previous Exercise](../3.1-controller-as-code/) | [Next Exercise](../3.3-linking-to-automation/)

[Click here to return to the Workshop Homepage](../../README.md)
