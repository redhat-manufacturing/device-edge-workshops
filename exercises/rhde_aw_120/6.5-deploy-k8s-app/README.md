# Workshop Exercise 6.4 - App Definitions

## Table of Contents

* [Objective](#objective)
* [Step 1 - Creating the Bootstrap Automation](#step-1---crafting-our-kubernetes-yaml)
* [Step 2 - Adding Our Pull Secret to Ansible Controller](#step-2---adding-our-pull-secret-to-ansible-controller)
* [Step 3 - Creating a Job Template](#step-3---creating-a-job-template)
* [Step 4 - Running the Job Template](#step-4---running-the-job-template)
* [Solutions](#solutions)

## Objective

Now that we have the definitions for our application deployment, we're going to let Ansible do the heavy lifting.

The following automation will:
1. Slurp up the kubeconfig file from our edge device
2. Create a namespace
3. Push out our definitions

### Step 1 - Creating Our Playbook

Return to your code repo and create a new file at `playbooks/deploy-k8s-app.yml` with the following contents:
{% raw %}
```yaml
---

- name: deploy application to k8s
  hosts:
    - all
  module_defaults:
    kubernetes.core.k8s:
      kubeconfig: /tmp/kubeconfig
      validate_certs: false
  pre_tasks:
    - name: slurp up kubeconfig
      ansible.builtin.slurp:
        path: /var/lib/microshift/resources/kubeadmin/kubeconfig
      register: kubeconfig_raw
      become: true
    - name: create kubeconfig
      ansible.builtin.copy:
        content: "{{ (kubeconfig_raw['content'] | b64decode).replace('127.0.0.1', ansible_host) }}"
        dest: /tmp/kubeconfig
  tasks:
    - name: make calls from localhost
      delegate_to: localhost
      block:
        - name: create namespace
          kubernetes.core.k8s:
            name: process-control
            kind: Namespace
            state: present
        - name: apply definitions
          kubernetes.core.k8s:
            namespace: process-control
            definition: "{{ lookup('file', yaml_file) | from_yaml }}"
          loop:
            - files/mqtt-service.yaml
            - files/mqtt-deployment.yaml
            - files/simulate-deployment.yaml
            - files/control-deployment.yaml
            - files/ui-service.yaml
            - files/ui-deployment.yaml
          loop_control:
            loop_var: yaml_file
```
{% endraw %}

This playbook handles grabbing the kubeconfig, setting the correct cluster address, then deploys our application.

Remember to push your new playbook up to Gitea.

### Step 2 - Creating a Job Template

> Note:
>
> Be sure to sync your project in Controller before attempting to create this job template.

In the Controller WebUI. under **Resources** > **Templates**, select **Add** > **Add job template** and enter the following information:

<table>
  <tr>
    <th>Parameter</th>
    <th>Value</th>
  </tr>
  <tr>
    <td>Name</td>
    <td>Deploy K8s Application</td>
  </tr>
  <tr>
    <td>Inventory</td>
    <td>Edge Systems</td>
  </tr>
  <tr>
    <td>Project</td>
    <td>Device Edge Codebase</td>
  </tr>
  <tr>
    <td>Execution Environment</td>
    <td>Device Edge Workshops Execution Environment</td>
  </tr>
  <tr>
    <td>Playbook</td>
    <td>playbooks/deploy-k8s-app.yml</td>
  </tr>
  <tr>
    <td>Credentials</td>
    <td><ul><li>✓ Device Credentials</li></ul></td>
  </tr>
  <tr>
    <td>Limit</td>
    <td><li>✓ Prompt on launch</li></td>
  </tr>
</table>

Remember to click **Save**.

### Step 3 - Running the Job Template

Now that the job template has been created, click on the rocket ship to launch the job template and enter your device name when prompted for the limit. Monitor the output for any errors or issues, however hopefully the job executes successfully.

As a reminder, the output of jobs can be reviewed on the **Jobs** tab.

### Bonus Steps

For some extra practice, an additional step must be taken to access the application.

1. Since we did not set up a route (or DNS), add a route definition, adjust the deployment playbook, re-run it, and configure your personal device's DNS settings (you could just toss a line in `/etc/hosts`), then attempt to access the application.
2. Use the `oc` CLI utility to port-forward and test connectivity.


### Solutions

![Deploy K8s Template](../images/deploy-k8s-app-template.png)

---
**Navigation**

[Previous Exercise](../0.1-upgrade-rhde) | [Next Exercise](../5.4-deploy-containerized-app)

[Click here to return to the Workshop Homepage](../README.md)