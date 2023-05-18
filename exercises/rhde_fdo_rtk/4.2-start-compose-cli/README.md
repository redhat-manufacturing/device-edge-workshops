# Workshop Exercise 4.2 - Composing an Image via the Composer CLI

## Table of Contents

* [Objective](#objective)
* [Step 1 - Pushing the Blueprint](#step-1---crafting-the-blueprint)
* [Step 2 - Building an Installer Image](#step-2---building-an-installer-image)

## Objective

In this exercise, we'll build a blueprint to build an edge simplified installer off of our realtime image built earlier.

To run these commands, SSH into the edge-manager system using the address and credentials from your student page.

### Step 1 - Pushing the Blueprint

With our blueprint crafted, we can push the blueprint into Image Builder, then later trigger a build off the blueprint.

The following command will push the blueprint into Image Builder:
```
sudo composer-cli blueprints push playbooks/files/blueprint.toml
```

After the command completes, your new blueprint should be visible in the Image Builder WebUI.

### Step 2 - Building an Installer Image

> **Note:**
>
> The infra.osbuild collection automatically hosts `edge-commit` type images on a web server for us, which we can have Image Builder consume to build our installer image. This web server is already set up and listening on port 11080.

To start the build of an `edge-simplified-installer` from the CLI, use the following command:
```
sudo composer-cli compose start-ostree fdo-simplified-installer-student$(your-student-number) edge-simplified-installer --url http://localhost:11080/rhde-image/repo
```

This will submit your compose to the queue. The progress can be monitiored from the CLI or from the WebUI.

> **Note:**
>
> To speed up this workshop, the instructor has already composed this image, and has it ready for you. Connect to the edge-management system for your workshop via SSH, and in your home directory should be an installer ISO, or a link to the shared ISO for the workshop. For information on connecting to the edge-management server, refer to your student page, or use the web-based terminal.

---
**Navigation**

[Previous Exercise](../4.1-build-blueprint) | [Next Exercise](../5.1-device-manufacturer-image)

[Click here to return to the Workshop Homepage](../README.md)


