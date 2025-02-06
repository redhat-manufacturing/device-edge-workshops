# Workshop Exercise 5.1 - Adding a PostSync Job

## Table of Contents

* [Objective](#objective)
* [Step 1 - Adding to our ConfigMap](#step-1---adding-to-our-configmap)
* [Step 2 - Adding a PostSync Job](#step-2---adding-a-postsync-job)

## Objective

* Understand how to add a postsync job
* Configure what workflow to run

## Step 1 - Adding to our ConfigMap
Following the idea from above, we're going to create another set of a job and configmap, however, this time we'll only specify what automation we want to run, and set the job to happen after everything else has been synced.

First, our configmap - simply add this to the bottom of the existing `configmap.yaml` file in the `templates/` directory:
```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: network-automation-to-run-configmap
data:
  controller-configuration.yaml: |
    controller_hostname: REPLACE_WITH_CONTROLLER_URL_FROM_STUDENT_PAGE
    controller_username: REPLACE_WITH_CONTROLLER_USERNAME
    controller_password: REPLACE_WITH_CONTROLLER_PASSWORD
    controller_validate_certs: 'false'

    controller_workflow_launch_jobs:
      - name: Run Network Automation
        organization: Team 1
```

> Note:
>
> Team1 is used as an example here, replace with your team number

## Step 2 - Adding a PostSync Job
Then, add the following to the `job.yaml` file created earlier:
```yaml
---
apiVersion: batch/v1
kind: Job
metadata:
  generateName: run-network-automation-
  annotations:
    argocd.argoproj.io/hook: PostSync
spec:
  template:
    spec:
      containers:
        - name: launch-network-automation
          image: quay.io/device-edge-workshops/configure-controller:latest
          volumeMounts:
            - name: automation-to-run-vars
              mountPath: /runner/variables
            - name: tmp
              mountPath: /tmp
      restartPolicy: Never
      volumes:
        - name: automation-to-run-vars
          configMap:
            name: network-automation-to-run-configmap
        - name: tmp
          emptyDir:
            sizeLimit: 100Mi
```

Ensure everything has been saved/committed/pushed before continuing.

---
**Navigation**

[Pervious Exercise](../4.4-validating-controller-config/)  [Next Exercise](../5.2-resyncing-app/)

[Click here to return to the Workshop Homepage](../../README.md)
