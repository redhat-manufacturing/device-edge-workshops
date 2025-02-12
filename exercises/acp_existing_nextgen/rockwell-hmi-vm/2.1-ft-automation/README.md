# Workshop Exercise 2.1 - FactoryTalk HMI Automation Part 1

## Table of Contents

* [Objective](#objective)
* [Step 1 - Wait for Connectivity](#step-1---wait-for-connectivity)
* [Step 2 - Setting the System Hostnames](#step-2---setting-the-system-hostnames)
* [Step 3 - Launching FT HMI Client File](#step-3---Launching-FactoryTalk-HMI-Client-File)

## Objective

* Create automation to setup an AD environment
* Store code in repository

## Step 1 - Wait for Connectivity
- Note: This may already exist from another team, but double check.

The following exercises are going to involve creating playbooks that will load our new Window VM with OT softare installed and add services needed to connect to Codesys Soft PLC (Programmable Logic Controller). Later on, we'll tie them all together using a workflow.

To start, we'll create a playbook that waits for the VMs to be available. Create a new directory in your code repository called `playbooks`, and add a new file called `wait-for-connectivity.yaml` with the following contents:

```yaml
---
- name: Wait for systems to be available
  hosts:
    - all
  gather_facts: false
  tasks:
    - name: Wait for connectivity
      ansible.builtin.wait_for_connection:
        timeout: 600
```

This will ensure the VMs can be contacted before attempting the next steps.

## Step 2 - Setting the System Hostnames
- Note: This may have already been created by another team, double check before adding.

Create a new file in the `playbooks/` directory called `set-base-configs.yaml`, and add the following contents:

```yaml
---
- name: Set some basic system configs
  hosts:
    - all
  tasks:
    - name: Set the system hostname
      ansible.windows.win_hostname:
        name: "{{ inventory_hostname }}"
      notify:
        - reboot

  handlers:
    - name: Reboot system
      ansible.windows.win_reboot:
      listen:
        - reboot
```

This will set the hostname of the systems, and since they're Windows, they'll reboot if a change is made.

## Step 3 - Launching FactoryTalk HMI Client File
Create another file in the `playbooks/` directory named `launchFTview.yaml`, and add the following contents:

```yaml
---
- name: Launch FactoryTalk SE Client Application
  hosts: 
    - all
  gather_facts: yes
  tasks:
    - name: Launch the FactoryTalk SE Client with PowerShell
      win_shell: |
        $cliFilePath = "C:\Users\Administrator\Desktop\ACP_RH_1.cli"
        if (Test-Path $cliFilePath) {
            Write-Host "File found at path: $cliFilePath"
            $process = Start-Process -FilePath $cliFilePath
            Write-Host "Started FactoryTalk SE Client with process ID: $($process.Id)"
        } else {
            Write-Host "Error: The file does not exist at the specified path."
        }
      register: factorytalk_client_process
      when: ansible_facts['os_family'] == 'Windows'

    - name: Display FactoryTalk SE Client process result
      debug:
        msg: "FactoryTalk SE Client launched successfully. Process: {{ factorytalk_client_process.stdout }}"
      when: factorytalk_client_process.rc == 0

    - name: Handle failure in launching FactoryTalk SE Client
      debug:
        msg: "Failed to launch FactoryTalk SE Client. Error: {{ factorytalk_client_process.stderr }}"
      when: factorytalk_client_process.rc != 0

```

A few quick notes about this playbook:
-FactoryTalk View SE is an HMI/SCADA program created by Rockwell Automation used in a plant all over the world. While this is only a very sample of what it can do. Know that is is used in manufacturing of critical functions globally and rather popular HMI at that.  
-This playbook should launch a graphic Trend that shows the values from the Codesys PLC that was created in another team. If that PLC is not running or not finished yet, you will see greyed out or "x" out things on the display. But no worries, we have some other things to check out. If we don't have other pieces working, we have some ways to mitigate the problems, but let's cross our fingers and hope for the best. (note: crossing finguers might not actually work in fixing the issue)

With these playbooks, we'll have created and configured an FactoryTalk HMI to show a trend on a single system. In the next exercise, we'll launch the Codesys IDE. 
---
**Navigation**

[Previous Exercise](../1.4-adding-chart-to-argocd/) | [Next Exercise](../2.2-codesys-automation/)

[Click here to return to the Workshop Homepage](../../README.md)
