# Workshop Exercise 2.3 - Creating Custom Credentials for Kickstart Template

## Table of Contents

* [Objective](#objective)
* [Step 1 - Kickstart Basics](#step-1---kickstart-basics)
* [Step 2 - OSTree Specific Setup](#step-2---ostree-specific-setup)
* [Step 3 - Adding Networking Information](#step-3---adding-network-information)
* [Step 4 - Creating a Call Home Playbook](#step-4---creating-a-call-home-playbook)
* [Step 5 - Using Systemd to Run the Playbook on First Boot](#step-5---using-systemd-to-run-the-playbook-on-first-boot)
* [Solutions](#solutions)

## Objective

In this exercise, we're going to leverage the [custom credential types](https://docs.ansible.com/ansible-tower/latest/html/userguide/credential_types.html) feature of Ansible Controller to securely store some information that'll be templated into our kickstart files.

This gives us some additional functionality because:
1. Sensitive information will be stored in Ansible Controller securely
2. Multiple credentials can be built off the same credential to allow for provisioning differences between sites/geos/etc.

## Quick Review

In the [previous exercise](../2.2-kickstart-template/), we set up our kickstart template with some variables, specifically for the following information:

For the user created during kickstart:
|Variable|Description|
|---|---|
|`kickstart_user_username`|The username of the user that will be created on the system|
|`kickstart_user_password`|The password of the user that will be created on the system|

For the ostree repo containing where to pull the commit from:
|Variable|Description|
|---|---|
|`ostree_repo_protocol`|The protocol to use when accessing the repo (http/https)|
|`ostree_repo_host`|The host of the ostree repo|
|`ostree_repo_port`|The port to use when accessing the repo|
|`ostree_repo_path`|The path on the server where the repo can be accessed|
|`ostree_os_name`|The name of the OS in the repo|
|`ostree_ref`|The ref to pull and deploy|

For authenticating to the Ansible Controller API:
|Variable|Description|
|---|---|
|`controller_host`|Where Ansible Controller is running|
|`controller_api_username`|The username to use to authenticate to the Ansible Controller API|
|`controller_api_password`|The password to use to authenticate to the Ansible Controller API|

Optionally, if using wifi for physical devices:
|Variable|Description|
|---|---|
|`wifi_network`|The wireless network's SSID|
|`wifi_password`|The wireless network's password|

In the interest of time, three custom credential types have already been created for you to review.

### Step 1 - Reviewing Created Custom Credential Types

Under the **Administration** tab, select **Credential Types** to view the available custom credential types. There should be three available corresponding to the information above in the [review](#quick-review) section:

![Custom Credential Types](../images/custom-credential-types.png)

Select the **Kickstart User** credential type to view more information:

![Kickstart User Credential Type](../images/kickstart-user-credential-type.png)

Custom credential types are composed to two main concepts: Inputs and Injectors.
- Inputs are how information is retrieved from the user when creating a credential from this credential type. Fields can be selection based or free-form text entry, and can be marked as secret so their value isn't displayed again after entering it.
- Injectors are how the inputs are translated into actual Ansible variables for use during execution. Here, we're injecting the entered information as extra variables, meaning they behave exactly like doing `--extra-vars` on the command line.

Review all three types for familiarity.

### Step 2 - Creating Credentials from Custom Credential Types

Custom credential types behave exactly like other credential types, meaning we simply need to create a new credential and select the type we want.

First, let's create a credential for our kickstart user info. Under **Resources**, select **Credentials**, and clock the **Add** button at the top of the page.

Enter the following information to create a new credential:
<table>
  <tr>
    <th>Parameter</th>
    <th>Value</th>
  </tr>
  <tr>
    <td>Name</td>
    <td>Kickstart User</td>
  </tr>
  <tr>
    <td>Organization</td>
    <td>(Your_Student_Organization)</td>
  </tr>
  <tr>
    <td>Credential Type</td>
    <td>Kickstart User</td>
  </tr>
  <tr>
    <td>Kickstart User Username</td>
    <td>ansible</td>
  </tr>
  <tr>
    <td>Kickstart User Password</td>
    <td>(a-password-of-your-choice)</td>
  </tr>
</table>

Once complete, click **Save**

Repeat the process for OSTree info:
<table>
  <tr>
    <th>Parameter</th>
    <th>Value</th>
  </tr>
  <tr>
    <td>Name</td>
    <td>OSTree Info</td>
  </tr>
  <tr>
    <td>Organization</td>
    <td>(Your_Student_Organization)</td>
  </tr>
  <tr>
    <td>Credential Type</td>
    <td>OSTree Info</td>
  </tr>
  <tr>
    <td>OSTree Repo Protocol</td>
    <td>http</td>
  </tr>
  <tr>
    <td>OSTree Repo Host</td>
    <td>$(kickstart-host-from-student-page)</td>
  </tr>
  <tr>
    <td>OSTree Repo Port</td>
    <td>80</td>
  </tr>
  <tr>
    <td>OSTree Repo Path</td>
    <td>rhde-image/repo</td>
  </tr>
  <tr>
    <td>OSTree OS Name</td>
    <td>rhel</td>
  </tr>
  <tr>
    <td>OSTree Ref</td>
    <td>rhel/8/x86_64/edge</td>
  </tr>
</table>

Remember to click **Save**.

And again for authenticating to the Ansible Controller API:
<table>
  <tr>
    <th>Parameter</th>
    <th>Value</th>
  </tr>
  <tr>
    <td>Name</td>
    <td>Ansible Controller API Authentication Info</td>
  </tr>
  <tr>
    <td>Organization</td>
    <td>(Your_Student_Organization)</td>
  </tr>
  <tr>
    <td>Credential Type</td>
    <td>Ansible Controller API Authentication Info</td>
  </tr>
  <tr>
    <td>Controller Host</td>
    <td>$(controller-host-from-your-student-page)</td>
  </tr>
  <tr>
    <td>Controller API Username</td>
    <td>student$(your-student-number)</td>
  </tr>
  <tr>
    <td>Controller API Password</td>
    <td>$(your-controller-password-from-your-student-page)</td>
  </tr>
</table>

Remember to click **Save**.

Finally, if provisioning a physical device over wireless, create a final credential for wireless information:

<table>
  <tr>
    <th>Parameter</th>
    <th>Value</th>
  </tr>
  <tr>
    <td>Name</td>
    <td>Wireless Network Info</td>
  </tr>
  <tr>
    <td>Organization</td>
    <td>(Your_Student_Organization)</td>
  </tr>
  <tr>
    <td>Credential Type</td>
    <td>Wireless Network Connection Info</td>
  </tr>
  <tr>
    <td>Wireless Network SSID</td>
    <td>(provided-by-your-instructor)</td>
  </tr>
  <tr>
    <td>Wireless Network Password</td>
    <td>(provided-by-your-instructor)</td>
  </tr>
</table>

Remember to click **Save**.

We'll attach these credentials to a job template in the next exercise.

### Solutions

Kickstart User credential:

![Kickstart User Credential](../images/kickstart-user-credential.png)

OSTree Info credential:

![OSTree Info Credential](../images/ostree-credential.png)

Ansible Controller API credential:

![Ansible Controller API Credential](../images/controller-api-credential.png)

Wireless Network credential:

![Wireless Network Credential](../images/wireless-credential.png)

> Note:
>
> Some values may be different, depending on the lab environment. Refer any questions to the lab instructor.

---
**Navigation**

[Previous Exercise](../2.2-kickstart-template) | [Next Exercise](../2.4-kickstart-playbook)

[Click here to return to the Workshop Homepage](../README.md)