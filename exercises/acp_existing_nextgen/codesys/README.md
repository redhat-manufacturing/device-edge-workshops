# Codesys vPLC
With the evolution of IT infrastructure and the need to become more hardware agnostic, the need for virtual PLC's is becoming more and more obvious to many industrial companies.

PLC software vendors, like Codesys have developed a virtualized version of their PLC and the supporting gateways, and to add to the usability, they have taken it one step further and ported the software to containers.


For this exercise we are using a pre-built container image, provided by Codesys, and deploying customized configuration and an application to generate OPC-UA data.

ArgoCD will ensure that we have everything as code.


## Sections
The exercises are broken up into four main sections
1. Create Runtime
2. Deploy PLC Application
3. Extract OPC-UA Data

Exercises
* [1.1 - Initializing Helm Chart](1.1-initializing-chart/)
