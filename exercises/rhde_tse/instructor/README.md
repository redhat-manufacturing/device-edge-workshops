# Instructor Guide

## What to do During the Workshop
This workshop is mostly self-paced, however instruction can be given for the introduction exercises if students are unfamiliar with the technologies or concepts.

Ensure students are on the lab network (WiFi or otherwise) before beginning, otherwise they won't be able to access the workshop services.

## Checking On Workshop Services
There's a few different services involved in this workshop. They all should be up and available after provisioning, but if they need convincing use the information below. Remember to connect to the approriate node when attempting to interact with services.

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
    <td>Event Driven Ansible</td>
    <td>Simple EDA server for web requests from devices as they provision</td>
    <td>tcp/5000</td>
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

If you plan to provision a device then transport it to the workshop location, ensure you re-run the `local-connection.yml` playbook to reconfigure your networking settings, then restart the workshop services.

```
ansible-playbook provisioner/local-connection.yml --inventory your.inventory.yml --extra-vars @your.extra-vars.yml -v
```

> Note:
>
> The internal interface of the device should be the same. If it is not, the dnsmasq container would need to be rebuilt.

## Instructor Slides

Make a copy of [this presentation](https://docs.google.com/presentation/d/17Of2B_UPQhn2xQxjyuHrzcCHvpY_4yc9q4FeLB4lbyU/edit#slide=id.g206d893ed30_1_739) and modify slides 1 and 9 with the correct information.
