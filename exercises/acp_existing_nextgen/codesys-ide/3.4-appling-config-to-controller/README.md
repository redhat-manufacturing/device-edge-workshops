# Workshop Exercise 3.4 - Applying Configuration to Controller

## Table of Contents

* [Objective](#objective)
* [Step 1 - Creating a Job to Configure Controller](#step-1---creating-a-job-to-configure-controller)
* [Step 2 - Creating a Job and ConfigMap](#step-2---creating-a-job-and-configmap)
* [Step 3 - Creating a Job to Run a Workflow](#step-3---creating-a-job-to-run-a-workflow)

## Objective

* Understand how to apply configuration to Controller
* Merge declarative and prodecural tooling

## Step 1 - Creating a Job to Configure Controller
These next two steps are the crux of this workshop: merging declarative and procedural tooling together to achieve a true end-to-end deployment, using the tools provided on top of a single platform.

Two key items will be used to handle this integration - k8s concepts, such as jobs and configmaps paired with ArgoCD hooks, and a shim container image using ansible-runner.

### Container Image using ansible-runner
Execution environments are container images, meaning they can be leveraged by Controller to execute automation, or run as simple containers in other environments to run automation.

To act as a shim between our declarative tooling (argoCD) and the procedural tooling (Controller), a container image has been built off of an execution environment that specifically looks for variables to go apply to Ansible Controller. Built into the image is a simple playbook:
```yaml
{% raw %}
---
- name: Configure Ansible Automation Platform
  hosts:
    - all
  gather_facts: false
  connection: local
  vars:
    controller_configuration_secure_logging: false
    aap_configuration_secure_logging: false
  pre_tasks:
    - name: Import variables from /runner/variables
      ansible.builtin.include_vars:
        dir: /runner/variables
  tasks:
    - name: Include when needed
      ansible.builtin.include_role:
        name: redhat_cop.controller_configuration.license
      when:
        - controller_license is defined
        
    - name: Include organizations role
      ansible.builtin.include_role:
        name: redhat_cop.controller_configuration.organizations
      when:
        - controller_organizations is defined

    - name: Include users role
      ansible.builtin.include_role:
        name: redhat_cop.controller_configuration.users
      when:
        - controller_users is defined

    - name: Include roles role
      ansible.builtin.include_role:
        name: redhat_cop.controller_configuration.roles
      when:
        - controller_roles is defined

    - name: Include credentials role
      ansible.builtin.include_role:
        name: redhat_cop.controller_configuration.credentials
      when:
        - controller_credentials is defined

    - name: Include projects role
      ansible.builtin.include_role:
        name: redhat_cop.controller_configuration.projects
      when:
        - controller_projects is defined

    - name: Include inventories role
      ansible.builtin.include_role:
        name: redhat_cop.controller_configuration.inventories
      when:
        - controller_inventories is defined

    - name: Include hosts role
      ansible.builtin.include_role:
        name: redhat_cop.controller_configuration.hosts
      when:
        - controller_hosts is defined

    - name: Include groups role
      ansible.builtin.include_role:
        name: redhat_cop.controller_configuration.groups
      when:
        - controller_groups is defined

    - name: Include job_templates role
      ansible.builtin.include_role:
        name: redhat_cop.controller_configuration.job_templates
      when:
        - controller_templates is defined

    - name: Include workflow_job_templates role
      ansible.builtin.include_role:
        name: redhat_cop.controller_configuration.workflow_job_templates
      when:
        - controller_workflows is defined

    - name: Include workflow_launch role
      ansible.builtin.include_role:
        name: redhat_cop.controller_configuration.workflow_launch
      when:
        - controller_workflow_launch_jobs is defined
{% endraw %}
```

What this playbook does it load in variables from the `/runner/variables` directory, then run various roles that apply those variables to Controller.

Since this will be run as a kubernetes job, we have the option of mounting items into that directory, and the playbook will automatically pick them up for us.

### Jobs, ConfigMaps, and Sync Hooks
Since Controller doesn't take configuration declaratively like other k8s resources do, we'll need to run something that goes and applies our desired state to Controller.

Within kubernetes, we can use a job and a configmap to handle this, along with the image from above. In addition, we'll apply an annotation to signifiy when ArgoCD should trigger the job.

```yaml
{% raw %}
---
apiVersion: batch/v1
kind: Job
metadata:
  generateNamename: configure-codesys-automation-
  annotations:
    argocd.argoproj.io/hook: Sync
spec:
  template:
    spec:
      containers:
        - name: configure-ftview-automation
          image: quay.io/device-edge-workshops/configure-controller:2.0.1
          volumeMounts:
            - name: controller-vars
              mountPath: /runner/variables
            - name: tmp
              mountPath: /tmp
      restartPolicy: OnFailure
      volumes:
        - name: controller-vars
          configMap:
            name: configure-codesys-automation-configmap
        - name: tmp
          emptyDir:
            sizeLimit: 100Mi
{% endraw %}
```

This job definition provides a few things:
- A job, using the image above
- Volume mount for a configMap into /runner/variables
- An emptydir so runner will succeed
- An annotation so ArgoCD knows when to run this as part of a sync

The next steps will wire these various elements up to provide our desired experience of merging declarative and procedural tooling.

## Step 2 - Creating a Job and ConfigMap
Return to the `codesys` helm chart we created earlier, and in the `templates/` directory, we'll add two files.

First, create `job.yaml` with the following contents:
```yaml
{% raw %}
---
apiVersion: batch/v1
kind: Job
metadata:
  generateName: run-automation-codesys-
  annotations:
    argocd.argoproj.io/hook: PostSync
spec:
  template:
    spec:
      containers:
        - name: launch-automation-codesys
          image: quay.io/device-edge-workshops/configure-controller:latest
          volumeMounts:
            - name: automation-to-run-vars
              mountPath: /runner/variables
            - name: tmp
              mountPath: /tmp
      restartPolicy: Never
      volumes:
        - name: automation-to-run-vars
          configMap:
            name: codesys-automation-to-run-configmap
        - name: tmp
          emptyDir:
            sizeLimit: 100Mi
{% endraw %}
```

Additionally, create a file named `configmap.yaml`. This is where we'll leverage the variables from our `configure-controller.yaml` file, with a bit of customization to match the configmap spec:
```yaml
{% raw %}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: configure-codesys-automation-configmap
data:
  controller-configuration.yaml: |
    controller_hostname: https://controller-student-services.apps.acp.rh1.redhat-workshops.com
    controller_username: student5
    controller_password: 'R3dh4t123!'
    controller_validate_certs: 'false'
    controller_hosts:
      - name: cs01
        inventory: team1 Process Control Systems
        variables:
          ansible_host: cs01-winrm.team1.svc.cluster.local


    controller_groups:
      - name: primary_codesys
        inventory: team1 Process Control Systems
        hosts:
          - cs01

    controller_credentials:
      - name: Codesys Credentials
        organization: Team 1
        credential_type: Machine
        inputs:
          username: Administrator
          password: 'R3dh4t123!'


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
{% endraw %}
```

This configmap will take our desired controller configuration we built in the previous exercises, and mount it into a file called `controller-configuration.yaml`, located in `/runner/variables` within the container. Then, the embedded automation will read it in, and apply our desired configuration.

Ensure you've replaced the variables at the top with the correct values, so the automation knows how to authenticate with controller.

> Note:
>
> Team1 is used as an example here, replace with your team number

## Step 3 - Creating a Job to Run a Workflow
Following the idea from above, we're going to create another set of a job and configmap, however, this time we'll only specify what automation we want to run, and set the job to happen after everything else has been synced.

First, our configmap - simply add this to the bottom of the existing `configmap.yaml` file in the `templates/` directory:
```yaml
---
{% raw %}
apiVersion: v1
kind: ConfigMap
metadata:
  name: codesys-automation-to-run-configmap
data:
  controller-configuration.yaml: |
    controller_hostname: REPLACE_WITH_CONTROLLER_URL_FROM_STUDENT_PAGE
    controller_username: REPLACE_WITH_CONTROLLER_USERNAME
    controller_password: REPLACE_WITH_CONTROLLER_PASSWORD
    controller_validate_certs: 'false'
    controller_workflow_launch_jobs:
      - name: Setup Codesys Environment
        organization: Team 1
{% endraw %}
```

> Note:
>
> Team1 is used as an example here, replace with your team number

Then, add the following to the `job.yaml` file created earlier:
```yaml
{% raw %}
---
apiVersion: batch/v1
kind: Job
metadata:
  generateName: run-automation-codesys-
  annotations:
    argocd.argoproj.io/hook: PostSync
spec:
  template:
    spec:
      containers:
        - name: launch-automation-codesys
          image: quay.io/device-edge-workshops/configure-controller:latest
          volumeMounts:
            - name: automation-to-run-vars
              mountPath: /runner/variables
            - name: tmp
              mountPath: /tmp
      restartPolicy: Never
      volumes:
        - name: automation-to-run-vars
          configMap:
            name: codesys-automation-to-run-configmap
        - name: tmp
          emptyDir:
            sizeLimit: 100Mi
{% endraw %}
```

Ensure everything has been saved/committed/pushed before continuing.

---
**Navigation**

[Previous Exercise](../3.3-linking-to-automation/) | [Next Exercise](../4.1-resync-app/)

[Click here to return to the Workshop Homepage](../README.md)
