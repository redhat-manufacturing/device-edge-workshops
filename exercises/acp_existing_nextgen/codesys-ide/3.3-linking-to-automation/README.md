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
{% raw %}
controller_projects:
  - name: Code Repository
    organization: Team 5
    scm_branch: main
    scm_type: git
    scm_url: "YOUR_GIT_URL_HERE"
    update_project: true
    credential: team{{ number }} Code Repository Credentials
{% endraw %}
```

Here, we're telling a specific role within the Ansible collections to look for a project named `Code Repository`, in your team's organization, and trigger an update, and wait for it to complete.

## Step 2 - Adding Job Templates
Now, we need to create job templates, tied to our new playbooks, that contain some supporting configuration for running the automation we've created.

Same as before, we'll add more to our `controller-configuration.yaml` file:
```yaml
{% raw %}
controller_projects:
  - name: Code Repository
    organization: Team 1
    scm_branch: main
    scm_type: git
    scm_url: https://gitea-student-services.apps.acp.rh1.redhat-workshops.com/rh1/team1-code.git
    update_project: true
    credential: team1 Code Repository Credentials

controller_templates:
  - name: Wait for Connectivity
    organization: Team 1
    project: Code Repository
    inventory: team1 Process Control Systems
    credentials:
      - FTView Credentials
    playbook: playbooks/wait-for-connectivity.yaml
  - name: Set autostart script of Codesys IDE
    organization: Team 1
    project: Code Repository
    inventory: team1 Process Control Systems
    credentials:
      - FTView Credentials
    playbook: playbooks/set-startup-script1.yaml    
  - name: Set auto-login for windows1
    organization: Team 1
    project: Code Repository
    inventory: team1 Process Control Systems
    credentials:
      - FTView Credentials
    playbook: playbooks/set-default-user1.yaml
{% endraw %}
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
{% raw %}
controller_workflows:
  - name: Setup Codesys Environment
    organization: Team 1
    simplified_workflow_nodes:
      - identifier: Wait for Connectivity
        unified_job_template: Wait for Connectivity
        success_nodes:
           - Set Start-up Script1
        lookup_organization: Team 1
       - identifier: Set Start-up Script1
        unified_job_template: Set autostart script of UaExpert
        success_nodes:
          - Set auto-login for windows1
        lookup_organization: Team 1
       - identifier: Set auto-login for windows1
        unified_job_template: Set auto-login for windows1
        lookup_organization: Team 1
{% endraw %}
```

Here, we're creating a single workflow, with 5 nodes, that correlate to our job templates above. This allows for Controller to handle running them in succession, instead of having to manually trigger them.

> Note:
>
> Team1 is used as an example here, replace with your team number.

## Step 4 - Adding a Workflow Launch
Finally, we'll want to add a last variable to our `controller-configuration.yaml` file to trigger a run of our newly created workflow.

Add the following to complete our file:
```yaml
{% raw %}
controller_workflow_launch_jobs:
  - name: Setup Codesys Environment
    organization: Team 5
{% endraw %}
```

> Note:
>
> Team 5 is used as an example here, replace with your team number

## Step 5 - Committing the Code
At this point, your `controller-configuration.yaml` file should contain the following:
```yaml
{% raw %}
controller_hosts:
    # Display name
  - name: cs01
    # What inventory to add the host to
    inventory: team1 Process Control Systems
    variables:
      # FQDN from service
      ansible_host: cs01-winrm.team1.svc.cluster.local

controller_groups:
  - name: codesys_controller
    inventory: team1 Process Control Systems
    hosts:
      - cs01

controller_projects:
  - name: Code Repository
    organization: Team 1
    scm_branch: main
    scm_type: git
    scm_url: https://gitea-student-services.apps.acp.rh1.redhat-workshops.com/rh1/team1-code.git
    update_project: true
    credential: team{{ number }} Code Repository Credentials

controller_templates:
   - name: Wait for Connectivity
     organization: Team 1
     project: Code Repository
     inventory: team1 Process Control Systems
     credentials:
      - FTView Credentials
     playbook: playbooks/wait-for-connectivity.yaml 
  - name: Set autostart script of UaExpert
     organization: Team 1
     project: Code Repository
     inventory: team1 Process Control Systems
     credentials:
      - FTView Credentials
     playbook: playbooks/set-start-up-script.yaml
     limit: primary_ftview
   - name: Set auto-login for windows
     organization: Team 1
     project: Code Repository
     inventory: team1 Process Control Systems
     credentials:
      - FTView Credentials
     playbook: playbooks/set-default-user.yaml
     limit: primary_ftview

controller_workflows:
  - name: Setup Codesys Environment
    organization: Team 1
    simplified_workflow_nodes:
      - identifier: Wait for Connectivity
        unified_job_template: Wait for Connectivity
        success_nodes:
          - Set Start-up Script
        lookup_organization: Team 1
      - identifier: Set Start-up Script
        unified_job_template: Set autostart script of UaExpert
        success_nodes:
          - Set auto-login for windows
        lookup_organization: Team 1
      - identifier: Set auto-login for windows
        unified_job_template: Set auto-login for windows
        lookup_organization: Team 1

controller_workflow_launch_jobs:
  - name: Setup Codesys Environment
    organization: Team 1
{% endraw %}
```

> Note:
>
> Team 1 is used as an example here, replace with your team number

Ensure this file is saved/committed/pushed into your code repository, as it will be used in the next exercises.

---
**Navigation**

[Previous Exercise](../3.2-creating-hosts-and-groups/) | [Next Exercise](../3.4-appling-config-to-controller/)

[Click here to return to the Workshop Homepage](../../README.md)
