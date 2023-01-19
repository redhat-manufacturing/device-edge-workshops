# Workshop Exercise 3.3 - Observing Zero Touch Provisioning

## Table of Contents

* [Objective](#objective)
* [Step 1 - Copying Our Customized ISO to the VM Storage](#step-1---copying-our-customized-iso-to-the-vm-storage)
* [Step 2 - Attaching the ISO to your Virtual Machine](#step-2---attaching-the-iso-to-your-virtual-machine)
* [Step 3 - Adjusting the Boot Options](#step-3---adjusting-the-boot-options)
* [Step 4 - Powering On the Virtual Machine](#step-4---powering-on-the-virtual-machine)
* [Solutions](#solutions)

## Objective

In this exercise, we'll ensure our devices correctly provisioned without our intervention.

Assuming everything worked correctly, two things should now be present in Ansible Controller:
- A new host in our `Edge Devices` with connection infromation
- The jobs in our provisioning workflow run

### Step 1 - Investigating Our New Host Entry

Within Ansible Controller, select the **Inventories**, and then select our **Edge Systems** inventory. Under the **Hosts** tab, a new entry should have appeared. The name for the device is generated from the MAC address, so the name will be something along the lines of `edge-525400433c01`.

![Host Entry](../images/host-entry.png)

Clicking on the host entry brings up more information about the host. An important piece to note is un the **Details** tab, under the **Variables** section:

![Host Details](../images/host-facts.png)

Here we can see that the `ansible_host` variable has been defined with the device's current IP address, which Ansible determined and sent as part of the call home.

For quick review, this part of the playbook contained within our kickstart handled this:
{% raw %}
```
    - name: create host in inventory {{ controller_inventory }}
      ansible.builtin.uri:
        url: "{{ controller_url }}/inventories/{{ controller_inventory_id }}/hosts/"
        method: POST
        body_format: json
        body:
          name: "edge-{{ ansible_default_ipv4.macaddress | replace(':','') }}"
          variables:
            'ansible_host: {{ ansible_default_ipv4.address }}'
```
{% endraw %}

### Step 2 - Investigating The Workflow Run

Under the **Jobs** tab, three new jobs should have run: a workflow job, a source control update, and a playbook run.

![Workflow Run](../images/workflow-run.png)

As part of the Ansible playbook embedded in the kickstart, our previously created workflow was kicked off with a limit of just the device calling home. This can be confirmed by clicking on the Workflow Job and checking out the details tab:

![Workflow Run Details](../images/workflow-run-details.png)

Now that our device is up and has called home, it can be managed centrally via Ansible Controller, which is what we'll be leveraging to deploy our workload to the device.

---
**Navigation**

[Previous Exercise](../3.2-boot-edge-vm) | [Next Exercise](../3.4-rhde-os-intro)

[Click here to return to the Workshop Homepage](../README.md)