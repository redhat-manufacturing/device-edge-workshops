# Workshop Exercise 6.1 - Finishing the Process at the Device Destination

## Table of Contents

* [Objective](#objective)
* [Step 1 - Hooking Up Device at the Final Destination](#step-1---hooking-up-device-at-the-final-destination)
* [Step 2 - Booting Up the Device](#step-2---booting-up-the-device)
* [Step 3 - Confirm Onboarding](#step-3---confirm-onboarding)
* [Step 4 - Connect to the Lab WiFi](#step-4---connect-to-the-lab-wifi)

## Objective

In this exercise, we'll boot up our imaged device at its final destination and check that the device was onboarded properly.

### Step 1 - Hooking Up Device at the Final Destination

If you have been issued an edge device, bring the device up to the "final destination" imaging station located in the workshop room. Your instructor should have pointed this out to you at the beginning of the workshop, however if you have any questions do not hesitate to ask.

At the imaging station, connect the following to your edge device:
- AC power
- Monitor
- USB keyboard
- Ethernet

### Step 2 - Booting Up the Device

Once all appropriate connections to the device are made, power up the device. Allow the device to boot normally, waiting for the device to reach a login prompt.

In the background, the device has called out to our "all-in-one" FDO server and onboarded itself, performing the configruation we specified earlier, as well as intriniscially being onboarded securely.

### Step 3 - Confirm FDO Onboarding

Log in to the box on the console using the credentails provided on your student page. Once logged in, run the following command to confirm onboarding:
```
sudo systemctl status fdo-client
```

Ideally, the output from systemd should show the client as `loaded` and `inactive (dead)`, which are both good: this means the service ran successfully and has finished the work.

### Step 4 - Finish Onboarding

Since these edge devices have wifi capabilities and we have limited imaging stations, we'll connect our onboarded device to the lab wifi so it can be disconnected from the imaging station, allowing the next student to proceed.

As shown in the FDO configuration, our devices have a user named `fdo-init` and an SSH keypair for authentication. Use these credentials to connect to the device. As a reminder, the SSH keypair can be found on your student page.

For example:
```
ssh -i /path/to/private.key fdo-init@192.168.1.172
```

Ensure you replace the path and address above. To determine what address your device recieved, ask your instructor.

From here, a shell script has been prepared for you. Download it to the system and run it:
```
curl https://onboarding.summit.redhat-workshops.com/onboard-student1.sh --output onboard-student1.sh
bash -x ./onboard-student1.sh
```

Be sure to replace the student number with your student number, and the URL based on your workshop information.

---
**Navigation**

[Previous Exercise](../5.1-device-manufacturer-image) | [Next Exercise](../6.2-inventory-and-host)

[Click here to return to the Workshop Homepage](../README.md)
