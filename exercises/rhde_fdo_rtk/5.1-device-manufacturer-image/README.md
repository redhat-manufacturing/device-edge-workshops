# Workshop Exercise 5.1 - Imaging a Device as a Device Manufacturer

## Table of Contents

* [Objective](#objective)
* [Step 1 - Hooking Up Device at an Imaging Station](#step-1---hooking-up-device-at-an-imaging-station)
* [Step 2 - Ensuring Secure Boot is Enabled](#step-2---ensuring-secure-boot-is-enabled)
* [Step 3 - Booting from a Flashdrive](#step-3---booting-from-a-flashdrive)

## Objective

In this exercise, we'll apply the initial image to our edge devices as if we are device manufacturers.

### Step 1 - Hooking Up Device at an Imaging Station

If you have been issued an edge device, bring the device up to the "device manufacturing" imaging station located in the workshop room. Your instructor should have pointed this out to you at the beginning of the workshop, however if you have any questions do not hesitate to ask.

At the imaging station, connect the following to your edge device:
- AC power
- Monitor
- USB keyboard
- Ethernet
- Bootable USB Flashdrive

### Step 2 - Ensuring Secure Boot is Enabled

Since we're focused on securly onboarding devices, we'll want to ensure secure boot is enabled on our device. The setting for this is found in the BIOS of your edge device, typically under a menu called "Administer Secure Boot".

Your instructor will have more info, and can assist during the imaging process.

### Step 3 - Booting from a Flashdrive

Once all appropriate connections to the device are made, power up the device. When the splash screen appears, hit the key to enter the boot menu.

> **Note**
>
> For OnLogic devices, the boot menu key is `F10`. For Intel devices (NUCs), the boot menu key is `DEL`.

If you miss the window to enter the boot menu, simply power down the device and restart the process.

Once in the boot menu, select the appropriate boot device (the flash drive) to begin the imaging process.

Once the installation is complete, the device will shut down, signifying that it is safe to disconnect from the manufacturing imaging station.

---
**Navigation**

[Previous Exercise](../4.2-start-compose-cli) | [Next Exercise](../6.1-finish-install)

[Click here to return to the Workshop Homepage](../README.md)
