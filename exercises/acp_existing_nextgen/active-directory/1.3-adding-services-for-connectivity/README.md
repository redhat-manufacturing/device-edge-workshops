# Workshop Exercise 1.2 - Adding Services for Connectivity

## Table of Contents

* [Objective](#objective)
* [Guide](#guide)
   * [Your Lab Environment](#your-lab-environment)
   * [Completing the Exercises](#completing-the-exercises)

## Objective

* Understand definitions for virtual machines
* Create a template that can be looped

## Step 1 - Adding Service Templates to the Chart
Since our virtual machines exist within the normal OpenShift SDN, we'll need a service to allow things to connect to it, such as Ansible.

We'll want to have the service provide connectivity to the [WinRM](https://en.wikipedia.org/wiki/Windows_Remote_Management) port on the Windows VMs, which is port 5985/tcp.

Within the `active-directory/templates` directory, add a new file named `service.yaml`, and add the following contents:
```yaml
---
{{- range .Values.virtualMachines }}
---
apiVersion: v1
kind: Service
metadata:
  name: {{ .name }}-winrm
  labels:
    app.kubernetes.io/part-of: {{ .partOf }}
spec:
  selector:
    kubevirt.io/domain: {{ .name }}
  ports:
    - name: winrm
      protocol: TCP
      port: 5985
      targetPort: 5985
{{- end }}
```

What's a bit different in this service is the selector - instead of looking for an app label, the name of the virtual machine is used. This will result in the service attaching to the virt-helper pod of the virtual machine.

ADD PICTURE

In addition, the same looping function is used, so for each VM, a service will be created with the name `$(VM_NAME)-winrm`.

ADD PICTURE

The fully-qualified hostname of the service will later be used by Ansible Controller to communicate to the virtual machine.

ADD PICTURE

## Step 2 - Adding the Service Template to the Code Repo
With the template for the winrm services completed, be sure to commit and push the new code if using an IDE, or hit save if using the Gitea web interface.

---
**Navigation**

[Next Exercise](../1.2-student-pages/)

[Click here to return to the Workshop Homepage](../README.md)
