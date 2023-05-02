# Workshop Exercise 5.1 - Creating Automation to Deploy a Containerized Application

## Table of Contents

* [Objective](#objective)
* [Step 1 - Crafting Our Kubernetes YAML](#step-1---crafting-our-kubernetes-yaml)
* [Step 2 - Including the Application Definition in our Code Repo](#step-2---finishing-out-our-ansible-role)
* [Step 3 - Creating a Playbook to Deploy the Application](#step-3---creating-a-playbook-to-deploy-the-application)
* [Step 4 - Putting It All Together](#step-4---putting-it-all-together)

## Objective

In this exercise, we'll be leveraging the [play kube](https://docs.podman.io/en/v3.4.4/markdown/podman-play-kube.1.html) functionality of podman to deploy our application using Kubernetes manifests (yaml). This creates alignment between applications running within a full Kubernetes cluster, such as OpenShift, and those that are deployed to locations where Kubernetes isn't available.

### Step 1 - Crafting Our Kubernetes YAML

> **Note**
>
> For a quick review of our example application, return to [Exercise 1.5](../1.5-application-intro)

Our sample application is broken up into four individual containers, which we'll run within a single pod to allow for them to communicate using the same context for localhost.

Let's consider the following yaml:
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

Here, we can see the individual containers, which each contain a component (or service) of the application, grouped into a pod named `process-control`. Each container has a name and an image, and the UI container also gets an external port mapping.

### Step 2 - Including the Application Definition in our Code Repo

With our yaml crafted, we can place this file into our code repo and reference it in a playbook in a later step.

Back in our code repo, create a file at `playbooks/files/app-definition.yaml`, and enter the the yaml from Step 1. Once complete, remember to commit and push the code, if using an IDE or git on the CLI.

### Step 3 - Creating a Playbook to Deploy the Application

Now that our application is defined, we can leverage Ansible to handle a few of the pre-configuration we'll need to run the app.

First, let's enable lingering for the user Ansible is using to authenticate to the system:

```yaml
{% raw %}
- name: enable lingering for {{ ansible_user }}
  ansible.builtin.shell:
    cmd: loginctl enable-linger {{ ansible_user }}
  args:
    creates: "/var/lib/systemd/linger/{{ ansible_user }}"
  become: true
{% endraw %}
```

The other step we'll need to take is allowing port 1881 through the device's firewall:
```yaml
- name: allow 1881 through the firewall
  ansible.posix.firewalld:
    port: 1881/tcp
    zone: public
    permanent: true
    state: enabled
    immediate: true
  become: true
```

These two steps could be considered "prerequisities" to running the application. Now, let's deploy the app itself: first by pushing the yaml to the device, then having podman pick up on that yaml and start up the application.

```yaml
{% raw %}
- name: push out yaml
  ansible.builtin.copy:
    src: files/app-definition.yml
    dest: "/home/{{ ansible_user }}/process-control.yaml"

- name: podman play kube
  containers.podman.podman_play:
    kube_file: "/home/{{ ansible_user }}/process-control.yaml"
    state: started
  notify: _wait_for_startup
{% endraw %}
```

In the task to start up the application, we've included a scoped `notify` so our automation doesn't complete until the application fires up the first time. In Ansible, we call these [handlers](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_handlers.html#handlers).

Our handler would look like this:
```yaml
- name: wait for app startup
  ansible.builtin.wait_for:
    port: 1881
  listen:
    - _wait_for_startup
```

Notification to handlers is only done when a change is made.

This is included to address the startup time for the application. Since container images will need to be pulled, there will be a slight delay as those images are pulled and stored locally.

### Step 4 - Putting It All Together

With the pieces above, we can put together a playbook to use to deploy our application. Copy the following to a file at `playbooks/deploy-app.yml`:
```yaml
---

- name: deploy application to edge device
  hosts:
    - all
  pre_tasks:
{% raw %}
    - name: enable lingering for {{ ansible_user }}
      ansible.builtin.shell:
        cmd: loginctl enable-linger {{ ansible_user }}
      args:
        creates: "/var/lib/systemd/linger/{{ ansible_user }}"
      become: true
{% endraw %}
    - name: allow 1881 through the firewall
      ansible.posix.firewalld:
        port: 1881/tcp
        zone: public
        permanent: true
        state: enabled
        immediate: true
      become: true
  tasks:
{% raw %}
    - name: push out yaml
      ansible.builtin.copy:
        src: files/app-definition.yml
        dest: "/home/{{ ansible_user }}/process-control.yaml"

    - name: podman play kube
      containers.podman.podman_play:
        kube_file: "/home/{{ ansible_user }}/process-control.yaml"
        state: started
      notify: _wait_for_startup
{% endraw %}
  handlers:
    - name: wait for app startup
      ansible.builtin.wait_for:
        port: 1881
      listen:
        - _wait_for_startup
```

Again, feel free to get this playbook into to your code repo however you'd like: the Gitea web interface, an IDE, git on the CLI, or whatever you're comfortable with.

---
**Navigation**

[Previous Exercise](../4.2-initial-call-home) | [Next Exercise](../5.2-configuring-controller)

[Click here to return to the Workshop Homepage](../README.md)
