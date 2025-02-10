# Workshop Exercise 2.2 - Network Automation Part 2

## Table of Contents

* [Objective](#objective)
* [Step 1 - VLAN Interfaces](#step-1---vlan-interfaces)
* [Step 2 - Static Routes](#step-2---static-routes)
* [Step 3 - Configure OSPF](#step-3---configure-ospf)
* [Step 4 - Save and Commit Code](#step-4---save-and-commit-code)

## Objective

* Continue network automation creation
* Store automation in code repository

## Step 1 - VLAN Interfaces
Furthering the VLAN configuration, we'll set up some l3 interfaces aligned to the vlans created in another playbook. Create a new playbook named `vlan-interfaces.yaml` and add the following contents:

```yaml
---
- name: Setup VLAN interfaces
  hosts:
    - all
  tasks:
    - name: Configure VLAN Interfaces
      cisco.ios.ios_l3_interfaces:
        config:
          - name: "Vlan{{ vlan }}"
            autostate: false
            ipv4:
              - address: "192.168.{{ vlan }}.1/24"
            ipv6:
              - enable: false
      loop: "{{ range(200, 221)|list }}"
      loop_control:
        loop_var: vlan
```

## Step 2 - Static Routes
Let's create another playbook that configures some static routes on our network appliance. Create a new file in the `playbooks` directory named `static-routes.yaml` and add the following contents:

```yaml
---
- name: Setup static routes
  hosts:
    - all
  tasks:
    - name: Configure static routes
      cisco.ios.ios_static_routes:
        config:
          - address_families:
              - afi: ipv4
                routes:
                  - dest: 10.1.1.0/24
                    next_hops:
                      - forward_router_address: 192.168.1.1
                        name: route
                  - dest: 10.1.2.0/24
                    next_hops:
                      - forward_router_address: 192.168.2.1
                        name: route2
                  - dest: 10.1.3.0/24
                    next_hops:                       
                      - forward_router_address: 192.168.3.1
                        name: route3
```

## Step 3 - Configure OSPF
Finally, we'll create one last playbook to setup OSPF on our network appliance. Create a new file in the `playbooks` directory named `ospf.yaml` and add the following contents:

```yaml
---
- name: Setup OSPF
  hosts:
    - all
  tasks:
    - name: Configure OSPFv2
      cisco.ios.ios_ospfv2:
        config:
          processes:
            - process_id: 1
              max_metric:
                router_lsa: true
                on_startup:
                  time: 110
              areas:
                - area_id: "0"
                  capability: true
```

## Step 4 - Save and Commit Code
Same as before, ensure your code has been saved in your code repository. If you're using an IDE, ensure you've committed/pushed your code.

---
**Navigation**

[Previous Exercise](../2.1-network-automation-part-1/) | [Next Exercise](../3.1-controller-as-code/)

[Click here to return to the Workshop Homepage](../../README.md)
