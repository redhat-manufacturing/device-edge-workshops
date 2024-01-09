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

4. As soon as you commit the file you can see how a "Configure Edge Device" Workflow Job has been lauched in AAP

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


3. Few seconds after that change you will see that a new "Configure Edge Device"  Workflow Job is being launched automatically in AAP. That Job will put the right configuration in our device again.


4. After the Job completion, use your SSH Terminal in the edge device to check the `sudoers` file with the `cat /etc/sudoers` and see how the "right" configuration is back in place.

  >**Note**
  >
  > Bear in mind that your TTY SSH Terminal session caches the sudo password, so if you perform again the test with `sudo cat /etc/hosts` command,even thought the `sudoers` file is configured to ask for a password, since the password is cached in your Terminal, it won't ask for it. You could logout and login again or open a new SSH Terminal to perform that test.  

5. (optional) If you want to show the magic behind you can show Python script (`cat /usr/local/bin/watch_etc.py`) that is monitoring changes in `/etc/` and calling Event Driven Automation in case that it detects a change:

```bash
#!/usr/bin/env python3

import inotify.adapters
import requests
import os
import subprocess
import time

time.sleep(15)

# Define the directory to monitor
DIRECTORY = '/etc'

# Define your webhook URL
WEBHOOK_URL = "https://eda.<your eda domain name>/endpoint"

# Function to send a webhook with JSON data
def send_webhook(path, filename, event_type, student, inventory):
    json_data = {
        "student": student,
        "inventory": inventory,
        "path": path,
        "file_changed": filename,
        "event_type": event_type
    }

    headers = {'Content-Type': 'application/json'}
    response = requests.post(WEBHOOK_URL, json=json_data, headers=headers)
    if response.status_code == 200:
        print(f'Webhook sent: {filename}')

# Check if the "/root/inotify-wait" file exists
def inotify_wait_exists():
    return os.path.exists('/root/inotify-wait')

try:
    conn_name = subprocess.check_output("nmcli con show | grep -v UUID | head -n 1 | awk '{{print \$1}}'", shell=True)
    conn_name = conn_name.decode("utf-8").strip()
except subprocess.CalledProcessError as e:
    print(f"Error running the first shell command: {e}")
    conn_name = None

# Check if the connection name was retrieved successfully
if conn_name:
    # Run the second shell command to get the MAC address
    try:
        MAC_ADDRESS = subprocess.check_output(f"ip addr | grep {conn_name} -A 1 | grep link | awk '{{print \$2}}' | sed 's/://g'", shell=True)
        MAC_ADDRESS = MAC_ADDRESS.decode("utf-8").strip()
    except subprocess.CalledProcessError as e:
        print(f"Error running the second shell command: {e}")
        MAC_ADDRESS = None

# Check if both variables are available
if conn_name and MAC_ADDRESS:
    inventory = f'edge-{MAC_ADDRESS}'

# Initialize the inotify watcher
i = inotify.adapters.InotifyTree(DIRECTORY)
for event in i.event_gen(yield_nones=False):
      (_, type_names, path, filename) = event
      # Check the file extension and skip unwanted extensions
      _, file_extension = os.path.splitext(filename)

      if file_extension not in ('.swp', '.ddf', '.db'):
        #print("variable: {}".format(type_names))
        if any(event_type in ['IN_CREATE', 'IN_MODIFY', 'IN_DELETE', 'IN_MOVE'] for event_type in type_names):
            print("PATH=[{}] FILENAME=[{}] EVENT_TYPES={}".format(path, filename, type_names))
            # Check if the "/root/inotify-wait" file exists
            if not inotify_wait_exists():
                # Send a webhook notification with JSON data
                send_webhook(path, filename, type_names, <your student number>, inventory )
                # Create the "/root/inotify-wait" file
                open('/root/inotify-wait', 'w').close()

i.remove_watch(DIRECTORY)
```





