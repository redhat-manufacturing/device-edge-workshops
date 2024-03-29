# Generated by Anaconda 34.25.2.10
# Generated by pykickstart v3.32
#version=RHEL9
# Use graphical install
graphical

# Create an activation key here: https://access.redhat.com/management/activation_keys
rhsm --organization="12345" --activation-key="your-activation-key"
%addon com_redhat_kdump --enable --reserve-mb='auto'

%end

# Keyboard layouts
keyboard --xlayouts='us'
# System language
lang en_US.UTF-8

%packages
@^workstation-product-environment

%end

# Run the Setup Agent on first boot
firstboot --enable

ignoredisk --only-use=sda,sdb
clearpart --all --initlabel
zerombr
part /boot --fstype xfs --size=1024 --ondisk=sda
part /boot/efi --fstype efi --size=1024 --ondisk=sda
part swap --size=8192 --ondisk=sda
part pv.01 --size=1000 --grow --ondisk=sda
part pv.02 --size=1000 --grow --ondisk=sdb
volgroup os pv.01 pv.02
logvol / --fstype="xfs" --size=200000 --name=root --vgname=os

# System timezone
timezone America/Chicago --utc

#Root password
rootpw --lock
user --groups=wheel --name=your-username-here --password=your-password-here --gecos="Your Name"

reboot
