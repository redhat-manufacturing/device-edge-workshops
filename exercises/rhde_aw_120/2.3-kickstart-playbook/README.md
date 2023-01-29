# Workshop Exercise 2.3 - Templating Out Our Kickstart

## Table of Contents

* [Objective](#objective)
* [Step 1 - Writing a Playbook to Template out our Kickstart](#step-1---writing-a-playbook-to-template-out-our-kickstart)
* [Step 2 - Creating a Job Template for our Playbook](#step-2---creating-a-job-template-for-our-playbook)
* [Step 3 - Running the Job Template](#step-3---running-the-job-template)
* [Step 4 - Reviewing the Kickstart File](#step-4---reviewing-the-kickstart-file)
* [Solutions](#solutions)

## Objective

In this exercise, we're going to write a simple playbook to template out our kickstart file, create a job template for it, run the job template, then review the generated kickstart file. Once complete, we should have a functional kickstart ready to use with our edge devices.

### Step 1 - Writing a Playbook to Template out our Kickstart

Return to the code repo via however you were editing files (VSCode, VIM, etc), and create a new playbook in the `playbooks/` directory of your repo, called `template-kickstart.yml`. We'll only need one task for this playbook, and can just write our task directly into the playbook over creating a role.

{% raw %}
```yaml
---

- name: template out kickstart file
  hosts:
    - all
  become: true
  tasks:
    - name: push templated kickstart file
      ansible.builtin.template:
        src: templates/kickstart.ks.j2
        dest: "/var/www/html/student(your-student-number)-kickstart.ks"
        owner: apache
        group: apache
        mode: '0755'
```
{% endraw %}

A few notes about this playbook:
- We want `hosts: all` because we'll use Ansible Controller to determine what inventories/hosts to target
- We're going to push this to an already created web server so we can view the results quickly. In addition, for devices on a network, the RHEL boot ISO can be used without modification to kickstart a device by specifying the `inst.ks=` boot option. For more information on this, refer to the [Red Hat Knowledgebase](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/performing_an_advanced_rhel_8_installation/starting-kickstart-installations_installing-rhel-as-an-experienced-user).

Once your playbook is constructed, push it up into your git repo.

### Step 2 - Creating a Job Template for our Playbook

> Note:
>
> Be sure to sync your project in Controller before attempting to create this job template.
> To sync it, go to **Resources** > **Project** and click on the sync icon for the only project available

Now that we have a playbook and template, we can build a job template to push our our kickstart file.

Under **Resources** > **Templates**, select **Add** > **Add job template** and enter the following information:

<table>
  <tr>
    <th>Parameter</th>
    <th>Value</th>
  </tr>
  <tr>
    <td>Name</td>
    <td>Template Out Kickstart</td>
  </tr>
  <tr>
    <td>Inventory</td>
    <td>Edge Utilities</td>
  </tr>
  <tr>
    <td>Project</td>
    <td>Device Edge Codebase</td>
  </tr>
  <tr>
    <td>Execution Environment</td>
    <td>Device Edge Workshops Execution Environment</td>
  </tr>
  <tr>
    <td>Playbook</td>
    <td>playbooks/template-kickstart.yml</td>
  </tr>
  <tr>
    <td>Credentials</td>
    <td><ul><li>✓ Ansible Controller API Authentication Info</li><li>✓ Edge Manager SSH Credentials</li><li>✓ Kickstart User</li><li>✓ OSTree Info</li><li>✓ Wireless Network Info</li></ul></td>
  </tr>
  <tr>
    <td>Limit</td>
    <td>edge_manager</td>
  </tr>
   <tr>
    <td>Options</td>
    <td><ul><li>✓ Privilege Escalation</li></ul></td>
  </tr> 
</table>

Remember to click **Save**.

> Note:
>
> If you're not planning to kickstart over wifi, then the `Wireless Network Info` credential is not needed.

### Step 3 - Running the Job Template

Now that the job template has been created, click on the rocket ship to launch the job template. Monitor the output for any errors or issues, however hopefully the job executes successfully.

As a reminder, the output of jobs can be reviewed on the **Jobs** tab.

### Step 4 - Reviewing the Kickstart File

Once the job has completed, the kickstart file can be viewed immediately via connecting to a web server. Open a web browser and navigate to `http://(kickstart-host-from-your-student-page)/student$(your-student-number)-kickstart.ks`

Ideally, the variables and conditional blocks will have templated out, and the kickstart will be filled out with all the correct information. Give it a once-over to confirm the values you're expecting are present.

Remember: a chunk of the playbook was surrounded by the `raw` key, meaning Ansible didn't attempt to resolve/replace the variables and simply put down what was there. This is by design, as our playbook has some of its own variables.

### Solutions

Template Kickstart job template:

![Template Kickstart Job Template](../images/template-kickstart-job-template.png)

Template Kickstart select credentials:

![Template Kickstart Select Credentials](../images/template-kickstart-select-credentials.png)

---
**Navigation**

[Previous Exercise](../2.2-kickstart-creds) | [Next Exercise](../2.4-build-iso)

[Click here to return to the Workshop Homepage](../README.md)
