# Active Directory
These exercises will show how to build an active directory environment using Windows virtual machines on top of the platform. In addition, automation will be used to complete the installation and setup.

Since this workload requires infrastructure AND automation to fully deploy, the gitops functionally will be used to both deploy and maintain the infrastructure, to load the necessary automation into Controller, and then to run it.

## Sections
The exercises are broken up into four main sections:
1. Create Infrastructure via GitOps
2. Create Active Directory Automation
3. Configure Controller via GitOps
4. Investigate Results

## Exercises
* [1.1-initializing-chart](1.1-initializing-chart/)
* [1.2-adding-vm-templates](1.2-adding-vm-templates/)
* [1.3-adding-services-for-connectivity](1.3-adding-services-for-connectivity/)
* [1.4-adding-chart-to-argocd](1.4-adding-chart-to-argocd/)
* [2.1-ad-automation-part-1](2.1-ad-automation-part-1/)
* [2.2-ad-automation-part-2](2.2-ad-automation-part-2/)
* [3.1-controller-as-code](3.1-controller-as-code/)
* [3.2-creating-hosts-and-groups](3.2-creating-hosts-and-groups/)
* [3.3-linking-to-automation](3.3-linking-to-automation/)
* [3.4-appling-config-to-controller](3.4-appling-config-to-controller/)
* [4.1-resync-app](4.1-resync-app/)
* [4.2-end-to-end](4.2-end-to-end/)
