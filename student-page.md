# Markup of Student Page with Info

> Note: The current formatting is fine overall, but there's more information to be displayed.

## Added Header: General Information
Link to workshop excercises: $(populated_by_provisioner)

If using AWS resources, use the following network information to kickstart:

IP Address: $(edge_management_aws.ansible_host)
DNS Hostname: $(controller.ec2_prefix.workshop_dns_zone)

If using local resources, use the following network information to kickstart:

IP Address: $(edge_management_local.ansible_host)
DNS Hostname: Probably N/A

## Workbench Information

### AWS Resources

Source control (Gitea) Access:
(in a box)
WebUI Link: $(populated by provisioner)
Username: student$(student_number)
Password: $(admin_password)

Image Builder Access:
(in a box)
WebUI Link: $(populated by provisioner)
Username: student$(student_number)
Password: $(admin_password)

Ansible Controller Access:
(in a box)
WebUI Link: $(populated by provisioner)
Username: student$(student_number)
Password: $(admin_password)

Hypervisor Access:
(in a box)
WebUI Link: $(populated by provisioner)
Username: student$(student_number)
Password: $(admin_password)

Hypervisor SSH Access:
(Keep copy-able boxes)
Hostname: $(populated by provisioner)
Username: student$(student_number)
Password: $(admin_password)

### Local Resources

Source control (Gitea) Access:
(in a box)
WebUI Link: $(populated by provisioner)
Username: student$(student_number)
Password: $(admin_password)

Image Builder Access:
(in a box)
WebUI Link: $(populated by provisioner)
Username: student$(student_number)
Password: $(admin_password)

Ansible Controller Access:
(in a box)
WebUI Link: $(populated by provisioner)
Username: student$(student_number)
Password: $(admin_password)
