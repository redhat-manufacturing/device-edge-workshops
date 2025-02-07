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

In our `controller-configuration.yaml` file, we can add the following to have our project be updated:
```yaml
controller_projects:
  - name: Code Repository
    organization: Team 5
    scm_branch: main
    scm_type: git
    scm_url: "YOUR_GIT_URL_HERE"
    update_project: true
    credential: team{{ number }} Code Repository Credentials
```

Here, we're telling a specific role within the Ansible collections to look for a project named `Code Repository`, in your team's organization, and trigger an update, and wait for it to complete.

## Step 2 - Adding Job Templates
Now, we need to create job templates, tied to our new playbooks, that contain some supporting configuration for running the automation we've created.

Same as before, we'll add more to our `controller-configuration.yaml` file:
```yaml
controller_templates:
  - name: Wait for Connectivity
    organization: Team 5
    project: Code Repository
    inventory: team5 FactoryTalk Infrastructure
    credentials:
      - Provisioning Machine Login
    playbook: playbooks/wait-for-connectivity.yaml
  - name: Set Base Configs
    organization: Team 5
    project: Code Repository
    inventory: team5 FactoryTalk Infrastructure
    credentials:
      - Provisioning Machine Login
    playbook: playbooks/set-base-configs.yaml    
  - name: Launch FactoryTalk SE Client Application
    organization: Team 5
    project: Code Repository
    inventory: team5 FactoryTalkInfrastructure
    credentials:
      - Provisioning Machine Login
    playbook: playbooks/launchFTview.yaml
    limit: primary_domain_controller
  - name: Launch Codesys IDE
    organization: Team 5
    project: Code Repository
    inventory: team5 FactoryTalkInfrastructure
    credentials:
      - provisioning Machine Login
    playbook: playbooks/launch-codesys-ide.yaml
  - name: Launch UA Expert
    organization: Team 5
    project: Code Repository
    inventory: team5 FactoryTalkInfrastructure
    credentials:
      - provisioning Machine Login
    playbook: playbooks/launch-ua-expert.yaml
```

Here, we've specified five job templates, tied to our five playbooks, with some additional information so Controller knows what playbook to run, and what inventory to run it against, optionally with a limit to a certain group.

In addition, credentials are specified, which will allow Ansible to log in to the Windows machines remotely, and perform the automation specified.


> Note:
>
> Team5 is used as an example here, replace with your team number.

## Step 3 - Adding a Workflow
Now, we can tie our job templates together using a workflow, allowing the job templates to be run in a specific sequence for an "end to end" experience.

Once again, adding to our `controller-configuration.yaml` file:
```yaml
controller_workflows:
  - name: Setup FactoryTalk Environment
    organization: Team 5
    simplified_workflow_nodes:
      - identifier: Wait for Connectivity
        unified_job_template: Wait for Connectivity
        success_nodes:
          - Set Base Configs
        lookup_organization: Team 5
      - identifier: Set Base Configs
        unified_job_template: Set Base Configs
        success_nodes:
          - Launch FactoryTalk SE Client Application
        lookup_organization: Team 5
      - identifier: Launch FactoryTalk SE Client Application
        unified_job_template: Launch FactoryTalk SE Client Application
        success_nodes:
          - Launch Codesys IDE
        lookup_organization: Team 5
      - identifier: Launch Codesys IDE
        unified_job_template: Launch Codesys IDE
        success_nodes:
          - Launch UA Expert
        lookup_organization: Team 5
      - indentifier: Launch UA Expert
        unified_job_template: Launch UA Expert
        lookup_organization: Team 5
```

Here, we're creating a single workflow, with 5 nodes, that correlate to our job templates above. This allows for Controller to handle running them in succession, instead of having to manually trigger them.

> Note:
>
> Team1 is used as an example here, replace with your team number.

## Step 4 - Adding a Workflow Launch
Finally, we'll want to add a last variable to our `controller-configuration.yaml` file to trigger a run of our newly created workflow.

Add the following to complete our file:
```yaml
controller_workflow_launch_jobs:
  - name: Setup FactoryTalk Environment
    organization: Team 5
```

> Note:
>
> Team 5 is used as an example here, replace with your team number

## Step 5 - Committing the Code
At this point, your `controller-configuration.yaml` file should contain the following:
```yaml
controller_hosts:
  - name: ft01
    inventory: team5 FactoryTalk Infrastructure
    variables:
      ansible_host: ft01-winrm.team1.svc.cluster.local

controller_groups:
  - name: primary_domain_controller
    inventory: team5 FactoryTalk  Infrastructure
    hosts:
      - ft01

controller_projects:
  - name: Code Repository
    organization: Team 5
    scm_branch: main
    scm_type: git
    scm_url: "YOUR_GIT_URL_HERE"
    update_project: true
    credential: team5 Code Repository Credentials

controller_templates:
  - name: Wait for Connectivity
    organization: Team 5
    project: Code Repository
    inventory: team5 FactoryTalk  Infrastructure
    credentials:
      - Provisioning Machine Login
    playbook: playbooks/wait-for-connectivity.yaml
  - name: Set Base Configs
    organization: Team 5
    project: Code Repository
    inventory: team5 FactoryTalk  Infrastructure
    credentials:
      - Provisioning Machine Login
    playbook: playbooks/set-base-configs.yaml    
  - name: Launch FactoryTalk SE Client Application
    organization: Team 5
    project: Code Repository
    inventory: team5 FactoryTalk  Infrastructure
    credentials:
      - Provisioning Machine Login
    playbook: playbooks/launchFTview.yaml
    limit: primary_domain_controller
  - name: Launch Codesys IDE
    organization: Team 5
    project: Code Repository
    inventory: team1 FactoryTalk  Infrastructure
    credentials:
      - primary_domain_controller
    playbook: playbooks/launch-codesys-ide.yaml
  - name: Launch UA Expert
    organization: Team 5
    project: Code Repository
    inventory: team1 FactoryTalk  Infrastructure
    credentials:
      - primary_domain_controller
    playbook: playbooks/launch-ua-expert.yaml

controller_workflows:
  - name: Setup FactoryTalk  Environment
    organization: Team 5
    simplified_workflow_nodes:
      - identifier: Wait for Connectivity
        unified_job_template: Wait for Connectivity
        success_nodes:
          - Set Base Configs
        lookup_organization: Team 5
      - identifier: Set Base Configs
        unified_job_template: Set Base Configs
        success_nodes:
          - Launch FactoryTalk SE Client Application
        lookup_organization: Team 5
      - identifier: Launch FactoryTalk SE Client Application
        unified_job_template: Launch FactoryTalk SE Client Application
        success_nodes:
          - Launch Codesys IDE
        lookup_organization: Team 5
      - identifier: Launch Codesys IDE
        unified_job_template: Launch Codesys IDE
        success_nodes: 
          - Launch UA Expert
        lookup_organization: Team 5
      - identifier: Launch UA Expert
        lookup_organization: Team 5

controller_workflow_launch_jobs:
  - name: Setup FactoryTalk Environment
    organization: Team 5
```

> Note:
>
> Team5 is used as an example here, replace with your team number

Ensure this file is saved/committed/pushed into your code repository, as it will be used in the next exercises.

---
**Navigation**

[Previous Exercise](../3.2-creating-hosts-and-groups/) | [Next Exercise](../3.4-appling-config-to-controller/)E

[Click here to return to the Workshop Homepage](../../README.md)
