# Workshop Exercise 4.1 - Building A Edge Simplified Installer Blueprint

## Table of Contents

* [Objective](#objective)
* [Step 1 - Crafting the Blueprint](#step-1---crafting-the-blueprint)

## Objective

In this exercise, we'll build a blueprint to build an edge simplified installer off of our realtime image built earlier.

### Step 1 - Crafting the Blueprint

When building "installer" type images with Image builder, typically the blueprint is left nearly blank, as installers are essentially a "wrapper" that contains the installation bits and the desired image, with the intent of just being enough to get the image applied to disk.

When leveraging FDO, we do customize our blueprint slightly, adding only a device to install to and the FDO information needed.

In your code repo, start a new file at `playbooks/files/blueprint.toml` and copy in the following contents:

```toml
name = "fdo-simplified-installer-student$(your-student-number)"
description = "a simplified installer"
version = "0.0.1"
packages = []
modules = []
groups = []
distro = ""

[customizations]
installation_device = "/dev/sda"

[customizations.fdo]
manufacturing_server_url = "http://192.168.1.1"
diun_pub_key_insecure = "true"
```

Notice the customizations: specifying the device to install to, and the location of the FDO manufacturing server. These will be leveraged when we initially flash the device.

Remember to save and commit your new file to your code repository.

---
**Navigation**

[Previous Exercise](../3.2-fdo-install-config) | [Next Exercise](../4.2-start-compose-cli)

[Click here to return to the Workshop Homepage](../README.md)


