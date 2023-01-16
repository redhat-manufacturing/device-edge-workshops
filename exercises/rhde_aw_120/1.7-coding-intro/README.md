# Workshop Exercise 1.7 - Cloning Your Code Repository

## Table of Contents

* [Objective](#objective)
* [Step 1 - Reviewing the Code Repo Location](#step-1---reviewing-the-code-repo-location)
* [Step 2 - Cloning Your Code Repo](#step-2---cloning-your-code-repo)

## Objective

In this exercise, we are going to clone our git repository so we can begin adding playbooks/roles/etc.

This exercise will cover

* Where the repo is located
* Cloning the git repo

> Note:
>
> This section is a bit ambiguous by design: feel free to use your laptop, SSH into the hypervisor node (if available), use your favorite IDE, sling code on the command line via VIM (which is better than Nano)...you're free to use whatever you're comfortable with. Personally, I use [VSCode](https://code.visualstudio.com/docs/setup/linux) + the [Ansible extension](https://marketplace.visualstudio.com/items?itemName=redhat.ansible) on Fedora for most of my coding.

### Step 1 - Reviewing the Code Repo Location

Your git repository is located in Gitea, which can be accessed via a web interface for viewing, and can be authenticated to via username/password auth over http. Feel free to also setup authentication via SSH keys if you so desire.

For a reminder on how to access Gitea, review  the [Investigating Source Control](../1.3-source-control-intro) exercise.

### Step 2 - Cloning Your Code Repo

For most, a simple `git clone` into a directory of your choosing will suffice. If you're using an IDE/etc, feel free to modify the process to fit your needs.

---
**Navigation**

[Previous Exercise](../1.6-network-info) | [Next Exercise](../2.1-provisioning-workflow)

[Click here to return to the Workshop Homepage](../README.md)