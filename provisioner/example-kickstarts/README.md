# Example Kickstart Files

This directory contains kickstart files for devices that will be used as the edge management node for running device edge workshops. They are broken out by device due to differences in disks.

## What You Need To Bring
You need to provide the following for a zero-touch kickstart:
1. A RHSM organization, which can be found [here](https://access.redhat.com/management/activation_keys)
2. A RHSM activation key, when can be found [here](https://access.redhat.com/management/activation_keys)
3. A username for the system
4. A password for that user

Insert these values into the kickstart file on the `rhsm` and `user` lines.

## Leveraging the Kickstart File
There are two main ways to use the kickstart:
- [Create a modified ISO](https://access.redhat.com/solutions/60959)
- [Pull from Network Location](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/performing_an_advanced_rhel_9_installation/starting-kickstart-installations_installing-rhel-as-an-experienced-user#starting-a-kickstart-installation-automatically-using-pxe_starting-kickstart-installations)
