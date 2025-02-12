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
{% raw %}
---
- name: Wait for systems to be available
  hosts:
    - all
  gather_facts: false
  tasks:
    - name: Wait for connectivity
      ansible.builtin.wait_for_connection:
        timeout: 600
{% endraw %}
```

This will ensure the VMs can be contacted before attempting the next steps.

## Step 2 - Setting the start-up script for UA Expert
This will setup what start-ups will be needed going forward. These will go in the playbook folder on gitea. 

create yaml called: `set-start-up-script1.yaml`

```yaml
{% raw %}
- name: auto start application on Windows
  hosts:
    - all
  tasks:
    - name: Set auto-login for user
      ansible.windows.win_powershell:
        script: |
          param (
              [String]
              $AppPath,
              [String]
              $Path,
              [String]
              $TempPath
          )
          Set-Content -Path "$Path" -Value "Start-Sleep -Seconds 5; Start-Process -FilePath \"$AppPath\"" -Encoding UTF8
          $content = "PowerShell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File $Path"
          [System.IO.File]::WriteAllText("$TempPath", "$content", [System.Text.UTF8Encoding]::new($false))
          Copy-Item -Path "$TempPath" -Destination "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup\" -Force    
          Write-Host "Script added to Startup. It will run at the next login."
        parameters:
          AppPath: 'C:\Users\Administrator\Documents\Red Hat One.project'
          TempPath: 'C:\Users\Administrator\startup.cmd'
          Path: 'C:\Users\Administrator\Launch-Program.ps1'
{% endraw %}
```

## Step 3 - Setup Default Usuer
This yaml will help create an auto login script. Create another file in the `playbooks/` directory named `set-default-user1.yaml`, and add the following contents:

```yaml
{% raw %}
---
- name: Set default auto-login user for Windows
  hosts: all
  gather_facts: yes
  tasks:
    - name: Set auto-login for user
      ansible.windows.win_powershell:
        script: |
          param (
              [String]
              $Username,

              [String]
              $Password,

              [String]
              $RegPath
          )
          Set-ItemProperty -Path $RegPath -Name "AutoAdminLogon" -Value "1" -Type String
          Set-ItemProperty -Path $RegPath -Name "DefaultUsername" -Value $Username -Type String
          Set-ItemProperty -Path $RegPath -Name "DefaultPassword" -Value $Password -Type String
          Write-Host "Auto-login configured. Restart to apply changes."
        parameters:
          Username: Administrator
          Password: 'R3dh4t123!'
          RegPath: 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon'
      notify:
        - reboot

  handlers:
    - name: Reboot system
      ansible.windows.win_reboot:
      listen:
        - reboot
{% endraw %}
```

A few quick notes about this playbook:
-FactoryTalk View SE is an HMI/SCADA program created by Rockwell Automation used in a plant all over the world. While this is only a very sample of what it can do. Know that is is used in manufacturing of critical functions globally and rather popular HMI at that.  


With these playbooks, we'll have created and configured a Windows VM with Codesys IDE running (PLC Programming software) project. We will also be creating a CentOS VM with services available to help connect the VM to the Codesys Runtime Container. 
---
**Navigation**

[Previous Exercise](../1.4-adding-chart-to-argocd/) | [Next Exercise](../3.1-contoller-as-code/)

[Click here to return to the Workshop Homepage](../../README.md)
