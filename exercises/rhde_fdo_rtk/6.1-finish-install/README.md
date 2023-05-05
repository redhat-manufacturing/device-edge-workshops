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

### Step 3 - Confirm Onboarding

Log in to the box on the console using the credentails provided on your student page. Once logged in, run the following command to confirm onboarding:
```
sudo systemctl status fdo-client
```

Ideally, the output from systemd should show the client as `loaded` and `inactive (dead)`, which are both good: this means the service ran successfully and has finished the work.

### Step 4 - Connect to the Lab WiFi

Since these edge devices have wifi capabilities and we have limited imaging stations, we'll connect our onboarded device to the lab wifi so it can be disconnected from the imaging station, allowing the next student to proceed.

Still logged in to the console, run the following commands:

```
sudo nmcli radio wifi on
sudo nmcli dev wifi rescan
sudo nmcli dev wifi list
sudo nmcli dev wifi connect $(lab-wifi-ssid) password '$(lab-wifi-network-password)'
```

Refer to your student page for the wireless network SSID and password.


Once connected, denote the IP address issed to the system **for the wireless connection** by running `ip addr` and looking under the interface named `wlp*`.

We'll need this IP address in our next exercise, so keep it in a safe place.

---
**Navigation**

[Previous Exercise](../3.4-aap-inage-build) | [Next Exercise](../4.2-initial-call-home)

[Click here to return to the Workshop Homepage](../README.md)
