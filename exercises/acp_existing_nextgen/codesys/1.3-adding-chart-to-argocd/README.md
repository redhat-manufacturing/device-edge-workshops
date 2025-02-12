# Workshop Exercise 1.4 - Creating an Application in ArgoCD

## Table of Contents
* [Step 1 - Understanding the Relationship between Helm Charts and ArgoCD](#step-1---understanding-the-relationship-between-helm-charts-and-argocd)
* [Step 2 - Adding an Application to ArgoCD](#step-2---adding-an-application-to-argocd)
* [Step 3 - Adding New Application Information](#step-3---adding-new-application-information)
* [Step 4 - OPTIONAL - Adding New Application via YAML](#step-4---optional---adding-new-application-via-yaml)
* [Step 5 - Investigate New Application](#step-5---investigate-new-application)

## Objective

* Understand the relationship between Helm and ArgoCD
* Have ArgoCD deploy our Helm chart

## Step 1 - Understanding the Relationship between Helm Charts and ArgoCD
In the previous exercises, we create helm charts that can be used to create resources on kubernetes clusters. 

To level up the experince, we're going to use ArgoCD to deliver that code to our cluster, and have it reconcile resources for us.

Essentially, helm charts define **what** we want to deploy, and ArgoCD is **how** we deploy it. The two working together create a powerful flow for managing resources on clusters.

## Step 2 - Adding an Application to ArgoCD
Refer back to your student page to retrieve the link to access your team's instance of ArgoCD, which will be used to deploy things into your namespace.

Once logged in, you'll probably be greeted with a window containing your team's applications, might still be empty.
![ArgoCD Empty](../images/argocd-empty.png)

Click on the `+ New App` button to start adding a new application to be deployed.

## Step 3 - Adding New Application Information
In the window pane that appears on the right, we'll need to enter some information about our application, and where to find the code for it.

Start by giving the application a name, such as `codesys`, and setting the project name to `default` - this is just the namespace where the project definition will live, not where our resources will be deployed.
![Create New App Name](../images/create-new-app-name.png)

Scrolling down, add information about the code repository. The URL can be retrieved from the Gitea interface if needed:
![Gitea Repo URL](../images/gitea-repo-url.png)

Enter this information into the appropriate place under the `Source` header:
![Create New App Source](../images/create-new-app-source.png)

Under destination, ensure the cluster URL is set to the local cluster: `https://kubernetes.devault.svc`, and that the Namespace is set to your team's namespace. In this example, team1's namespace is used. Note that it's the team number, not the student number.

In the next section, if it shows anything other than "Helm" as the heading, click on the dropdown arrow next to it and select HELM

ArgoCD should pull in some information about the repo, automatically displaying `helm` and values if we put into our `values.yaml` file.
![Values Populated](../images/argocd-values.png)

Once finished, hit the `Create` button at the top of the window.

## Step 4 - OPTIONAL - Adding New Application via YAML
The above process can also be done as code, if you like, using the following format:
```yaml
{% raw %}
# Note: Team 1 is used as an example here - replace with your team information for the namespace
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
      https://gitea-student-services.apps.acp.rh1.redhat-workshops.com/student3/team1-code.git
    targetRevision: HEAD
  sources: []
  project: default
{% endraw %}
```

## Step 5 - Investigate New Application
After hitting the create button, a new application tile should appear, with details about the new application:
![New App Tile](../images/new-app-tile.png)

Clicking on the application tile will show more information, such as the resources that are to be deployed and managed:
![New App Info](../images/new-app-info.png)

The deployment definition we created in the previous step should now show up in ArgoCD, marked as "missing" until the application sync has completed.

## Step 6 - Syncing Application
With the application sitting in an OutOfSync state, the resources are set to be deployed:
![ArgoCD Before Sync](../images/argocd-before-sync.png)

To begin syncing the application, click on the `Sync` button. A menu will appear on the right with options:
![ArgoCD Sync Window](../images/argocd-sync-window.png)

For our purposes, no additional options are needed. Simply click the `Synchronize` button at the top.

The ArgoCD interface will show the sync process, the resources being created, and the current state of the sync.

After a few moments, the application will show Synced:
![ArgoCD Synced](../images/argocd-synced.png)

And within the OpenShift Console, new virtual deployments will be running:
![OCP New Deployments](../images/ocp-deployments.png)

---
**Navigation**

[Previous Exercise](../1.2-adding-deployment-template/) | [Next Exercise](../2.1-deploying-plc-application/)

[Click here to return to the Workshop Homepage](../README.md)
