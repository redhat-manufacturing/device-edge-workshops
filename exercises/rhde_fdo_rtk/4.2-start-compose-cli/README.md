# Workshop Exercise 4.2 - Composing an Image via the Composer CLI

## Table of Contents

* [Objective](#objective)
* [Step 1 - Pushing the Blueprint](#step-1---crafting-the-blueprint)

## Objective

In this exercise, we'll build a blueprint to build an edge simplified installer off of our realtime image built earlier.

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
> The infra.osbuild collection automatically hosts `edge-commit` type images on a web server for us, which we can have Image Builder consume to build our installer image. This web server is already set up and listening on port 4080.

To start the build of an `edge-simplified-installer` from the CLI, use the following command:
```
sudo composer-cli compose start-ostree fdo-simplified-installer-student$(your-student-number) edge-simplified-installer --url http://localhost:4080/rhde-fdo-rtk/repo
```

This will submit your compose to the queue. The progress can be monitiored from the CLI or from the WebUI.

> **Note:**
>
> To speed up this workshop, the instructor has already composed this image, and has it ready for you.

---
**Navigation**

[Previous Exercise](../4.1-build-blueprint) | [Next Exercise](../5.1-initial-device-image)

[Click here to return to the Workshop Homepage](../README.md)


