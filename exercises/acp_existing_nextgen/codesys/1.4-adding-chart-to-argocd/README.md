# Workshop Exercise 1.4 - Creating an Application in ArgoCD

## Table of Contents

* [Objective](#objective)
* [Step 1 - Understanding the Relationship between Helm Charts and ArgoCD]

## Step 3 - Adding New Application via YAML
Refer back to your student page to retrieve the link to access your team's instance of ArgoCD, which will be used to deploy things into your namespace.

An application is ArgoCD's structure to define where to collect the HELM charts and which git repository to use for deploying and syncing.

Add a new application using the UI, or create the application object using yaml:
```yaml
# Note: Team 1 is used as an example here - replace with your team information for the namespace and repoURL
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: codesys
spec:
  destination:
    name: ''
    namespace: team1
    server: https://kubernetes.default.svc
  source:
    path: codesys
    repoURL: >-
      https://gitea-student-services.apps.acp.rh1.redhat-workshops.com/rh1/team1-code.git
    targetRevision: HEAD
  sources: []
  project: default
```