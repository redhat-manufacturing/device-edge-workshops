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
  name: configure-network-automation
  annotations:
    argocd.argoproj.io/hook: Sync
spec:
  template:
    spec:
      containers:
        - name: configure-network-automation
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
            name: configure-network-automation-configmap
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
  generateName: configure-network-automation-
  annotations:
    argocd.argoproj.io/hook: Sync
spec:
  template:
    spec:
      containers:
        - name: configure-network-automation
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
            name: configure-network-automation-configmap
        - name: tmp
          emptyDir:
            sizeLimit: 100Mi
```

Additionally, create a file named `configmap.yaml`. This is where we'll leverage the variables from our `configure-controller.yaml` file, with a bit of customization to match the configmap spec:
```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: configure-network-automation-configmap
data:
  controller-configuration.yaml: |
    controller_hostname: REPLACE_WITH_CONTROLLER_URL_FROM_STUDENT_PAGE
    controller_username: REPLACE_WITH_CONTROLLER_USERNAME
    controller_password: REPLACE_WITH_CONTROLLER_PASSWORD
    controller_validate_certs: 'false'

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
      - name: Setup SNMPv3
        organization: Team 1
        project: Code Repository
        inventory: team1 Network Infrastructure
        credentials:
          - Network Appliance Credentials
        playbook: playbooks/snmpv3.yaml
      - name: Setup SNMPv2
        organization: Team 1
        project: Code Repository
        inventory: team1 Network Infrastructure
        credentials:
          - Network Appliance Credentials
        playbook: playbooks/snmpv2.yaml
      - name: Configure VLANs
        organization: Team 1
        project: Code Repository
        inventory: team1 Network Infrastructure
        credentials:
          - Network Appliance Credentials
        playbook: playbooks/vlans.yaml
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
          - identifier: Configure Router Hostname
            unified_job_template: Configure Router Hostname
            success_nodes:
              - Configure NTP
            lookup_organization: Team 1
          - identifier: Configure NTP
            unified_job_template: Configure NTP
            success_nodes:
              - Setup SNMPv2
            lookup_organization: Team 1
          - identifier: Setup SNMPv2
            unified_job_template: Setup SNMPv2
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
  name: network-automation-to-run-configmap
data:
  controller-configuration.yaml: |
    controller_hostname: REPLACE_WITH_CONTROLLER_URL_FROM_STUDENT_PAGE
    controller_username: REPLACE_WITH_CONTROLLER_USERNAME
    controller_password: REPLACE_WITH_CONTROLLER_PASSWORD
    controller_validate_certs: 'false'

    controller_workflow_launch_jobs:
      - name: Run Network Automation
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
  generateName: run-network-automation-in-controller-
  annotations:
    argocd.argoproj.io/hook: PostSync
spec:
  template:
    spec:
      containers:
        - name: launch-network-automation
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
            name: network-automation-to-run-configmap
        - name: tmp
          emptyDir:
            sizeLimit: 100Mi
```

Ensure everything has been saved/committed/pushed before continuing.

---
**Navigation**

[Previous Exercise](../4.1-initializing-chart/) | [Next Exercise](../5.1-sync-app)

[Click here to return to the Workshop Homepage](../README.md)
