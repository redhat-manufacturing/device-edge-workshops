# Workshop Exercise 4.1 - Initializing Helm Chart

## Table of Contents

* [Objective](#objective)
* [Step 1 - Starting the Declarative and Procedural Integration](#step-1---starting-the-declarative-and-procedural-integration)
* [Step 2 - Helm Chart Structure](#step-2---helm-chart-structure)
* [Step 3 - Creating Our Chart Structure](#step-3---creating-our-chart-structure)

## Objective

* Understand how to initialize a helm chart
* Push that initial chart to git

## Step 1 - Starting the Declarative and Procedural Integration
Now that our network automation has been created, we're going to integrate it with declarative tooling to enable a full end-to-end experience. Instead of manually configuring Ansible Controller, we're going to have other tools handle it for us.

## Step 2 - Helm Chart Structure
Helm charts are simply a collection of files that represent definitions which create or modify resources on a kubernetes cluster. They can contain definitions for mostly anything, and usually, contain variables that are templated out when deploying the chart.

The basic structure of a chart is:
```
name-of-chart/
  Chart.yaml
  values.yaml
  templates/
```

To quote the helm website:
```
The templates/ directory is for template files. When Helm evaluates a chart, it will send all of the files in the templates/ directory through the template rendering engine. It then collects the results of those templates and sends them on to Kubernetes.

The values.yaml file is also important to templates. This file contains the default values for a chart. These values may be overridden by users during helm install or helm upgrade.

The Chart.yaml file contains a description of the chart. You can access it from within a template.
```

> Source: https://helm.sh/docs/chart_template_guide/getting_started/

## Step 3 - Creating Our Chart Structure
To get started, we'll create a directory and fill out Chart.yaml.

If you are comfortable with git and have a text editor available to you, feel free to clone your repo and use whatever tools you prefer.

Gitea has a web interface that can also be used for editing files, which will be shown here.

First, let's create a directory to house our chart named `network-automation`, and fill out Chart.yaml. In the Gitea web interface, select "New File". To add a directory, simply type the desired name of the directory, then put in a forward slash: `/`.
![Start Chart Yaml](../.images/gitea-add-chart-directory.png)

Then, within that new directory, name the file `Chart.yaml` and enter the following information.

```yaml
apiVersion: v2
name: network-automation
description: A chart to setup for and run network automation
type: application
version: 1.0.0
appVersion: "1.0.0"
```
![Populate Chart Yaml](../.images/gitea-populate-chart-yaml.png)

Ensure you save the file, or push it to the repo if working within another editor.

---
**Navigation**

[Previous Exercise](../3.3-linking-to-automation/) | [Next Exercise](../4.2-appling-config-to-controller/)

[Click here to return to the Workshop Homepage](../../README.md)
