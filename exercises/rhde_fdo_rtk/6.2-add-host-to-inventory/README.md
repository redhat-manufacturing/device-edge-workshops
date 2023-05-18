# Workshop Exercise 6.2 - Adding out Host to an Inventory

## Table of Contents

* [Objective](#objective)
* [Step 1 - Adding a Host to an Inventory](#step-2---adding-a-host-to-the-inventory)
* [Solutions](#solutions)

## Objective

Ideally, our onboarding script in the previous exercise should have handled this step for us, however as a backup we'll investigate how this is done manually.

Should your host already exist in Ansible Controller, proceed to the next exercise. If not, we'll add our new host to an inventory in Ansible Controller for further automation tasks.

### Step 1 - Adding a Host to an Inventory

Still in the web interface of Ansible Controller, navigate to **Inventories** > **Edge Devices**, and select the **Hosts** tab. Click on the **Add** button and enter the following information:

<table>
  <tr>
    <th>Parameter</th>
    <th>Value</th>
  </tr>
  <tr>
    <td>Name</td>
    <td>edge-device</td>
  </tr>
  <tr>
    <td>Variables</td>
    <td>`ansible_host: (the_ip_address_from_the_cli)`</td>
  </tr>
</table>

When finished, click the **Save** button.

We are now ready to automate against our edge device.

### Solutions

![Edge Device Host](../images/edge-device-host.png)

---
**Navigation**

[Previous Exercise](../6.1-finish-install) | [Next Exercise](../7.1-containerized-app-automation)

[Click here to return to the Workshop Homepage](../README.md)


