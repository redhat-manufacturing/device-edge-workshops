# Instructor Guide

## What to do During the Workshop
This workshop is self-paced, with the intention of being completed within 2 hours. The slide deck sets the stage for the workshop, then students should proceed through the exercises at their own pace.

## Checking On Workshop Services
There's a few different services involved in this workshop. They all should be up and available after provisioning, but if they need convincing use the information below. Remember to connect to the approriate node when attempting to interact with services.


<table>
  <tr>
    <th>Workshop Service</th>
    <th>Description</th>
    <th>Network Port</th>
    <th>Restart Command</th>
    <th>Platform</th>
    <th>Student Facing</th>
  </tr>
  <tr>
    <td>Edge Manager Cockpit WebUI</td>
    <td>Web interface for system administration, accessing the Image Builder webUI</td>
    <td>tcp/9090</td>
    <td>sudo systemctl restart cockpit.service</td>
    <td>Local edge management system</td>
    <td>False</td>
  </tr>
  <tr>
    <td>Local rpm-ostree Repo</td>
    <td>Apache web server hosting /var/www/html/rhde-image ostree repo</td>
    <td>tcp/11080</td>
    <td>sudo systemctl restart httpd</td>
    <td>Local edge management system</td>
    <td>False</td>
  </tr>
  <tr>
    <td>Remote rpm-ostree Repo</td>
    <td>Apache web server hosting rpm-ostree repo</td>
    <td>ostree-repo-route</td>
    <td>Delete deployment, re-run provisioner</td>
    <td>OpenShift</td>
    <td>False</td>
  </tr>
  <tr>
    <td>Ansible Controller</td>
    <td>Each student has their own instance of Controller</td>
    <td>controller-route</td>
    <td>Dump application components, let operator rebuild</td>
    <td>OpenShift</td>
    <td>True</td>
  </tr>
  <tr>
    <td>Dnsmasq</td>
    <td>Provides DHCP and DNS for the workshop network</td>
    <td>udp/53</td>
    <td>sudo podman pod restart workshop-rhde_aap_rhsi-priv</td>
    <td>Local edge management system</td>
    <td>False</td>
  </tr>
  <tr>
    <td>Reverse Proxy</td>
    <td>Nginx reverse proxy for workshop services with valid wildcard certiticate</td>
    <td>tcp/80,tcp/443</td>
    <td>podman pod restart workshop-rhde_aap_rhsi</td>
    <td>Local edge management system</td>
    <td>False</td>
  </tr>
  <tr>
    <td>iPXE</td>
    <td>Hosts iPXE menu file</td>
    <td>tcp/8081</td>
    <td>podman pod restart workshop-rhde_aap_rhsi</td>
    <td>Local edge management system</td>
    <td>False</td>
  </tr>
  <tr>
    <td>Gitea</td>
    <td>Source control server for students</td>
    <td>gitea-route</td>
    <td>helm uninstall, re-run provisioner</td>
    <td>OpenShift</td>
    <td>True</td>
  </tr>
  <tr>
    <td>TFTP</td>
    <td>Hosts the installation environment files</td>
    <td>udp/69</td>
    <td>podman pod restart workshop-rhde_aap_rhsi</td>
    <td>Local edge management system</td>
    <td>False</td>
  </tr>
  <tr>
    <td>Attendance</td>
    <td>Nodejs web server with student pages/information</td>
    <td>attendance-route</td>
    <td>Delete deployment, re-run provisioner</td>
    <td>OpenShift</td>
    <td>True</td>
  </tr>
  <tr>
    <td>Hypervisor Cockpit WebUI</td>
    <td>Web interface for system administration, accessing the virtual edge devices</td>
    <td>tcp/9090</td>
    <td>sudo systemctl restart cockpit.service</td>
    <td>hypervisor</td>
    <td>True</td>
  </tr>
  <tr>
    <td>Reverse Proxy</td>
    <td>Nginx reverse proxy for workshop services with valid wildcard certiticate</td>
    <td>tcp/80,tcp/443</td>
    <td>podman pod restart reverse-proxy</td>
    <td>hypervisor</td>
    <td>False</td>
  </tr>
</table>

To restart services, restarting the pods is safe:
```
# Restart priv pod
sudo podman pod restart workshop-rhde_aap_rhsi-priv

# Restart non-priv pod
podman pod restart workshop-rhde_aap_rhsi
```

In addition, individual containers can be restarted.

## Provisioner Notes

All instructions in the main [provisioner file](../../../provisioner/README.md) hold true, **except** this workshop uses a custom playbook over the generic `provision_lab.yml` playbook. Simply replace `provision_lab.yml` with `rhde_aap_rhsi.yml` to provision this workshop.

## Provisioning Ahead of Time

Expected provision time is: 90 minutes. Plan ahead accordingly. Provisioning will take longer on slower connections (ex: hotel wifi, conference wifi, etc).

## OpenShift Admin Tools

{% raw %}
The provisioner runs the OpenShift installation process from the edge-manager system. The `oc` CLI tooling will be automatically installed. The directory `/home/{{ ansible_user }}/ocp-install` will contain the kubeadmin password, kubeconfig, and installation state files/logs.
{% endraw %}