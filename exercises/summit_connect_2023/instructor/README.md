# Instructor Guide

## What to do During the Demo
This demo is presentor led, with the intention of being delivered during a 75-90 minute session. The slide deck sets the stage for the presentation, then has 5 "demo stops" where functionality is showcased to the audience.

## Checking On Demo Services
There's a few different services involved in this demo. They all should be up and available after provisioning, but if they need convincing use the information below. Remember to connect to the approriate node when attempting to interact with services.

### Non-containerized services:
<table>
  <tr>
    <th>Workshop Service</th>
    <th>Description</th>
    <th>Network Port</th>
    <th>Restart Command</th>
  </tr>
  <tr>
    <td>Cockpit WebUI</td>
    <td>Web interface for system administration, accessing the Image Builder webUI</td>
    <td>tcp/9090</td>
    <td>sudo systemctl restart cockpit.socket cockpit.service</td>
  </tr>
  <tr>
    <td>rpm-ostree Web Server</td>
    <td>Apache web server hosting /var/www/html/rhde-image ostree repo</td>
    <td>tcp/11080</td>
    <td>sudo systemctl restart httpd</td>
  </tr>
  <tr>
    <td>Ansible Controller</td>
    <td>Ansible controller for automation against edge devices</td>
    <td>tcp/10443</td>
    <td>sudo automation-controller-service restart</td>
  </tr>
</table>

### Containerized services:
<table>
  <tr>
    <th>Workshop Service</th>
    <th>Description</th>
    <th>Network Port</th>
    <th>Pod</th>
  </tr>
  <tr>
    <td>Dnsmasq</td>
    <td>Provides DHCP and DNS for the workshop network</td>
    <td>udp/53</td>
    <td>workshop-rhde_tse-priv</td>
  </tr>
  <tr>
    <td>Reverse Proxy</td>
    <td>Nginx reverse proxy for workshop services with valid wildcard certiticate</td>
    <td>tcp/80,tcp/443</td>
    <td>workshop-rhde_tse</td>
  </tr>
  <tr>
    <td>iPXE</td>
    <td>Hosts iPXE menu file</td>
    <td>tcp/8081</td>
    <td>workshop-rhde_tse</td>
  </tr>
  <tr>
    <td>Database</td>
    <td>Postgresql database for Gitea</td>
    <td>tcp/15432</td>
    <td>workshop-rhde_tse</td>
  </tr>
  <tr>
    <td>Gitea</td>
    <td>Source control server for students</td>
    <td>tcp/3001</td>
    <td>workshop-rhde_tse</td>
  </tr>
  <tr>
    <td>TFTP</td>
    <td>Hosts the installation environment files</td>
    <td>udp/69</td>
    <td>workshop-rhde_tse</td>
  </tr>
  <tr>
    <td>OSTree Repo</td>
    <td>Hosts the ostree repo used to provision devices</td>
    <td>tcp/8080</td>
    <td>workshop-rhde_tse</td>
  </tr>
  <tr>
    <td>Attendance</td>
    <td>Nodejs web server with student pages/information</td>
    <td>tcp/3000</td>
    <td>workshop-rhde_tse</td>
  </tr>
</table>

To restart these services, restarting the pods is safe:
```
# Restart priv pod
sudo podman pod restart workshop-rhde_tse-priv

# Restart non-priv pod
podman pod restart workshop-rhde_tse
```

In addition, individual containers can be restarted.

## Provisioning Ahead of Time

If you plan to provision a device then transport it to the demo location, run the `start-workshop.yml` playbook to bring the demo up after the device has been shutdown and moved:

```
ansible-navigator run provisioner/start_workshop.yml -e @your.extra-vars.yml -i your.local-inventory.yml -m stdout -v
```

If using virtual machines, it's easiest to simply suspend them then resume when ready to present.

> Note:
>
> The internal interface of the device should be the same. If it is not, the dnsmasq container would need to be rebuilt.

## Moving the Active Image in the rpm-ostree Repo

There are 5 images in the rpm-ostree repo, when starting the demo the active image version should be 1.0.0. As you progress through the slides, you'll want to move the active image to 2.0.0, 3.0.0, etc, so you can update the edge device.

To update the active image, use the following command:
```
ansible-navigator run provisioner/set-active-image.yml -e @your.extra-vars.yml -i your.local-inventory.yml -e "desired_image_verion=1.0.0" -m stdout -v
```

> Note:
>
> Image version 1.0.0 is used as an example here, update accordingly.
