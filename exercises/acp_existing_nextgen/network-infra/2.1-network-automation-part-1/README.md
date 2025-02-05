# Workshop Exercise 2.1 - Network Automation Part 1

## Table of Contents

* [Objective](#objective)
* [Step 1 - Helm Chart Structure](#step-1---helm-chart-structure)
* [Step 2 - Creating Our Chart Structure](#step-2---creating-our-chart-structure)

## Objective

* Create initial network automation playbooks
* Store automation in code repository

## Step 1 - NTP Playbook
First, let's create a directory to house our playbooks, and start crafting some automation to run against our network appliance.

![Gitea Add Directory](../.images/gitea-adding-directory.png)

In our code repository, create a new directory named `playbooks` and add a new file called `ntp.yaml`. Paste in the following contents:
```yaml
---
- name: Setup NTP
  hosts:
    - all
  tasks:
    - name: Configure NTP Servers
      cisco.ios.ios_ntp_global:
        config:
          servers:
            - 0.pool.ntp.org
            - 1.pool.ntp.org
            - 2.pool.ntp.org
            - 3.pool.ntp.org
```

> Note:
>
> The playbook directory may already exist in your code repository, depending on how far your teammates have gotten. If it does already exist, simply place this playbook in it.

This playbook will setup NTP on our network appliance, and point it at a pool of NTP servers.

![Gitea NTP Playbook](../.images/gitea-ntp-playbook.png)

## Step 2 - SNMPv3 Playbook
Next, we'll add a playbook to setup SNMPv3. Add a new file to the playbook directory named `snmpv3.yaml`, and add the following content:

```yaml
- name: Setup SNMPv3
  hosts:
    - all
  tasks:
    - name: Configure SNMPv3
      cisco.ios.ios_snmp_user:
        config:
          users:
            - name: ansible
              group: SNMPv3Group
              version: v3
              auth:
                protocol: sha
                password: PICKASTRONGPASSWORD
              priv:
                protocol: aes
                password: PICKASTRONGPASSWORD
```

> Note:
>
> Be sure to replace `PICKASTRONGPASSWORD` with a strong password of your choosing. You shouldn't store passwords in plaintext, however secret storage is outside of the scope of this workshop.

## Step 3 - SNMPv2 Playbook
Finally, we'll also configure SNMPv2, with a generic community string of `ansible`. Add another file to the `playbooks` directory named `snmpv2.yaml` with the folling content:

```yaml
- name: Setup SNMPv2
  hosts:
    - all
  tasks:
    - name: Configure SNMPv2 read-only
      cisco.ios.ios_snmp_server:
        config:
          communities:
            - name: ansible
              access: ro
```

## Step 4 - Save and Commit Code
Once you've finished editing the playbooks in the previous steps, be sure they've been saved into your code repository. If you're using the web UI, ensure you're hitting the `Commit Changes` button.

![Gitea Commit Code](../.images/gitea-commit-changes.png)

If you're using an IDE, ensure you've committed/pushed your new code.


---
**Navigation**

[Next Exercise](../1.2-adding-vm-templates/)

[Click here to return to the Workshop Homepage](../../README.md)
