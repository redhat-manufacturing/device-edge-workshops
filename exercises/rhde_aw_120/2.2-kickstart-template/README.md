# Workshop Exercise 2.2 - Creating a Kickstart Template

## Table of Contents

* [Objective](#objective)
* [Step 1 - Kickstart Basics](#step-1---kickstart-basics)
* [Step 2 - OSTree Specific Setup](#step-2---ostree-specific-setup)
* [Step 3 - Adding Networking Information](#step-3---adding-network-information)
* [Step 4 - Creating a Call Home Playbook](#step-4---creating-a-call-home-playbook)
* [Step 5 - Using Systemd to Run the Playbook on First Boot](#step-5---using-systemd-to-run-the-playbook-on-first-boot)
* [Solutions](#solutions)

## Objective

In this exercise, we're going to build a [jinja2](https://pypi.org/project/Jinja2/) template that'll build us a kickstart file to be used by our edge devices when we provision them. This file allows us to get the operating system down without needing to manually enter values or click through the Anaconda installer.

We're writing this as a jinja2 template so that:
1. Our kickstarts are fundamentally code, kept in source control, etc.
2. We can use Ansible to push them out to anywhere we need them to be.

### Step 1 - Kickstart Basics

The most basic kickstart for Device Edge contains the following:
```
lang en_US.UTF-8
timezone UTC
zerombr
clearpart --all --initlabel
autopart --type=plain --fstype=xfs --nohome
reboot
text
user --name your-user-here --groups=wheel --password=your-password-here
services --enabled=ostree-remount
ostreesetup --nogpg --url=http://1.2.3.4:80/repo --osname=rhel --ref=rhel/8/x86_64/edge
```

Most of these are the defaults for kickstarting standard RHEL, and they apply here to Device Edge as well.

### Step 2 - OSTree Specific Setup

The line that handles the setup of Device Edge is the last one:
`ostreesetup --nogpg --url=http://1.2.3.4:80/repo --osname=rhel --ref=rhel/8/x86_64/edge`

Let's take a look at these options:
1. `ostreesetup` - setup an ostree-based operating system over a traditional RPM-based OS.
2. `--nogpg` - for this lab, we're going to ignore the gpg keys on packages.
3. `--url` - where to go to grab the edge-commit, typically a web server. This can include port, http/https, and where on the server to go (`/repo` for example).
4. `--osname` - the name of the operating system that will be deployed.
5. `--ref` - the ref of the OS being deployed. This can be thought of like a git repo that contains commits instead of code.

The above is just an example, we'll need to tweak this section slightly for our purposes. First, create a new directory in your source control repo: `playbooks/templates`, and in it create a file named `student(your-student-number).ks.j2`, for example: `student10.ks.j2`. Open the file with your editor of choice and add some ansible variables:

{% raw %}
```
keyboard --xlayouts='us'
lang en_US.UTF-8
timezone UTC
zerombr
clearpart --all --initlabel
autopart --type=plain --fstype=xfs --nohome
reboot
text
user --name {{ kickstart_user_username }} --groups=wheel --password={{ kickstart_user_password }}
services --enabled=ostree-remount
ostreesetup --nogpg --url={{ ostree_repo_protocol }}://{{ ostree_repo_host }}:{{ ostree_repo_port }}/{{ ostree_repo_path }} --osname={{ ostree_os_name }} --ref={{ ostree_ref }}
```
{% endraw %}

Here we've convered a few lines to be more dynamic so this template is re-usable. Some of these are fine to store as variables in Controller, while others we'll create a custom credential type and credential for so they're stored securely.

### Step 3 - Adding Networking Information

Since we're provisioning these systems over the network, it may be necessary to include networking information in the kickstart to ensure the device is on the network prior to trying to pull the OS.

If wired networking and DHCP is available, then most likely things will just work "out of the box". If you're using virtualized devices in AWS, this will most likely be your experience as the workshop's VPC will have DHCP available, and the virtual machines will be presented with a "wired" connection.

Wifi connections are not supported in the `network` line of a kickstart, so we'll establish the connection using `nmcli` in the `%pre` section of the kickstart. Additionally, we'll conditionalize this via `if/endif` statements so this section is only present if wireless credentials have been provided.

{% raw %}
```
{% if wifi_network is defined and wifi_password is defined %}
%pre
nmcli dev wifi connect "{{ wifi_network }}" password "{{ wifi_password }}"
%end
{% endif %}
```
{% endraw %}
NetworkManager should automatically select the correct device for us to connect to a wireless network.


### Step 4 - Creating a Call Home Playbook

Our kickstart file will install an operating system, but doesn't yet include everything we want it to. After devices boot up the first time, we want them to attempt to call home and register themselves with Ansible Controller so we can automate against them.

To accomplish this, we'll use the `%post` section of our kickstart, along with some additional options in jinja, to lay down an Ansible playbook that does the following:

1. Grab the inventory ID of the inventory for our edge devices
2. Create a new host in that inventory for itself with current connectivity information
3. Grab the ID of the provisioning workflow we created
4. Kick off that provisioning workflow with a limit of "just itself"


We'll also be leveraging the `raw` capibilities of jinja so Ansible doesn't attempt to template out vars in the playbook tasks, but we do want the variables in `vars` and `module_defaults` instantiated.

{% raw %}
```
%post
# create playbook for controller registration
cat > /var/tmp/aap-auto-registration.yml <<EOF
---
- name: register a r4e system to ansible controller
  hosts:
    - localhost
  vars:
    ansible_connection: local
    controller_url: https://{{ controller_host }}/api/v2
    controller_inventory: Edge Systems
    provisioning_template: Provision Edge Device
  module_defaults:
    ansible.builtin.uri:
      user: "{{ controller_api_username }}"
      password: "{{ controller_api_password }}"
      force_basic_auth: yes
      validate_certs: no
# Ensure you use the raw option here
  tasks:
    - name: find the id of {{ controller_inventory }}
      ansible.builtin.uri:
        url: "{{ controller_url }}/inventories?name={{ controller_inventory | regex_replace(' ', '%20') }}"
      register: controller_inventory_lookup
    - name: set inventory id fact
      ansible.builtin.set_fact:
        controller_inventory_id: "{{ controller_inventory_lookup.json.results[0].id }}"
    - name: create host in inventory {{ controller_inventory }}
      ansible.builtin.uri:
        url: "{{ controller_url }}/inventories/{{ controller_inventory_id }}/hosts/"
        method: POST
        body_format: json
        body:
          name: "edge-{{ ansible_default_ipv4.macaddress | replace(':','') }}"
          variables:
            'ansible_host: {{ ansible_default_ipv4.address }}'
      register: create_host
      changed_when:
        - create_host.status | int == 201
      failed_when:
        - create_host.status | int != 201
        - "'already exists' not in create_host.content"
    - name: find the id of {{ provisioning_template }}
      ansible.builtin.uri:
        url: "{{ controller_url }}/workflow_job_templates?name={{ provisioning_template | regex_replace(' ', '%20') }}"
      register: job_template_lookup
    - name: set the id of {{ provisioning_template }}
      ansible.builtin.set_fact:
        job_template_id: "{{ job_template_lookup.json.results[0].id }}"
    - name: trigger {{ provisioning_template }}
      ansible.builtin.uri:
        url: "{{ controller_url }}/workflow_job_templates/{{ job_template_id }}/launch/"
        method: POST
        status_code:
          - 201
        body_format: json
        body:
          limit: "edge-{{ ansible_default_ipv4.macaddress | replace(':','') }}"
# End your raw here
EOF
```
{% endraw %}
### Step 5 - Using Systemd to Run the Playbook on First Boot

Finally, we'll use systemd to run the playbook once the system boots up the first time. There's a few conditions to running this playbook that we can specify in our systemd-service file:

- Ensure local filesystems are available
- Ensure networking is up
- If successful, leave behind a "cookie" denoting success
- If that cookie is present, do not run again

These conditions can be handled using options in the `Unit` and `Service` sections of our service file:
```
# create systemd runonce file to trigger playbook
cat > /etc/systemd/system/aap-auto-registration.service <<EOF
[Unit]
Description=Ansible Automation Platform Auto-Registration
After=local-fs.target
After=network.target
ConditionPathExists=!/var/tmp/post-installed

[Service]
ExecStartPre=/usr/bin/sleep 20
ExecStart=/usr/bin/ansible-playbook /var/tmp/aap-auto-registration.yml
ExecStartPost=/usr/bin/touch /var/tmp/post-installed
User=root
RemainAfterExit=true
Type=oneshot

[Install]
WantedBy=multi-user.target
EOF

# Enable the service
systemctl enable aap-auto-registration.service
%end

```

### Solutions

The finished kickstart should look be similar to this:
{% raw %}
```
%pre
nmcli dev wifi connect "{{ wifi_network }}" password "{{ wifi_password }}"
%end

keyboard --xlayouts='us'
lang en_US.UTF-8
timezone UTC
zerombr
clearpart --all --initlabel
autopart --type=plain --fstype=xfs --nohome
reboot
text
user --name {{ kickstart_user_username }} --groups=wheel --password={{ kickstart_user_password }}
services --enabled=ostree-remount
ostreesetup --nogpg --url={{ ostree_repo_protocol }}://{{ ostree_host }}:{{ ostree_repo_port }}/{{ ostree_path }} --osname={{ ostree_os_name }} --ref={{ ostree_ref }}

%post
# create playbook for controller registration
cat > /var/tmp/aap-auto-registration.yml <<EOF
---
- name: register a r4e system to ansible controller
  hosts:
    - localhost
  vars:
    ansible_connection: local
    controller_url: https://{{ controller_host }}/api/v2
    controller_inventory: Edge Systems
    provisioning_template: Provision Edge Device
  module_defaults:
    ansible.builtin.uri:
      user: "{{ controller_api_username }}"
      password: "{{ controller_api_password }}"
      force_basic_auth: yes
      validate_certs: no
# Ensure you start your raw here
  tasks:
    - name: find the id of {{ controller_inventory }}
      ansible.builtin.uri:
        url: "{{ controller_url }}/inventories?name={{ controller_inventory | regex_replace(' ', '%20') }}"
      register: controller_inventory_lookup
    - name: set inventory id fact
      ansible.builtin.set_fact:
        controller_inventory_id: "{{ controller_inventory_lookup.json.results[0].id }}"
    - name: create host in inventory {{ controller_inventory }}
      ansible.builtin.uri:
        url: "{{ controller_url }}/inventories/{{ controller_inventory_id }}/hosts/"
        method: POST
        body_format: json
        body:
          name: "edge-{{ ansible_default_ipv4.macaddress | replace(':','') }}"
          variables:
            'ansible_host: {{ ansible_default_ipv4.address }}'
      register: create_host
      changed_when:
        - create_host.status | int == 201
      failed_when:
        - create_host.status | int != 201
        - "'already exists' not in create_host.content"
    - name: find the id of {{ provisioning_template }}
      ansible.builtin.uri:
        url: "{{ controller_url }}/workflow_job_templates?name={{ provisioning_template | regex_replace(' ', '%20') }}"
      register: job_template_lookup
    - name: set the id of {{ provisioning_template }}
      ansible.builtin.set_fact:
        job_template_id: "{{ job_template_lookup.json.results[0].id }}"
    - name: trigger {{ provisioning_template }}
      ansible.builtin.uri:
        url: "{{ controller_url }}/workflow_job_templates/{{ job_template_id }}/launch/"
        method: POST
        status_code:
          - 201
        body_format: json
        body:
          limit: "edge-{{ ansible_default_ipv4.macaddress | replace(':','') }}"
# End your raw here
EOF

# create systemd runonce file to trigger playbook
cat > /etc/systemd/system/aap-auto-registration.service <<EOF
[Unit]
Description=Ansible Automation Platform Auto-Registration
After=local-fs.target
After=network.target
ConditionPathExists=!/var/tmp/post-installed

[Service]
ExecStartPre=/usr/bin/sleep 20
ExecStart=/usr/bin/ansible-playbook /var/tmp/aap-auto-registration.yml
ExecStartPost=/usr/bin/touch /var/tmp/post-installed
User=root
RemainAfterExit=true
Type=oneshot

[Install]
WantedBy=multi-user.target
EOF

# Enable the service
systemctl enable aap-auto-registration.service
%end
```
{% endraw %}

Once you've assembled your kickstart template, be sure to push it into your git repo.

---
**Navigation**

[Previous Exercise](../2.1-provisioning-workflow) | [Next Exercise](../2.3-kickstart-playbook)

[Click here to return to the Workshop Homepage](../README.md)