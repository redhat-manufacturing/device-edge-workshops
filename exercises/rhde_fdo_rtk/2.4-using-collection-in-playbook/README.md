# Workshop Exercise 2.4 - Using the infra.osbuild Collection in a Playbook

## Table of Contents

* [Objective](#objective)
* [Step 1 - Including a Vars File in a Playbook](#step-1---including-a-vars-file-in-a-playbook)
* [Step 2 - Converting Our Image Definition to Code](#step-2---converting-our-image-definition-to-code)
* [Solutions](#solutions)

## Objective

In this exercise, we are going to construct a playbook to read in our image definition and call the appropriate role in the infra.osbuild collection.

This exercise will cover:

* Loading in a vars file
* Calling a role in a collection from a playbook

### Step 1 - Including a Vars File in a Playbook
First, let's start a new file in our code repo: `playbooks/compose-image.yml`. This will be a playbook that we'll use to build our images. This playbook will look very similar to other Ansible playbooks:
```yaml
---

- name: compose an image via Image Builder
  hosts:
    - all
  vars_files:
    - files/image-definition.yml
```

Ansible has a keyword at the playbook to [automatically read in variable files](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_variables.html#defining-variables-in-included-files-and-roles) that we'll use to read in the vars file we previously created, which is what the last two lines of the playbook above do. Also note: we're using the relative path to our image definition vars file, but also could use an absolute path if we wanted.

Later on, we'll load it into a job template in Controller, but let's continue to build our playbook.

### Step 2 - Converting Our Image Definition to Code
All we need to do now is have the playbook run the appropriate role from the infra.osbuild collection. Currently, the collection has two roles: one for setting up Image Builder called `setup_server`, and another for composing images called `builder`.

Because we're calling a role within a collection, we'll need the role's [fully qualified](https://docs.ansible.com/ansible/latest/dev_guide/migrating_roles.html) name in our playbook:
```yaml
  roles:
    - infra.osbuild.builder
```

This rounds our playbook. Be sure to save/commit this playbook to your code repo.

### Solutions

A fully composed playbook at `playbooks/compose-image.yml`:
```yaml
---

- name: compose an image via Image Builder
  hosts:
    - all
  vars_files:
    - files/image-definition.yml
  roles:
    - infra.osbuild.builder    
```

---
**Navigation**

[Previous Exercise](../2.3-image-definition-in-code) | [Next Exercise](../2.5-aap-image-build)

[Click here to return to the Workshop Homepage](../README.md)
