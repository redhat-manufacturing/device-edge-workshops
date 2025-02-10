# Workshop Exercise 3.4 - Applying Configuration to Controller

## Table of Contents

* [Objective](#objective)
* [Step 1 - Creating a Job to Configure Controller](#step-1---creating-a-job-to-configure-controller)
* [Step 2 - Creating a Job and ConfigMap](#step-2---creating-a-job-and-configmap)
* [Step 3 - Creating a Job to Run a Workflow](#step-3---creating-a-job-to-run-a-workflow)

## Objective

* Understand how to apply configuration to Controller
* Merge declarative and procedural tooling

## Step 1 - Creating a Job to Configure Controller
These next two steps are the crux of this workshop: merging declarative and procedural tooling together to achieve a true end-to-end deployment, using the tools provided on top of a single platform.

Two key items will be used to handle this integration - k8s concepts, such as jobs and configmaps paired with ArgoCD hooks, and a shim container image using ansible-runner.

### Container Image using ansible-runner
Execution environments are container images, meaning they can be leveraged by Controller to execute automation, or run as simple containers in other environments to run automation.

To act as a shim between our declarative tooling (argoCD) and the procedural tooling (Controller), a container image has been built off of an execution environment that specifically looks for variables to go apply to Ansible Controller. Built into the image is a simple playbook:
```yaml
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
```

What this playbook does it load in variables from the `/runner/variables` directory, then run various roles that apply those variables to Controller.

Since this will be run as a kubernetes job, we have the option of mounting items into that directory, and the playbook will automatically pick them up for us.

### Jobs, ConfigMaps, and Sync Hooks
Since Controller doesn't take configuration declaratively like other k8s resources do, we'll need to run something that goes and applies our desired state to Controller.

Within kubernetes, we can use a job and a configmap to handle this, along with the image from above. In addition, we'll apply an annotation to signifiy when ArgoCD should trigger the job.

```yaml
---
apiVersion: batch/v1
kind: Job
metadata:
  name: configure-controller
  annotations:
    argocd.argoproj.io/hook: Sync
spec:
  template:
    spec:
      containers:
        - name: configure-controller
          image: quay.io/device-edge-workshops/configure-controller:latest
          volumeMounts:
            - name: controller-vars
              mountPath: /runner/variables
            - name: tmp
              mountPath: /tmp
      restartPolicy: OnFailure
      volumes:
        - name: controller-vars
          configMap:
            name: configure-controller-configmap
        - name: tmp
          emptyDir:
            sizeLimit: 100Mi
```

This job definition provides a few things:
- A job, using the image above
- Volume mount for a configMap into /runner/variables
- An emptydir so runner will succeed
- An annotation so ArgoCD knows when to run this as part of a sync

The next steps will wire these various elements up to provide our desired experience of merging declarative and procedural tooling.

## Step 2 - Creating a Job and ConfigMap
Return to the `active-directory` helm chart we created earlier, and in the `templates/` directory, we'll add two files.

First, create `job.yaml` with the following contents:
```yaml
---
apiVersion: batch/v1
kind: Job
metadata:
  generateName: configure-controller-
  annotations:
    argocd.argoproj.io/hook: Sync
spec:
  template:
    spec:
      containers:
        - name: configure-controller
          image: quay.io/device-edge-workshops/configure-controller:latest
          volumeMounts:
            - name: controller-vars
              mountPath: /runner/variables
            - name: tmp
              mountPath: /tmp
      restartPolicy: OnFailure
      volumes:
        - name: controller-vars
          configMap:
            name: configure-controller-configmap
        - name: tmp
          emptyDir:
            sizeLimit: 100Mi
```

Additionally, create a file named `configmap.yaml`. This is where we'll leverage the variables from our `configure-controller.yaml` file, with a bit of customization to match the configmap spec:
```yaml
---
# Replace team1 with your team's information!
apiVersion: v1
kind: ConfigMap
metadata:
  name: configure-controller-configmap
data:
  controller-configuration.yaml: |
    controller_hostname: REPLACE_WITH_CONTROLLER_URL_FROM_STUDENT_PAGE
    controller_username: REPLACE_WITH_CONTROLLER_USERNAME
    controller_password: REPLACE_WITH_CONTROLLER_PASSWORD
    controller_validate_certs: 'false'

    # Don't forget to replace with your team's information!
    controller_hosts:
      - name: ad01
        inventory: team1 Active Directory Infrastructure
        variables:
          ansible_host: ad01-winrm.team1.svc.cluster.local # HERE
      - name: ad02
        inventory: team1 Active Directory Infrastructure
        variables:
          ansible_host: ad02-winrm.team1.svc.cluster.local # HERE
    controller_groups:
      - name: primary_domain_controller
        inventory: team1 Active Directory Infrastructure
        hosts:
          - ad01
    # Ensure these match your team's information!
    controller_projects:
      - name: Code Repository
        organization: Team 1
        scm_branch: main
        scm_type: git
        scm_url: "YOUR_GIT_URL_HERE"
        update_project: true
        credential: team1 Code Repository Credentials
    controller_templates:
      - name: Wait for Connectivity
        organization: Team 1
        project: Code Repository
        inventory: team1 Active Directory Infrastructure
        credentials:
          - Provisioning Machine Login
        playbook: playbooks/wait-for-connectivity.yaml
      - name: Set Base Configs
        organization: Team 1
        project: Code Repository
        inventory: team1 Active Directory Infrastructure
        credentials:
          - Provisioning Machine Login
        playbook: playbooks/set-base-configs.yaml    
      - name: Create AD Forest
        organization: Team 1
        project: Code Repository
        inventory: team1 Active Directory Infrastructure
        credentials:
          - Provisioning Machine Login
        playbook: playbooks/create-ad-forest.yaml
        limit: primary_domain_controller
      - name: Configure Domain Controllers
        organization: Team 1
        project: Code Repository
        inventory: team1 Active Directory Infrastructure
        credentials:
          - Domain Administrator
        playbook: playbooks/configure-domain-controllers.yaml
    controller_workflows:
      - name: Setup Active Directory Environment
        organization: Team 1
        simplified_workflow_nodes:
          - identifier: Wait for Connectivity
            unified_job_template: Wait for Connectivity
            success_nodes:
              - Set Base Configs
            lookup_organization: Team 1
          - identifier: Set Base Configs
            unified_job_template: Set Base Configs
            success_nodes:
              - Create AD Forest
            lookup_organization: Team 1
          - identifier: Create AD Forest
            unified_job_template: Create AD Forest
            success_nodes:
              - Configure Domain Controllers
            lookup_organization: Team 1
          - identifier: Configure Domain Controllers
            unified_job_template: Configure Domain Controllers
            lookup_organization: Team 1
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
apiVersion: v1
kind: ConfigMap
metadata:
  name: automation-to-run-configmap
data:
  controller-configuration.yaml: |
    controller_hostname: REPLACE_WITH_CONTROLLER_URL_FROM_STUDENT_PAGE
    controller_username: REPLACE_WITH_CONTROLLER_USERNAME
    controller_password: REPLACE_WITH_CONTROLLER_PASSWORD
    controller_validate_certs: 'false'

    # Don't forget to change to your team's information!
    controller_workflow_launch_jobs:
      - name: Setup Active Directory Environment
        organization: Team 1
```

> Note:
>
> Team1 is used as an example here, replace with your team number

Then, add the following to the `job.yaml` file created earlier:
```yaml
---
apiVersion: batch/v1
kind: Job
metadata:
  generateName: run-automation-in-controller-
  annotations:
    argocd.argoproj.io/hook: PostSync
spec:
  template:
    spec:
      containers:
        - name: launch-automation
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
            name: automation-to-run-configmap
        - name: tmp
          emptyDir:
            sizeLimit: 100Mi
```

Ensure everything has been saved/committed/pushed before continuing.

---
**Navigation**

[Previous Exercise](../3.3-linking-to-automation/) | [Next Exercise](../4.1-resync-app/)

[Click here to return to the Workshop Homepage](../README.md)
