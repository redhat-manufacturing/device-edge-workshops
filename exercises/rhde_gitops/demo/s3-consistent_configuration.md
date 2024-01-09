# Section 3 - Consistent edge device configuration at scale

## Configuration consistency across all devices

For demo propuses, the edge system has been configured (this is not the default in RHEL) with a non-secure sudoers configuration file that permits the non-root user run root commands wihtout introducing the password `%wheel        ALL=(ALL)       NOPASSWD: ALL`. 

The idea is to show how we can modify that configuration to force sudo to ask for a password by GitOps with AAP. 


1. SSH to the edge device as non-root user and show how is possible to run commands as root without a password by running the `sudo cat /etc/hosts`.

2. Open "Jobs" page in AAP and keep it visible while performing the next step.

3. Since we are trying to stick to the GitOps model, We have our configurations in the Gitea source code repository. In our case, as an example, we have two different configuration files: `rpm-ostreed.conf` that configures how ostree updates and the `sudoers` file. We need to modify the `sudoers` file to ask for a password, so open the file `device-edge-configs/OS/sudoers` in Gitea and perform the following changes:

* Comment out the `%wheel        ALL=(ALL)       NOPASSWD: ALL` line. You will have this in your file after the change:
```bash
## Same thing without a password
#%wheel        ALL=(ALL)       NOPASSWD: ALL
```

* Uncomment the line `#%wheel  ALL=(ALL)       ALL` to ask for a password. This is the result that you should have in your file:

```bash
## Allows people in group wheel to run all commands
%wheel  ALL=(ALL)       ALL
```

Then, after those changes, commit the file.

4. As soon as you commit the file you can see how a "" Job has been lauched in AAP

5. Go back to your SSH terminal as non-root user in the edge device and check the `/etc/sudoers` file with the command `cat /etc/sudoers`. You will see there the changes that you performed in Gitea.

6. Finally, try to run the same command than in the first step (`sudo cat /etc/hosts`). This time `sudo` will ask for a password.



## Preventing manual configuration overwrite

It's great to be able to configure at scale our devices, but what happens if someone with privilages just change manually one of the config that we performed from AAP?. That would break the desired consistency across all devices.

AAP does not bring out of the box any "agent" that could be installed in the edge devices in order to monitor changes like the one mentioned above, but it gives us the flexibilty to create and use our own script.

During the next steps we will see an example where we created a python script that monitors changes in `/etc/` and if it detects any, it will inform AAP, who will enforce again the desired configuration file, overwritting the manually configured changes.

1. Open an SSH Terminal in the edge device as root user and keep the "Jobs" page in AAP visible while performing the next step.

2. Edit the `sudoers` file with `vi /etc/sudoers` command and revert the change made while demonstrating "Configuration consistency across all devices" in the step 3. The file will have this content in the file:

```bash
...
## Allows people in group wheel to run all commands
#%wheel  ALL=(ALL)       ALL

## Same thing without a password
%wheel        ALL=(ALL)       NOPASSWD: ALL
...
```


3. Few seconds after that change you will see that a new "" Job is being launched automatically in AAP. That Job will put the right configuration in our device again.


4. After the Job completion, use your SSH Terminal in the edge device to check the `sudoers` file with the `cat /etc/sudoers` and see how the "right" configuration is back in place.

  >**Note**
  >
  > 

5. (optional) If you want to show the magic behind you can show the systemd unit and the Python scripts that is monitoring changes in `/etc/` and calling Event Driven Automation in case that it detects a change:


```bash

```


```bash

```





