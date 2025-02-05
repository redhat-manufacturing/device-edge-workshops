# Workshop Exercise 2.2 - Network Automation Part 2

## Table of Contents

* [Objective](#objective)
* [Step 1 - VLANs Playbook](#step-1---vlans-playbook)
* [Step 2 - VLAN Interfaces](#step-2---vlan-interfaces)
* [Step 3 - Static Routes](#step-3---static-routes)
* [Step 4 - Configure OSPF](#step-4---configure-ospf)
* [Step 5 - Save and Commit Code](#step-5---save-and-commit-code)

## Objective

* Continue network automation creation
* Store automation in code repository

## Step 1 - VLANs Playbook
Continuing on with our configuration, let's create a playbook named `vlans.yaml` with the following contents:
```yaml
---
- name: Setup VLANs
  hosts:
    - all
  tasks:
    - name: Configure VLANs 2000-2020
      cisco.ios.ios_vlans:
        config:
          vlans:
            - id: "{{ vlan }}"
        loop: "{{ range(2000, 2021)|list }}"
        loop_control:
          loop_var: vlan
```

This playbook will loop and create a set of example vlans.

## Step 2 - VLAN Interfaces
Furthering the VLAN configuration, we'll set up some l3 interfaces aligned to the vlans created in another playbook. Create a new playbook named `vlan-interfaces.yaml` and add the following contents:

```yaml
- name: Setup VLAN interfaces
  hosts:
    - all
  tasks:
    - name: Configure VLAN Interfaces
      cisco.ios.ios_interfaces:
        config:
          interfaces:
            - name: Vlan{{ item }}
              enabled: true
              ipv4:
                address:
                  primary:
                    address: 192.168.{{ item | int % 256 }}.1
                    mask: 255.255.255.0
        loop: "{{ range(2000, 2021)|list }}"
```

## Step 3 - Static Routes
Let's create another playbook that configures some static routes on our network appliance. Create a new file in the `playbooks` directory named `static-routes.yaml` and add the following contents:

```yaml
- name: Setup static routes
  hosts:
    - all
  tasks:
    - name: Configure static routes
      cisco.ios.ios_static_routes:
        config:
          routes:
            - destination: 10.1.1.0/24
              next_hop: 192.168.1.1
            - destination: 10.2.2.0/24
              next_hop: 192.168.2.1
            - destination: 10.3.3.0/24
              next_hop: 192.168.3.1
```

## Step 4 - Configure OSPF
Finally, we'll create one last playbook to setup OSPF on our network appliance. Create a new file in the `playbooks` directory named `ospf.yaml` and add the following contents:

```yaml
- name: Setup OSPF
  hosts:
    - all
  tasks:
    - name: Configure OSPFv3
      cisco.ios.ios_ospfv3:
        config:
          processes:
            - id: 1
              address_families:
                - afi: ipv6
                  area: 0
                - afi: ipv4
                  area: 0
```

## Step 5 - Save and Commit Code
Same as before, ensure your code has been saved in your code repository. If you're using an IDE, ensure you're committed/pushed your code.

---
**Navigation**

[Previous Exercise](../2.1-network-automation-part-1/) | [Next Exercise](../3.1-contorller-as-code/)

[Click here to return to the Workshop Homepage](../../README.md)
