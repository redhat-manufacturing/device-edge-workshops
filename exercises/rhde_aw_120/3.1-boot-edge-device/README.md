# Workshop Exercise 3.1 - Booting an Edge Device

## Table of Contents

* [Objective](#objective)
* [Step 1 - Writing the ISO to a USB Device](#step-1---writing-the-iso-to-a-usb-device)
* [Step 2 - Booting Your Edge Device](#step-2---booting-your-edge-device)
* [Step 3 - Creating Our Customized ISO](#step-3---creating-our-customized-iso)
* [Solutions](#solutions)

## Objective

In this exercise, we're going to use our customized ISO to provision our edge devices.

If you have a monitor/keyboard available at your station, feel free to use them. If not, contact with the instructor for more information.

> Note:
>
> This exercise is for students with physical devices. If you do not have one and are instead virtualizing an edge device, proceed to the [next exercise](../3.2-boot-edge-vm).

### Step 1 - Writing the ISO to a USB Device

There are multiple ways and utilities that can be used to copy an ISO onto a flash drive. On linux, the easiest way is to use the `dd` command to copy the ISO onto your USB device. However, other applications including Fedora Media Writer can also be used. For Windows, [Rufus](https://rufus.ie) is one such utility.

On your linux system, use the `dd` command to copy the ISO to the USB device:
```
dd if=~/generate-iso/rhde-ztp.iso of=/dev/sdz
```

> Note:
> 
> This operation does require root, and ensure that you're referencing at the correct device in the `of` parameter. More information can be found in the [RHEL Documentation](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/performing_a_standard_rhel_8_installation/assembly_creating-a-bootable-installation-medium_installing-rhel).

### Step 2 - Booting Your Edge Device

The basic idea is to boot from the newly created flash drive on your edge device. The basic steps are: Insert USB Device > Boot Device > Enter Boot Menu > Select USB Device To Boot From.

For OnLogic devices, the boot menu option key is `F10`.
For Intel Devices, the boot menu option key is `DEL`.

### Step 3 - Creating Our Customized ISO

First, ensure the following files are present in the `~/generate-iso/` directory which were created in earlier exercies:

```
.
├── grub.cfg
├── isolinux.cfg
├── ks.cfg
└── rhel-8.7-x86_64-boot.iso
```

Next, create a file called `recook.sh` with the following contents:
```
#!/bin/bash

# Ensure this script is run as root
if [ "$EUID" != "0" ]; then
    echo "Please run as root" >&2
    exit 1
fi

# Set a few bash options
cd "$(dirname "$(realpath "$0")")"
set -ex

# Create a temp dir
tmp=$(mktemp -d)
mkdir "$tmp/iso"

# Mount the boot iso into our temp dir
mount rhel-8.7-x86_64-boot.iso "$tmp/iso"

# Create a directory for our new ISO
mkdir "$tmp/new"

# Copy the contents of the boot ISO to our new directory
cp -a "$tmp/iso/" "$tmp/new/"

# Unmount the boot ISO
umount "$tmp/iso"

# Copy our customized files into the new ISO directory
cp ks.cfg "$tmp/new/iso/"
cp isolinux.cfg "$tmp/new/iso/isolinux/"
cp grub.cfg "$tmp/new/iso/EFI/BOOT/"

# Push directory of new ISO for later commands
pushd "$tmp/new/iso"

# Create our new ISO
mkisofs -o ../rhde-ztp.iso -b isolinux/isolinux.bin -J -R -l \
    -c isolinux/boot.cat -no-emul-boot -boot-load-size 4 -boot-info-table -eltorito-alt-boot \
    -e images/efiboot.img -no-emul-boot -graft-points -joliet-long -V "RHEL-8-7-0-BaseOS-x86_64" . 
isohybrid --uefi ../rhde-ztp.iso
implantisomd5 ../rhde-ztp.iso

# Return to previous directory
popd

# Cleanup and give user ownership of ISO
mv "$tmp/new/rhde-ztp.iso" ./
rm -rf "$tmp"
chown $(stat -c '%U:%G' .) ./rhde-ztp.iso
```

Once the file has been created, make the script executable and then run it the script via sudo: `chmod ug+x recook.sh && sudo ./recook.sh`

After the script completes, you should have a new ISO called `rhde-ztp.iso` within this directory.

> Note:
>
> If the `mkisofs`, `isohybrid`, and `implantisomd5` commands aren't available, you may need to install the `genisoimage`, `syslinux`, and `isomd5sum` packages.

### Solutions


---
**Navigation**

[Previous Exercise](../2.6-provisioning-workflow) | [Next Exercise](../3.2-boot-edge-vm)

[Click here to return to the Workshop Homepage](../README.md)