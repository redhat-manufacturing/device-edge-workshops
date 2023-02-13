# Workshop Exercise 5.3 - Creating Automation to Deploy a Containerized Application

## Table of Contents

* [Objective](#objective)
* [Step 1 - Crafting Our Kubernetes YAML](#step-1---crafting-our-kubernetes-yaml)
* [Step 2 - Finishing Out Our Ansible Role](#step-2---finishing-out-our-ansible-role)
* [Conclusion](#conclusion)
* [Bonus Steps](#bonus-steps)

## Objective

In this exercise, we'll be leveraging the [play kube](https://docs.podman.io/en/v3.4.4/markdown/podman-play-kube.1.html) functionality of podman to deploy our application using Kubernetes manifests (yaml). This creates alignment between applications running within a full Kubernetes cluster, such as OpenShift, and those that are deployed to locations where Kubernetes isn't available.

### Step 1 - Crafting Our Kubernetes YAML

Return to your code repo and create a new role called `deploy_containerized_app`. First, start by creating the following directories: `roles/deploy_containerized_app/[tasks,templates]`. Within the `templates` directory, create a file called `process-control.yaml.j2` to contain a templatized YAML manifest.

While this will look and feel like Kubernetes YAML, we'll also get to leverage the Ansible's jinja2 templating engine for more flexibility. This would allow for host or group specific variables, such as configuration custom specific environments including industrial sites or different geographical locations.

Our application has been broken up into four containers which are pre-built for us.

Populate the contents of `process-control.yaml.j2` file within the `templates/` directory of the `deploy_containerized_app` role with the following

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: process-control
spec:
  containers:
    - name: mqtt
      image: quay.io/device-edge-workshops/process-control-mqtt:1.0.0
    - name: simulate
      image: quay.io/device-edge-workshops/process-control-simulate:1.0.0
    - name: control
      image: quay.io/device-edge-workshops/process-control-control:1.0.0
    - name: ui
      image: quay.io/device-edge-workshops/process-control-ui:1.0.0
      ports:
        - containerPort: 1881
          hostPort: 1881
```

Here, we can see the four individual containers that will be run together in a pod. In addition, all traffic is kept internal to the pod except for accessing the WebUI on the UI service.

In addition, in contrast to the bare metal deployment, these containers will not be running as root. Here, we're going to set them to run as the same user Ansible is using. However, this also can be customized.

### Step 2 - Finishing Out Our Ansible Role

Similar to our previous automation, we'll need a few tasks to get our application deployed to the system. Create a file in the `tasks/` directory of the `deploy_containerized_app` role named `main.yml` with the following:

```yaml
---

- name: enable lingering for {{ ansible_user }}
  ansible.builtin.shell:
    cmd: loginctl enable-linger {{ ansible_user }}
  args:
    creates: "/var/lib/systemd/linger/{{ ansible_user }}"
  become: true

- name: push out yaml
  ansible.builtin.template:
    src: templates/process-control.yaml.j2
    dest: "/home/{{ ansible_user }}/process-control.yaml"

- name: podman play kube
  containers.podman.podman_play:
    kube_file: "/home/{{ ansible_user }}/process-control.yaml"
    state: started
  register: app_deployed

- name: wait for app startup
  ansible.builtin.wait_for:
    port: 1881
  when:
    - app_deployed.changed

- name: allow 1881 through the firewall
  ansible.posix.firewalld:
    port: 1881/tcp
    zone: public
    permanent: true
    state: enabled
    immediate: true
  become: true

```

Remember to commit and push these new files to your git repository.

### Conclusion

It should be noted that this deployment methodology is infinitely more secure and simple, and is generally a better way to deploy an application.

Not all applications are ready to be containerized, so bare metal deployments are still perfectly acceptable. However,remember to take the necessary steps to secure them, and when possible, attempt to containerize them.

### Bonus Steps

Another highly recommended task to complete when deploying applications is to let systemd start the pod on boot and attempt to restart components should they fail.

[This documentation](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html-single/building_running_and_managing_containers/index#assembly_porting-containers-to-systemd-using-podman_building-running-and-managing-containers) includes more information on this topic.

Podman can generate systemd unit files. On your edge device, running `podman generate systemd --name process-control` will generate the files needed to stdout.

If you have extra time, add automation around this process: after the pod is up and running, have podman generate the systemd unit files, capture the output of that command, then create the unit files and enable the newly created systemd service.

Also consider that Kubernetes YAML can be directly paired with a systemd unit template in podman to rapidly define `podman play kube` systemd units. See [this blog post](https://www.redhat.com/sysadmin/kubernetes-workloads-podman-systemd) for more details.

---
**Navigation**

[Previous Exercise](../0.1-upgrade-rhde) | [Next Exercise](../5.4-deploy-containerized-app)

[Click here to return to the Workshop Homepage](../README.md)
