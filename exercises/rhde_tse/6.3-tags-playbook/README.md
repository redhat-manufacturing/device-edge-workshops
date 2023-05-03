# Workshop Exercise 6.2 - Adding an Inventory for CIP Devices

## Table of Contents

* [Objective](#objective)
* [Step 1 - Creating a Playbook to Control a Motor](#step-1---creating-a-playbook-to-control-a-motor)

## Objective

In this exercise, we'll create a playbook to control a motor by changing the value of tags within a PLC's program over CIP.

### Step 1 - Creating a Playbook to Control a Motor

The community.cip collection provides modules in a similar way as other Ansible collections. Here, they control tags within the program of a PLC.

The `community.cip.ensure_tags` module will allow us to reference tags and assign them a value. These values can be numbers, floats, or bools, depending on the tag.

Create a new file in your code repository at `playbooks/run-motor.yml` and paste in the following contents:
```yaml
---

- name: Control motor via PLC tags
  hosts:
    - all
  gather_facts: no
  tasks:
    - name: Set motor start tag to true, stop tag to false, start slow
      community.cip.ensure_tags:
        tags:
          - name: "Start"
            value: True
          - name: "Stop"
            value: False
          - name: "MotorSetPoint"
            value: 100
          - name: "isForward"
            value: True
    - name: Pause for dramatic effect
      ansible.builtin.pause:
        seconds: 10
    - name: Speed up
      community.cip.ensure_tags:
        tags:
          - name: "MotorSetPoint"
            value: 5000
    - name: Pause for dramatic effect
      ansible.builtin.pause:
        seconds: 10
    - name: Lets go the other way
      community.cip.ensure_tags:
        tags:
          - name: "isForward"
            value: False
    - name: Pause for dramatic effect
      ansible.builtin.pause:
        seconds: 10
    - name: Max it out
      community.cip.ensure_tags:
        tags:
          - name: "MotorSetPoint"
            value: 6000
    - name: More dramatic effect
      ansible.builtin.pause:
        seconds: 10
    - name: Lets go the other way again
      community.cip.ensure_tags:
        tags:
          - name: "isForward"
            value: True
    - name: More dramatic effect
      ansible.builtin.pause:
        seconds: 10            
    - name: Shut everything off
      community.cip.ensure_tags:
        tags:
          - name: "Start"
            value: False
          - name: "Stop"
            value: True
```

When finished, remember to push your changes to your code repository.

---
**Navigation**

[Previous Exercise](../6.2-inventory-and-host) | [Next Exercise](../6.4-cip-job-template)

[Click here to return to the Workshop Homepage](../README.md)


