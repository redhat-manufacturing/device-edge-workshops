# Workshop Exercise 2.3 - UA Expert Automation

## Table of Contents

* [Objective](#objective)
* [Step 1 - Launching UA Expert](#step-1---Launching-UA-Expert)

## Objective

* Create automation to launch UA Expert
* Store code in repository


## Step 1 - Launching UA Expert
Create another file in the `playbooks/` directory named `launch-ua-expert.yaml`, and add the following contents:

```yaml
---
- name: Launch UA Expert 
  hosts: all
  gather_facts: yes
  tasks:
    - name: Ensure the UA Expert Project is installed
      win_package:
        path: 'C:\\Program Files\\UnifiedAutomation\\UaExpert\\bin\\installer.exe'
        state: present
      when: ansible_facts['os_family'] == 'Windows'

    - name: Launch the UA Expert RH1 File
      win_command: 'C:\\Program Files\\UnifiedAutomation\\UaExpert\\bin\\UaExpert.exe C:\\Program Files\\UnifiedAutomation\\UaExpert\\bin\\testcase.uap'
      register: ua_expert_process

    - name: Display UA Expert process result
      debug:
        msg: "UA Expert launched successfully. Process: {{ ua_expert_process.stdout }}"
      when: ua_expert_process.rc == 0

    - name: Handle failure in launching UA Expert
      debug:
        msg: "Failed to launch UA Expert. Error: {{ ua_expert_process.stderr }}"
      when: ua_expert_process.rc != 0
```

A few quick notes about this playbook:
- This playbook should launch an instance of UA Expert with connections already established. In the bottom left quadrant of the UA Expert GUI, you will tags that can be viewed. You may have to navigate to them, and you can drag them into the main menu to see live data coming over UA. There is a bit of a fun message in the tag names in UA, thanks for being part of our lab. 
- OPC-UA is a common standard for communication and information models using in the industrial automation/OT space. The reason it is popular is a common model that can be used by a variety of manufacturers. 


With these playbooks, we launched the UA Expert GUI and program used so we can see the data the PLC is producing over OPC-UA. In the next exercise, 
---
**Navigation**

[Previous Exercise](../2.2-codesys-automation//) | [Next Exercise](../3.1-contorller-as-code//)

[Click here to return to the Workshop Homepage](../../README.md)
