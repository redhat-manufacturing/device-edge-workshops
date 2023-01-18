# Workshop Exercise 2.4 - Create a Customized ISO

## Table of Contents

* [Objective](#objective)
* [Step 1 - Grabbing the RHEL Boot ISO](#step-1---grabbing-the-rhel-boot-iso)
* [Step 2 - Creating Customized Boot Options](#step-2---creating-a-job-template-for-our-playbook)
* [Step 3 - Creating Our Customized ISO](#step-3---creating-our-customized-iso)
* [Solutions](#solutions)

## Objective

In this exercise, we're going to create a customized ISO that contains our kickstart. This will allow for zero touch provisioning of devices because all information should be provided.

Ideally, once this ISO is built, the following should happen:
- Device boots from flash drive
- Install happens without input
- Device reboots
- Devive waits for networking
- Device runs Ansible playbook to call home
- Ansible Controller finishes provisioning the device

The steps in this exercise are from [this KB article](https://access.redhat.com/solutions/60959), which we'll walk through for reference, however in the interest of time we'll be using a script to generate the ISO.

> Note:
>
> A special thanks to Mr. James Harmison for the ISO generation script. Be sure to give him a hearty thank you the next time you see him.

It's recommended to execute these steps either on your laptop if you have a physical device, or on the edge hypervisor if available, as those are the places where we'll need the customized ISO.

### Step 1 - Grabbing the RHEL Boot ISO

If an edge hypervisor has been provisioned for you, then the RHEL Boot ISO is available on the system under `/opt/student-resources`. Copy it from that directory to somewhere in your home directory, such as `~/generate-iso/`.

Visit the [customer portal](https://access.redhat.com/downloads/content/479/ver=/rhel---8/8.7/x86_64/product-software) and download the RHEL8.7 boot ISO. We won't need the full installation image, the boot ISO has everything necessary for provisioning our edge devices.

### Step 2 - Creating Customized Boot Options

We'll be creating a few files that control the menu items and parameters when booting up a system from this ISO. The full files are available under [Solutions](#solutions), however we'll take a deeper look at a few sections here.

`isolinux.cfg` controls the boot options for devices booted in BIOS mode. Under the menu options, we'll be removing the defaults and adding the following:
```
label install
  menu label ^Zero Touch Provision Red Hat Device Edge
  kernel vmlinuz
  append initrd=initrd.img inst.stage2=hd:LABEL=RHEL-8-7-0-BaseOS-x86_64 inst.ks=hd:LABEL=RHEL-8-7-0-BaseOS-x86_64:/ks.cfg quiet

label check
  menu label Test this ^media & Zero Touch Provision Red Hat Device Edge
  menu default
  kernel vmlinuz
  append initrd=initrd.img inst.stage2=hd:LABEL=RHEL-8-7-0-BaseOS-x86_64 rd.live.check inst.ks=hd:LABEL=RHEL-8-7-0-BaseOS-x86_64:/ks.cfg quiet
```

We've modified the labels on the menu items and added the kickstart option to automatically run our generated kickstart.

Similarly, `grub.cfg` controls the boot options when booted in EFI mode. We'll be making similar modifications:
```
menuentry 'Zero Touch Provision Red Hat Device Edge' --class fedora --class gnu-linux --class gnu --class os {
	linuxefi /images/pxeboot/vmlinuz inst.stage2=hd:LABEL=RHEL-8-7-0-BaseOS-x86_64 inst.ks=hd:LABEL=RHEL-8-7-0-BaseOS-x86_64:/ks.cfg quiet
	initrdefi /images/pxeboot/initrd.img
}
menuentry 'Test this media & Zero Touch Provision Red Hat Device Edge' --class fedora --class gnu-linux --class gnu --class os {
	linuxefi /images/pxeboot/vmlinuz inst.stage2=hd:LABEL=RHEL-8-7-0-BaseOS-x86_64 rd.live.check inst.ks=hd:LABEL=RHEL-8-7-0-BaseOS-x86_64:/ks.cfg quiet
	initrdefi /images/pxeboot/initrd.img
}
```

Finally, we'll need our kickstart file, which can be grabbed from the web server hosting it via wget, curl, or copy-pasting from your favorite browser. Ensure it is named `ks.cfg`.

Place all these modified files into the same directory as your boot ISO.

### Step 3 - Creating Our Customized ISO

First, ensure the following files are present in your directory:
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

Once pasted in, make the script executable and then run it via sudo: `chmod ug+x recook.sh && sudo ./recook.sh`

After the script finishes, you should have a new iso called `rhde-ztp.iso` in your directory.

> Note:
>
> If the `mkisofs`, `isohybrid`, and `implantisomd5` commands aren't available, you may need to install the `genisoimage`, `syslinux`, and `isomd5sum` packages.

### Solutions

`isolinux.cfg`:
```
default vesamenu.c32
timeout 600

display boot.msg

# Clear the screen when exiting the menu, instead of leaving the menu displayed.
# For vesamenu, this means the graphical background is still displayed without
# the menu itself for as long as the screen remains in graphics mode.
menu clear
menu background splash.png
menu title Red Hat Enterprise Linux 8.7
menu vshift 8
menu rows 18
menu margin 8
#menu hidden
menu helpmsgrow 15
menu tabmsgrow 13

# Border Area
menu color border * #00000000 #00000000 none

# Selected item
menu color sel 0 #ffffffff #00000000 none

# Title bar
menu color title 0 #ff7ba3d0 #00000000 none

# Press [Tab] message
menu color tabmsg 0 #ff3a6496 #00000000 none

# Unselected menu item
menu color unsel 0 #84b8ffff #00000000 none

# Selected hotkey
menu color hotsel 0 #84b8ffff #00000000 none

# Unselected hotkey
menu color hotkey 0 #ffffffff #00000000 none

# Help text
menu color help 0 #ffffffff #00000000 none

# A scrollbar of some type? Not sure.
menu color scrollbar 0 #ffffffff #ff355594 none

# Timeout msg
menu color timeout 0 #ffffffff #00000000 none
menu color timeout_msg 0 #ffffffff #00000000 none

# Command prompt text
menu color cmdmark 0 #84b8ffff #00000000 none
menu color cmdline 0 #ffffffff #00000000 none

# Do not display the actual menu unless the user presses a key. All that is displayed is a timeout message.

menu tabmsg Press Tab for full configuration options on menu items.

menu separator # insert an empty line
menu separator # insert an empty line

label install
  menu label ^Zero Touch Provision Red Hat Device Edge
  kernel vmlinuz
  append initrd=initrd.img inst.stage2=hd:LABEL=RHEL-8-7-0-BaseOS-x86_64 inst.ks=hd:LABEL=RHEL-8-7-0-BaseOS-x86_64:/ks.cfg quiet

label check
  menu label Test this ^media & Zero Touch Provision Red Hat Device Edge
  menu default
  kernel vmlinuz
  append initrd=initrd.img inst.stage2=hd:LABEL=RHEL-8-7-0-BaseOS-x86_64 rd.live.check inst.ks=hd:LABEL=RHEL-8-7-0-BaseOS-x86_64:/ks.cfg quiet

menu separator # insert an empty line

# utilities submenu
menu begin ^Troubleshooting
  menu title Troubleshooting

label vesa
  menu indent count 5
  menu label Install Red Hat Enterprise Linux 8.7 in ^basic graphics mode
  text help
	Try this option out if you're having trouble installing
	Red Hat Enterprise Linux 8.7.
  endtext
  kernel vmlinuz
  append initrd=initrd.img inst.stage2=hd:LABEL=RHEL-8-7-0-BaseOS-x86_64 nomodeset quiet

label rescue
  menu indent count 5
  menu label ^Rescue a Red Hat Enterprise Linux system
  text help
	If the system will not boot, this lets you access files
	and edit config files to try to get it booting again.
  endtext
  kernel vmlinuz
  append initrd=initrd.img inst.stage2=hd:LABEL=RHEL-8-7-0-BaseOS-x86_64 inst.rescue quiet

label memtest
  menu label Run a ^memory test
  text help
	If your system is having issues, a problem with your
	system's memory may be the cause. Use this utility to
	see if the memory is working correctly.
  endtext
  kernel memtest

menu separator # insert an empty line

label local
  menu label Boot from ^local drive
  localboot 0xffff

menu separator # insert an empty line
menu separator # insert an empty line

label returntomain
  menu label Return to ^main menu
  menu exit

menu end
```

`grub.cfg`:
```
set default="1"

function load_video {
  insmod efi_gop
  insmod efi_uga
  insmod video_bochs
  insmod video_cirrus
  insmod all_video
}

load_video
set gfxpayload=keep
insmod gzio
insmod part_gpt
insmod ext2

set timeout=10
### END /etc/grub.d/00_header ###

search --no-floppy --set=root -l 'RHEL-8-7-0-BaseOS-x86_64'

### BEGIN /etc/grub.d/10_linux ###
menuentry 'Zero Touch Provision Red Hat Device Edge' --class fedora --class gnu-linux --class gnu --class os {
	linuxefi /images/pxeboot/vmlinuz inst.stage2=hd:LABEL=RHEL-8-7-0-BaseOS-x86_64 inst.ks=hd:LABEL=RHEL-8-7-0-BaseOS-x86_64:/ks.cfg quiet
	initrdefi /images/pxeboot/initrd.img
}
menuentry 'Test this media & Zero Touch Provision Red Hat Device Edge' --class fedora --class gnu-linux --class gnu --class os {
	linuxefi /images/pxeboot/vmlinuz inst.stage2=hd:LABEL=RHEL-8-7-0-BaseOS-x86_64 rd.live.check inst.ks=hd:LABEL=RHEL-8-7-0-BaseOS-x86_64:/ks.cfg quiet
	initrdefi /images/pxeboot/initrd.img
}
submenu 'Troubleshooting -->' {
	menuentry 'Install Red Hat Enterprise Linux 8.7 in basic graphics mode' --class fedora --class gnu-linux --class gnu --class os {
		linuxefi /images/pxeboot/vmlinuz inst.stage2=hd:LABEL=RHEL-8-7-0-BaseOS-x86_64 nomodeset quiet
		initrdefi /images/pxeboot/initrd.img
	}
	menuentry 'Rescue a Red Hat Enterprise Linux system' --class fedora --class gnu-linux --class gnu --class os {
		linuxefi /images/pxeboot/vmlinuz inst.stage2=hd:LABEL=RHEL-8-7-0-BaseOS-x86_64 inst.rescue quiet
		initrdefi /images/pxeboot/initrd.img
	}
}
```

---
**Navigation**

[Previous Exercise](../2.3-kickstart-playbook) | [Next Exercise](../2.3-kickstart-playbook)

[Click here to return to the Workshop Homepage](../README.md)