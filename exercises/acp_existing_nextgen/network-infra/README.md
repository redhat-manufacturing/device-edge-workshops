# Network Infrastructure Automation
These exercises will show how to build automation to manage a network device that exists "outside" of the platform, then use GitOps to drive the configuration of Controller and trigger the created automation.

These exercises expect some base knowledge on networking and using Ansible to talk to network devices, and will introduce some concepts around using GitOps and k8s-native functionality to drive the configuration of Controller.

The network infrastructure has been pre-provisioned for you, resembling a real-world environment where bespoke network equipment is already present.

## Sections
The exercises are broken up into four main sections:
1. Create Infrastructure via GitOps
2. Create Active Directory Automation
3. Configure Controller via GitOps
4. Investigate Results

Exercises
* [1.1 - Initializing Helm Chart](1.1-initializing-chart/)
