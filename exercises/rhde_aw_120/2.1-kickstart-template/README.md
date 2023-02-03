# Workshop Exercise 2.1 - Creating a Kickstart Template

## Table of Contents

* [Objective](#objective)
* [Step 1 - Kickstart Basics](#step-1---kickstart-basics)
* [Step 2 - OSTree Specific Setup](#step-2---ostree-specific-setup)
* [Step 3 - Adding Networking Information](#step-3---adding-networking-information)
* [Step 4 - Creating a Call Home Playbook](#step-4---creating-a-call-home-playbook)
* [Step 5 - Using Systemd to Run the Playbook on First Boot](#step-5---using-systemd-to-run-the-playbook-on-first-boot)
* [Solutions](#solutions)

## Objective

In this exercise, we're going to build a [jinja2](https://pypi.org/project/Jinja2/) template that will build us a [kickstart file](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/performing_an_advanced_rhel_8_installation/index) to be used by our edge devices when we provision them. This file allows us to get the operating system down without needing to manually enter values or click through the Anaconda installer.

We're writing this as a jinja2 template so that:
1. Our kickstarts are fundamentally code, kept in source control, etc.
2. We can use Ansible to push them out to anywhere.

### Step 1 - Kickstart Basics

The most basic kickstart for Device Edge contains the following:
```
keyboard --xlayouts='us'
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

Most of these are the defaults for kickstarting standard RHEL, and they apply here to Red Hat Device Edge as well.

### Step 2 - OSTree Specific Setup

The line that handles the setup of Device Edge is the last one:
`ostreesetup --nogpg --url=http://1.2.3.4:80/repo --osname=rhel --ref=rhel/8/x86_64/edge`

Let's take a look at these options:
1. `ostreesetup` - setup an ostree-based operating system over a traditional RPM-based OS.
2. `--nogpg` - for this lab, we're going to ignore the gpg keys on packages.
3. `--url` - the location to obtain the edge-commit, typically a web server. This can include port, http/https, and the path on the server (`/repo` for example).
4. `--osname` - the name of the operating system that will be deployed.
5. `--ref` - the ref of the OS being deployed. This can be thought of like a git repo that contains commits.

The above is just an example. We'll need to modify this section slightly for our purposes. First, create a new directory in your source control repo: `playbooks/templates`. Within the newly created directory, create a file named `student(your-student-number).ks.j2`, for example: `student10.ks.j2`. Open the file with your editor of choice and add some ansible variables:

```yaml
keyboard --xlayouts='us'
lang en_US.UTF-8
timezone UTC
zerombr
clearpart --all --initlabel
autopart --type=plain --fstype=xfs --nohome
reboot
text
user --name={{ kickstart_user_username }} --groups=wheel --password={{ kickstart_user_password }}
services --enabled=ostree-remount
ostreesetup --nogpg --url={{ ostree_repo_protocol }}://{{ ostree_repo_host }}:{{ ostree_repo_port }}/{{ ostree_repo_path }} --osname={{ ostree_os_name }} --ref={{ ostree_ref }}
```

Here we've converted a few lines to be more dynamic so this template can be re-usable. Some of these changes are to enable the ability to store as variables in Controller, while others, we'll create a custom credential type and credential so that the values can be stored securely.

### Step 3 - Adding Networking Information

Since we're provisioning these systems over the network, it may be necessary to include networking information in the kickstart to ensure the device is on the network prior to trying to pulling the OS.

If wired networking and DHCP is available, then most likely things will just work "out of the box" by specifying `network --bootproto=dhcp --onboot=true` in the kickstart file. If you're using virtualized devices in AWS, this will most likely be your experience as the workshop's VPC will have DHCP available, and the virtual machines will be presented with a "wired" connection.

Wifi connections are not supported in the `network` line of a kickstart, so we'll establish the connection using `nmcli` in the `%pre` section of the kickstart. Additionally, we'll conditionalize this via jinja `if/endif` statements, so this section is only present if wireless credentials have been provided. Add the following to the beginning of the kickstart file.

{% comment %}
```yaml
{% if wifi_network is defined and wifi_password is defined %}
%pre
nmcli dev wifi connect "{{ wifi_network }}" password "{{ wifi_password }}"
%end
{% endif %}
```
{% endcomment %}