# Workshop Exercise 4.3 - Create Automation to Deploy Application

## Table of Contents

* [Objective](#objective)
* [Step 1 - Setting Up a Role](#step-1---setting-up-a-role)
* [Step 2 - Setting Up the MQTT Service](#step-2---setting-up-the-mqtt-service)
* [Step 3 - Setting Up The Simulator Service](#step-3---setting-up-the-simulator-service)
* [Step 4 - Setting Up The Control Service](#step-4---setting-up-the-control-service)
* [Step 5 - Setting Up the UI Service](#step-5---setting-up-the-ui-service)
* [Conclusion](#conclusion)

## Objective

In this exercise, we'll be creating automation to deploy the 4 components of our application. Since our application is 4 individual parts, we'll set up a role to deploy the various components in the correct order.

Reminder: We are going to do things to get this application going THAT YOU SHOULD NOT DO IN PRODUCTION. This is being done with a specific purpose: bare metal applications can be run on device edge, however ensure the proper steps are taken to secure the application and device.

### Step 1 - Setting up a Role

Return to your code repo and create the following directories: `roles/deploy_bare_metal_app/[tasks,files]`. Within the `tasks` directory, create a file called `main.yml` that will be used that to include other task files:

```yaml
---

- name: import mqtt tasks
  ansible.builtin.import_tasks: mqtt.yml

- name: import simulator tasks
  ansible.builtin.import_tasks: simulator.yml

- name: import control tasks
  ansible.builtin.import_tasks: control.yml

- name: import ui tasks
  ansible.builtin.import_tasks: ui.yml

```

### Step 2 - Setting Up the MQTT Service

The MQTT broker is already deployed to the system as it was included as part of the image. However, it was not configured and isn't currently enabled. We'll need to push a configuration, then enable and start the service.

In the `roles/deploy_bare_metal_app/tasks` directory, create a file called `mqtt.yml` with the following contents:
```yaml
---

- name: copy out our config file
  ansible.builtin.copy:
    src: files/mosquitto.conf
    dest: /etc/mosquitto/mosquitto.conf
  register: mqtt_config_updated

- name: enable and start the service
  ansible.builtin.systemd:
    name: mosquitto.service
    state: started
    enabled: true

- name: restart the service if config changed
  ansible.builtin.systemd:
    name: mosquitto.service
    state: restarted
  when:
    - mqtt_config_updated.changed

```

In the `files` directory of the `deploy_bare_metal_app` role, create a file called `mosquitto.conf` with the following content:
```
listener 1883
allow_anonymous true
```

These steps should get our MQTT broker up and ready.

### Step 3 - Setting Up The Simulator Service

The Simulator requires a few packages that are not included in the image. While the recommended approach would be to compose a new image with these packages included, we can also install packages "out-of-band" via `rpm-ostree`. Add the following tasks to a file called `simulator.yml` within the `tasks` directory to perform this action within our role.

```yaml
---

- name: create a directory for the simulator
  ansible.builtin.file:
    path: /var/simulator
    state: directory
  register: simulator_directory_created

- name: clone the code to the directory
  ansible.builtin.git:
    repo: https://github.com/jjaswanson4/process-demo-simulate.git
    dest: /var/simulator
  when:
    - simulator_directory_created.changed

- name: install npm out-of-band
  community.general.rpm_ostree_pkg:
    name: http://$(ip-or-hostname-from-student-page)/packages/npm-8.19.2-1.16.18.1.3.module+el8.7.0+17465+1a1abd74.x86_64.rpm
  register: npm_installed

- name: install typescript out-of-band
  community.general.rpm_ostree_pkg:
    name: http://$(ip-or-hostname-from-student-page)/packages/nodejs-typescript-4.1.3-4.fc36.noarch.rpm
  register: typescript_installed

- name: reboot if we installed packages
  ansible.builtin.reboot:
    reboot_command: systemctl reboot
    reboot_timeout: 300
  when:
    - npm_installed.changed or
      typescript_installed.changed

- name: install the depedencies
  community.general.npm:
    path: /var/simulator

- name: run tsc
  ansible.builtin.shell:
    cmd: tsc
    chdir: /var/simulator
    creates: /var/simulator/dist

- name: push out systemd file
  ansible.builtin.copy:
    src: files/simulator.service
    dest: /etc/systemd/system/simulator.service
    owner: root
    group: root
    mode: '0644'
  register: simulator_service_file

- name: reload systemd if needed
  ansible.builtin.systemd:
    daemon_reload: true
  when:
    - simulator_service_file.changed

- name: ensure the service is enabled/started
  ansible.builtin.systemd:
    name: simulator.service
    state: started
    enabled: true
```

In the `files/` directory of our `deploy_bare_metal_app` role, add the following to a file named `simulator.service`:
```
[Unit]
Description=Run Simulator service
After=mosquitto.service

[Service]
WorkingDirectory=/var/simulator
Environment=MQTT_URI=mqtt://localhost:1883
ExecStart=/usr/bin/node dist/tank.js

[Install]
WantedBy=multi-user.target
```

There are quite a few tasks that we have configured within this role previous: we have to grab the code, install dependencies, and manually set up a systemd file.

Assuming these tasks run successfully, the simulate portion of our application will be up and running when the role is executed.

> **Note**
>
> Previously, we installed packages onto the system "out of band", meaning that we pulled them directly to the system and had rpm-ostree apply them to the deployed image. This functionality exists and is useful for testing, such as in development environments; but, this is not a recommended practice. The proper flow is to add the packages to the image using Image Builder.

### Step 4 - Setting Up The Control Service

The Control service also relies on a package we previously installed, and also brings its own complications to the equation. We'll take a few additional, not-advised steps, to get this service running.

In the `tasks/` directory of our `deploy_bare_metal_app` role, create a file called `control.yml` and enter the following:
```yaml
---

- name: turn off selinux to run as service
  ansible.posix.selinux:
    state: permissive
    policy: targeted

- name: create a directory for the control service
  ansible.builtin.file:
    path: /var/control
    state: directory
  register: control_directory_created

- name: clone the code to the directory
  ansible.builtin.git:
    repo: https://github.com/jjaswanson4/process-demo-control.git
    dest: /var/control
  when:
    - control_directory_created.changed

- name: install the depedencies
  community.general.npm:
    path: /var/control
    production: true

- name: modify package.json
  ansible.builtin.lineinfile:
    path: /var/control/package.json
    regexp: 'start'
    line: '    "start": "node-red flows.json"'

- name: push out systemd file
  ansible.builtin.copy:
    src: files/control.service
    dest: /etc/systemd/system/control.service
    owner: root
    group: root
    mode: '0644'
  register: control_service_file

- name: reload systemd if needed
  ansible.builtin.systemd:
    daemon_reload: true
  when:
    - control_service_file.changed

- name: ensure the service is enabled/started
  ansible.builtin.systemd:
    name: control.service
    state: started
    enabled: true
```

Similar to the Simulator service created previously, we'll also need a service file. Create a file in the `files/` directory of our `deploy_bare_metal_app` role called `control.service` and paste in the following:
```
[Unit]
Description=Run Control service
After=simulator.service

[Service]
User=root
Group=root
WorkingDirectory=/var/control
ExecStart=/bin/npm start

[Install]
WantedBy=multi-user.target
```

### Step 5 - Setting Up the UI Service

Finally, we'll perform a similar setup for our UI serice. Create a file called `ui.yml` in the `tasks/` directory of your role:
```yaml
---

- name: create a directory for the ui service
  ansible.builtin.file:
    path: /var/ui
    state: directory
  register: ui_directory_created

- name: clone the code to the directory
  ansible.builtin.git:
    repo: https://github.com/jjaswanson4/process-demo-ui.git
    dest: /var/ui
  when:
    - ui_directory_created.changed

- name: install the depedencies
  community.general.npm:
    path: /var/ui
    production: true

- name: modify package.json
  ansible.builtin.lineinfile:
    path: /var/ui/package.json
    regexp: 'start'
    line: '    "start": "node-red flows.json"'

- name: push out systemd file
  ansible.builtin.copy:
    src: files/ui.service
    dest: /etc/systemd/system/ui.service
    owner: root
    group: root
    mode: '0644'
  register: ui_service_file

- name: reload systemd if needed
  ansible.builtin.systemd:
    daemon_reload: true
  when:
    - ui_service_file.changed

- name: ensure the service is enabled/started
  ansible.builtin.systemd:
    name: ui.service
    state: started
    enabled: true

- name: allow 1881 through the firewall
  ansible.posix.firewalld:
    port: 1881/tcp
    zone: public
    permanent: true
    state: enabled
    immediate: true
```

And the service file named `ui.service` in `files/` directory:
```
[Unit]
Description=Run Simulator service
After=control.service

[Service]
WorkingDirectory=/var/ui
Environment=PORT=1881
ExecStart=/bin/npm start

[Install]
WantedBy=multi-user.target
```

### Conclusion

Our role is now complete. Remember to commit and push what we've created here to the code repo.

It's important to reiterate a few of the egregious security violations we've committed to get this app running, most notably:
- SELinux was set to permissive
- Running services as root

These are unacceptable in a production setting.

In the next section, we'll create a playbook for this role and run it against our devices via Ansible Controller.

---
**Navigation**

[Previous Exercise](../0.1-upgrade-rhde) | [Next Exercise](../4.4-deploy-bare-metal-app)

[Click here to return to the Workshop Homepage](../README.md)