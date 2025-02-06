# Workshop Exercise 3.3 - Linking to Automation

## Table of Contents

* [Objective](#objective)
* [Step 1 - Defining a Project](#step-1---defining-a-project)
* [Step 2 - Adding Job Templates](#step-2---adding-job-templates)
* [Step 3 - Adding a Workflow](#step-3---adding-a-workflow)
* [Step 4 - Adding a Workflow Launch](#step-4---adding-a-workflow-launch)
* [Step 5 - Step 5 - Committing the Code](#step-5---committing-the-code)

## Objective

* Understand the data structure for controller configurations
* Tie various controller configurations to the pre-created AD automation

## Step 1 - Defining a Project
Normally, to connect Controller to a code repository, a project, and optionally, credentials, are used. To speed up the workshop flow, a project has been created for you linked to your code repository.

However, we do need to trigger a sync of the project, as we've added new code to the repo.

In our `controller_configuration_for_network_automation.yaml` file, we can add the following to have our project be updated:
```yaml
controller_projects:
  - name: Code Repository
    organization: Team 1
    scm_branch: main
    scm_type: git
    scm_url: "YOUR_GIT_URL_HERE"
    update_project: true
    credential: team{{ number }} Code Repository Credentials
```

Here, we're telling a specific role within the Ansible collections to look for a project named `Code Repository`, in your team's organization, and trigger an update, and wait for it to complete.

## Step 2 - Adding Job Templates
Now, we need to create job templates, tied to our new playbooks, that contain some supporting configuration for running the automation we've created.

Same as before, we'll add more to our `controller_configuration_for_network_automation.yaml` file:
```yaml
controller_templates:
  - name: Configure NTP
    organization: Team 1
    project: Code Repository
    inventory: team1 Network Infrastructure
    credentials:
      - Network Appliance Credentials
    playbook: playbooks/ntp.yaml
  - name: Setup SNMPv2
    organization: Team 1
    project: Code Repository
    inventory: team1 Network Infrastructure
    credentials:
      - Network Appliance Credentials
    playbook: playbooks/snmpv2.yaml
  - name: Set System Hostname
    organization: Team 1
    project: Code Repository
    inventory: team1 Network Infrastructure
    credentials:
      - Network Appliance Credentials
    playbook: playbooks/hostname.yaml
  - name: Configure VLAN Interfaces
    organization: Team 1
    project: Code Repository
    inventory: team1 Network Infrastructure
    credentials:
      - Network Appliance Credentials
    playbook: playbooks/vlan-interfaces.yaml
  - name: Configure Static Routes
    organization: Team 1
    project: Code Repository
    inventory: team1 Network Infrastructure
    credentials:
      - Network Appliance Credentials
    playbook: playbooks/static-routes.yaml
  - name: Configure OSPF
    organization: Team 1
    project: Code Repository
    inventory: team1 Network Infrastructure
    credentials:
      - Network Appliance Credentials
    playbook: playbooks/ospf.yaml
```

Here, we've specified five job templates, tied to our seven playbooks, with some additional information so Controller knows what playbook to run, and what inventory to run it against.

In addition, credentials are specified, which will allow Ansible to log in to the network appliance remotely, and perform the automation specified.

> Note:
>
> Team1 is used as an example here, replace with your team number.

## Step 3 - Adding a Workflow
Now, we can tie our job templates together using a workflow, allowing the job templates to be run in a specific sequence for an "end to end" experience.

Once again, adding to our `controller_configuration_for_network_automation.yaml` file:
```yaml
controller_workflows:
  - name: Run Network Automation
    organization: Team 1
    simplified_workflow_nodes:
      - identifier: Configure NTP
        unified_job_template: Configure NTP
        success_nodes:
          - Setup SNMPv2
        lookup_organization: Team 1
      - identifier: Setup SNMPv2
        unified_job_template: Setup SNMPv2
        success_nodes:
          - Set System Hostname
        lookup_organization: Team 1
      - identifier: Set System Hostname
        unified_job_template: Set System Hostname
        success_nodes:
          - Configure VLANs
        lookup_organization: Team 1
      - identifier: Configure VLAN Interfaces
        unified_job_template: Configure VLAN Interfaces
        lookup_organization: Team 1
        success_nodes:
          - Configure Static Routes
      - identifier: Configure Static Routes
        unified_job_template: Configure Static Routes
        lookup_organization: Team 1
        success_nodes:
          - Configure OSPF
      - identifier: Configure OSPF
        unified_job_template: Configure OSPF
        lookup_organization: Team 1
```

Here, we're creating a single workflow, with 7 nodes, that correlate to our job templates above. This allows for Controller to handle running them in succession, instead of having to manually trigger them.

> Note:
>
> Team1 is used as an example here, replace with your team number.

## Step 4 - Adding a Workflow Launch
Finally, we'll want to add a last variable to our `controller_configuration_for_network_automation.yaml` file to trigger a run of our newly created workflow.

Add the following to complete our file:
```yaml
controller_workflow_launch_jobs:
  - name: Run Network Automation
    organization: Team 1
```

> Note:
>
> Team1 is used as an example here, replace with your team number

## Step 5 - Committing the Code
At this point, your `controller_configuration_for_network_automation.yaml` file should contain the following:
```yaml
controller_hosts:
  - name: cisco-8000v
    inventory: team1 Network Infrastructure
    variables:
      ansible_host: cisco-8000v-ssh.team1.svc.cluster.local

controller_groups:
  - name: cisco_ios
    inventory: team1 Network Infrastructure
    hosts:
      - cisco-8000v

controller_credentials:
  - name: Network Appliance Credentials
    organization: Team 1
    credential_type: Machine
    inputs:
      username: ansible
      password: PASSWORDSETEARLIER

controller_projects:
  - name: Code Repository
    organization: Team 1
    scm_branch: main
    scm_type: git
    scm_url: "YOUR_GIT_URL_HERE"
    update_project: true
    credential: team{{ number }} Code Repository Credentials

controller_templates:
  - name: Configure NTP
    organization: Team 1
    project: Code Repository
    inventory: team1 Network Infrastructure
    credentials:
      - Network Appliance Credentials
    playbook: playbooks/ntp.yaml
  - name: Setup SNMPv2
    organization: Team 1
    project: Code Repository
    inventory: team1 Network Infrastructure
    credentials:
      - Network Appliance Credentials
    playbook: playbooks/snmpv2.yaml
  - name: Set System Hostname
    organization: Team 1
    project: Code Repository
    inventory: team1 Network Infrastructure
    credentials:
      - Network Appliance Credentials
    playbook: playbooks/hostname.yaml
  - name: Configure VLAN Interfaces
    organization: Team 1
    project: Code Repository
    inventory: team1 Network Infrastructure
    credentials:
      - Network Appliance Credentials
    playbook: playbooks/vlan-interfaces.yaml
  - name: Configure Static Routes
    organization: Team 1
    project: Code Repository
    inventory: team1 Network Infrastructure
    credentials:
      - Network Appliance Credentials
    playbook: playbooks/static-routes.yaml
  - name: Configure OSPF
    organization: Team 1
    project: Code Repository
    inventory: team1 Network Infrastructure
    credentials:
      - Network Appliance Credentials
    playbook: playbooks/ospf.yaml

controller_workflows:
  - name: Run Network Automation
    organization: Team 1
    simplified_workflow_nodes:
      - identifier: Configure NTP
        unified_job_template: Configure NTP
        success_nodes:
          - Setup SNMPv2
        lookup_organization: Team 1
      - identifier: Setup SNMPv2
        unified_job_template: Setup SNMPv2
        success_nodes:
          - Set System Hostname
        lookup_organization: Team 1
      - identifier: Set System Hostname
        unified_job_template: Set System Hostname
        success_nodes:
          - Configure VLAN Interfaces
        lookup_organization: Team 1
      - identifier: Configure VLAN Interfaces
        unified_job_template: Configure VLAN Interfaces
        lookup_organization: Team 1
        success_nodes:
          - Configure Static Routes
      - identifier: Configure Static Routes
        unified_job_template: Configure Static Routes
        lookup_organization: Team 1
        success_nodes:
          - Configure OSPF
      - identifier: Configure OSPF
        unified_job_template: Configure OSPF
        lookup_organization: Team 1

controller_workflow_launch_jobs:
  - name: Run Network Automation
    organization: Team 1
```

> Note:
>
> Team1 is used as an example here, replace with your team number

Ensure this file is saved/committed/pushed into your code repository, as it will be used in the next exercises.

---
**Navigation**

[Previous Exercise](../3.2-creating-hosts-and-groups/) | [Next Exercise](../4.1-initializing-chart/)

[Click here to return to the Workshop Homepage](../../README.md)
