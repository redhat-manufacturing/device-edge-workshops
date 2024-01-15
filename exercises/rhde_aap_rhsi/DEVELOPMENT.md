# Development Doc for 'Red Hat Device Edge - Management with AAP in Advanced Networks'

This is where development of the workshop is tracked.

**Abstract:**
This lab walks participants through the act of managing Red Hat Device Edge for day 1+ activities, including application management, configuration management, etc. in challenging network conditions. The goal is to simulate a customer use case that might be transient on networks (e.g. vehicle-mounted applications), might simply not be otherwise integrated with a site’s network management (e.g. a vendor-provided appliance that connects to multiple customers’ Wi-Fi networks that the appliance has no control over), or is explicitly designed to live on a mobile network without a guaranteed fixed IP and tight control over the network (e.g. cheap LTE connections along an oil pipeline). Roll your sleeves up and learn how to seamlessly connect to these devices from Ansible Automation Platform despite the challenging network conditions through a service such as Red Hat Service Interconnect to manage the Operating System, platform, and application at scale - at the edge.

## Section 0 - Preflight
- [x] Validate selection
- [x] Validate variables
- [x] Ensure connectivity
- [x] Ensure subsciption/repos
- [x] Common packages
- [x] Wildcard cert
 
## Section 1 - AWS Setup
- [x] Generate ssh keypair
- [x] Create storage bucket for keypair
- [x] Create vpc for hypervisor
- [x] Create internet gateway
- [x] Create routes
- [x] Provision hypervisor node
- [x] Add host to running inventory
- [x] Create DNS entry

## Section 2 - OpenShift Setup
- [x] Configure OCP tooling
- [x] Install OCP
- [x] Use valid cert
      - Update to use yaml not `oc` commands
- [x] htpasswd for student auth
- [x] Workshop namespace

## Section 3 - Core Services Setup
| Service | Platform | Installation | Configuration |
| ------- | -------- | ------------ | ------------- |
| Ansible Controller | OCP | <ul><li>[x]</li></ul> | <ul><li>[x]</li></ul> |
| Service Interconnect | OCP | <ul><li>[x]</li></ul> | <ul><li>[x]</li></ul> |
| Attendance Pages | OCP | <ul><li>[x]</li></ul> | <ul><li>[x]</li></ul> |
| Gitea | OCP | <ul><li>[x]</li></ul> | <ul><li>[x]</li></ul> |
| Sample Application | OCP | <ul><li>[x]</li></ul> | <ul><li>[x]</li></ul> |

## Section 2 - Local Edge Manager Setup
- [x] Standard services

## Section 3 - Local Devices Setup
- [x] Pre-provision devices

## Section 4 - Hypervisor setup
- [x] Cockpit
- [x] Virtual machines
- [x] Student logins

## Section 5 - Exercises
- [x] Device provisioning?
- [x] Deploy skupper
- [x] Register with AAP
- [x] Deploy application

## Section 6 - Provision Resources
- [x] Example vars file
- [ ] Example inventory file
- [ ] Provisioner documentation addendum

# Known Issues
- N/A

# To-Dos
- N/A
