# Workshop Exercise 1.7 - Cloning Your Code Repository

## Table of Contents

* [Objective](#objective)
* [Step 1 - Reviewing the Code Repo Location](#step-1---reviewing-the-code-repo-location)
* [Step 2 - Cloning Your Code Repo](#step-2---cloning-your-code-repo)

## Objective

In this exercise, we are going to clone our git repository so we can begin adding content including playbooks/roles/etc.

This exercise will cover:

* Understanding where the repo is located
* Cloning the git repo

> **Note**
>
> This section is a bit ambiguous by design: feel free to use your laptop, SSH into the hypervisor node (if available), use your favorite IDE, sling code on the command line via VIM (which is better than Nano)... you're free to use whatever you're comfortable with. [VSCode](https://code.visualstudio.com/docs/setup/linux) + the [Ansible extension](https://marketplace.visualstudio.com/items?itemName=redhat.ansible) is a suggested approach.

### Step 1 - Reviewing the Code Repo Location

Your git repository is located in Gitea, which can be accessed via a web interface for viewing, and can be authenticated to via username/password authentication over http. Feel free to also setup authentication via SSH keys if you so desire. You can access the settings to add an SSH key for your Gitea user by clicking on the arrow in the top right next to your randomly-generated profile picture, selecting "Settings," and heading to the "SSH / GPG Keys" tab. You can add any public key you have the private key for locally to this user and use this for local access - it doesn't impact the project sync configuration on the Controller.

For a reminder on how to access Gitea, review  the [Investigating Source Control](../1.6-gitea-intro) exercise.

### Step 2 - Cloning Your Code Repo

For most, simply running `git clone` into a directory of your choosing will suffice. If you're using an IDE/etc, feel free to modify the process to fit your needs.

> Note:
>
> Since Gitea is running OpenShift with just the web service exposed, use https when cloning your code repo.

---
**Navigation**

[Previous Exercise](../1.6-gitea-intro) | [Next Exercise](../1.8-ocp-login)

[Click here to return to the Workshop Homepage](../README.md)
