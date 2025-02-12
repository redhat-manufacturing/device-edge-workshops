# Workshop Exercise 2.1 - Codesys Automation

## Table of Contents

* [Objective](#objective)
* [Step 1 - Launching Codesys IDE](#step-1---Launching-Codesys-IDE)

## Objective

* Create automation to launch Codesys IDE 
* Store code in repository


## Step 1 - Launching Codesys IDE
Create another file in the `playbooks/` directory named `launch-codesys-ide.yaml`, and add the following contents:

```yaml
{% raw %}
---
- name: Launch Codesys IDE
  hosts: all
  gather_facts: yes
  tasks:
    - name: Launch the Codesys IDE with Red Hat One Project using PowerShell
      win_shell: |
        $projectFilePath = "C:\Users\Administrator\Documents\Red Hat One.project"
        if (Test-Path $projectFilePath) {
            Start-Process -FilePath $projectFilePath
        } else {
            Write-Host "Error: The project file does not exist at the specified path."
        }
      register: codesys_ide_process
      when: ansible_facts['os_family'] == 'Windows'

    - name: Display Codesys IDE process result
      debug:
        msg: "Codesys IDE launched successfully. Process: {{ codesys_ide_process.stdout }}"
      when: codesys_ide_process.rc == 0

    - name: Handle failure in launching Codesys IDE and Project
      debug:
        msg: "Failed to launch Codesys IDE. Error: {{ codesys_ide_process.stderr }}"
      when: codesys_ide_process.rc != 0
{% endraw %}
```

A few quick notes about this playbook:
- This playbook should launch the Codesys IDE. This IDE is used to program PLCs. And specifically this will launch the program that is being used to create the logic in the Codesys Soft PLC being used in this lab. While this lab's intention is not to get you to understand this software, it could be of interest to see what kind of programs are being used to program PLCs in an industrial environment. If you navigate to the "PLC_PRG" you will see some ladder logic. Let's not linger too long though, there is more to explore. 


With these playbooks, we launched the Codeysys IDE and program used to program the PLC in use. In the next exercise, we'll launch a tool that will let us see the OPC-UA traffic being created by the Codesys PLC. 
---
**Navigation**

[Previous Exercise](../2.2-codesys-automation/) | [Next Exercise](../2.3-ua-expert-automation/)

[Click here to return to the Workshop Homepage](../../README.md)
