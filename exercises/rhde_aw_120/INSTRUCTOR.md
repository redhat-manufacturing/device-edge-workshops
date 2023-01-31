# Instructor Guide

## What to do During the Workshop
Four total images are built by the provisioner and all added to the same rpm-ostree repo on the `edge_manager` node. As students progress through the workshop, you'll need to move the ref within the repo to the correct version.

The provisioner will automatically set the active image to version `1.0.0` during provisioning. Once everyone's devices have been kickstarted and students approach [Exercise 4.1](4.1-bare-metal-image), set the active image to version `2.0.0`:
```
ansible-playbook provisioner/set-active-image.yml --inventory /path/to/workshop/inventory.ini --extra-vars "desired_image_version=2.0.0"
```

Repeat this process according to the following:
<table>
  <tr>
    <th>Students at Exercise</th>
    <th>Active Image Version</th>
  </tr>
  <tr>
    <td>[Exercise 3.1/2](3.1-boot-edge-device)</td>
    <td>`1.0.0`</td>
  </tr>
  <tr>
    <td>[Exercise 4.1](4.1-bare-metal-image)</td>
    <td>`2.0.0`</td>
  </tr>
  <tr>
    <td>[Exercise 5.1](5.1-containerized-image)</td>
    <td>`1.0.0`</td>
  </tr>
  <tr>
    <td>[Exercise 6.1](6.1-add-k8s)</td>
    <td>`1.0.0`</td>
  </tr>
</table>

The provisioner generates an SSH keypair and an inventory file for you within the `provisioner/` directory by default. If you also have a local system, the command above will take multiple inventories:
```
ansible-playbook provisioner/set-active-image.yml --inventory /path/to/workshop/inventory.ini --inventory /path/to/local/inventory.yml --extra-vars "desired_image_version=2.0.0"
```

## Useful Resources

After the workshop is up and running, a list of students currently signed in will be available at `ec2_name_prefix.workshop_dns_zone/list.php`. Enter the `admin_password` to view the list.

## Building Local Edge Managers

A local edge manager can be built for on-site edge device management. Right now, the requirements for this device are:
- Red Hat Enterprise Linux 8.7
- Internet connection during provisioning
- Enough CPU/memory to run Controller (4 cores/16gb memory)

What's installed and configured on the system depends on group membership within the inventory.

<table>
  <tr>
    <th>Ansible Group</th>
    <th>Installed components</th>
  </tr>
  <tr>
    <td>controller</td>
    <td>Ansible Controller installed and populated</td>
  </tr>
  <tr>
    <td>edge_management</td>
    <td>Image Builder installed, images composed, rpm-ostree hosted on port 80, Gitea installed and populated</td>
  </tr>
  <tr>
    <td>local</td>
    <td>Some non-aws specific conditionals set</td>
  </tr>
  <tr>
    <td>local/dns</td>
    <td>dnsmasq installed, configured, and started, with some DNS records configured</td>
  </tr>
</table>

For example: in this inventory file, the host `edge-managaer-local` is a member of `edge_management`, `controller`, and `local/dns`.
```yaml
all:
  children:
    edge_management:
      hosts:
        edge-manager-local:
    controller:
      hosts:
        edge-manager-local:
    local:
      hosts:
        edge-manager-local:
      children:
        dns:
          hosts:
            edge-manager-local:
          vars:
            local_domains:
              controller:
                domain: "controller.your-workshop-domain.lcl"
              cockpit:
                domain: "cockpit.your-workshop-domain.lcl"
              gitea:
                domain:  "gitea.your-workshop-domain.lcl"
              edge_manager:
                domain: "edge-manager.your-workshop-domain.lcl"
  vars:
    ansible_host: 192.168.200.10
    ansible_user: ansible
    ansible_password: your-password
    ansible_become_password: your-password
```
