# Workshop Exercise 3.2 - Converting Our Image Definition to Code

## Table of Contents

* [Objective](#objective)
* [Step 1 - Reviewing the infra.osbuild Collection](#step-1---reviewing-the-infraosbuild-collection)
* [Step 2 - Converting Our Image Definition to Code](#step-2---converting-our-image-definition-to-code)
* [Solutions](#solutions)

## Objective

In this exercise, we are going to review the infra.osbuild collection and convert our WebUI configured image over to something we can use in an automated process.

This exercise will cover:

* The infra.osbuild collection
* How to convert our image definition to code

### Step 1 - Reviewing the infra.osbuild Collection
![infra.osbuild Summary](https://lh3.googleusercontent.com/PY2gALgNrNmJcBw1QHM6FYUHkQrEBlxEPrdZYRSNTM9dMrBiF71pEfKDk3eVFbg30Do6cEKGGnKa8sg0FrDHRvTfm3bgLMpkaP22T_GkBqHSHikc8cRH8qeKE8mi42ZfmEuYnOPKOcCpwveCgAdsUL0)

At a high level, the [infra.osbuild](https://www.ansible.com/blog/ansible-validated-content-introduction-to-infra.osbuild-collection) collection allows us to use Ansible to automate the previous exercise. We treat Image Builder as a "service" as sorts, simply feeding in our image definition and getting our composed image on the other end.

Because we're converting our image definition over to code, we can apply some best practices (such as proper CI) to ensure our edge images are thoroughly tested before being rolled out to devices.

### Step 2 - Converting Our Image Definition to Code

In the previous chapter, we built an image using the WebUI, and made customizations as we went through the various screens. To convert this over to code, we'll pull our desired configurations and assign them to the variables the collection expects.

Let's start with an empty set of variables and walk through them:
```yaml
builder_blueprint_name:
compose_type:
builder_compose_pkgs:
builder_compose_customizations:
```

First: `builder-blueprint-name` is the same as when we entered a blueprint name into the WebUI. This time, let's call ours `student$(your-student-number)-blueprint-ansible`, for example:
```yaml
builder_blueprint_name: student1-blueprint-ansible
```

Next is `compose_type`, which we'll set to `edge-commit` like we did previously:
```yaml
compose_type: edge-commit
```

After that, `builder_compose_pkgs` expects a list of packages to add to the image. Same as before, we'll add `podman` and `vim-enhanced`, and also a new package to help us manage wifi network connectivity:
```yaml
builder_compose_pkgs:
  - podman
  - vim-enhanced
  - NetworkManager-wifi
```

Finally, we can specify our final customizations under the `builder_compose_customizations` dictionary:
```yaml
builder_compose_customizations:
  user:
    name: ansible
    password: "$(password-from-your-student-page)"
    groups:
      - users
      - wheel
```

In this image, let's leave the hostname unconfigured, and instead set it after the fact with Ansible later. In addition, we've added Ansible to the wheel group so it has administrative access on the system.

Take these customizations and create a file at `playbooks/files/image-definition.yml` with these variables. Be sure to save/commit your changes to your git repo.

> **Note:**
>
> It is absolutely not a good idea to commit passwords or secrets to a code repository. Don't do this in production.

### Solutions

A fully populated `playbooks/files/image-definition.yml`:
```yaml
builder_blueprint_name: student1-blueprint-ansible
compose_type: edge-commit
builder_compose_pkgs:
  - podman
  - vim-enhanced
  - NetworkManager-wifi
builder_compose_customizations:
  user:
    name: ansible
    password: "$(password-from-your-student-page)"
    groups:
      - users
      - wheel
```

---
**Navigation**

[Previous Exercise](../2.1-image-build-workflow) | [Next Exercise](../3.1-fixme)

[Click here to return to the Workshop Homepage](../README.md)
