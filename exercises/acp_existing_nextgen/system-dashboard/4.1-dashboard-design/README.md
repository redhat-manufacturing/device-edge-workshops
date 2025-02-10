# Workshop Exercise 4.1 - Dashboard Design

## Table of Contents

* [Objective](#objective)
* [Step 1 - Creating a New Dashboard](#step-1---creating-a-new-dashboard)
* [Step 2 - Up-Down Panels](#step-2---up-down-panels)
* [Step 3 - Time Series Data](#step-3---time-series-data)
* [Step 4 - Collaborate With Your Team](#step-4---collaborate-with-your-team)

## Objective

* Begin building the system dashboard
* Encourage collaboration with team

## Step 1 - Creating a New Dashboard
With our stack ready to go, we can now start building a dashboard to display metrics about our system.

In the Grafana webUI, click on **Dashboards** and then the `+ Create Dashboard` button in the middle of the screen.
![New Dashboard](../images/grafana-new-dashboard.png)

This will create a new dashboard.

## Step 2 - Up-Down Panels
On the new dashbaord, select the `+ Add Visualization` button to begin building a panel for the dashboard.

![Grafana Add Visualization](../images/grafana-add-visualization.png)

In the pop-up window, select `Prometheus` as the primary data source for the dashboard.
![Select Datasource](../images/grafana-select-datasource.png)

A common panel for dashboard is a simple Up/Down panel, which is built off the `probe_success` metric.

In the top right corner, change the panel type to `Stat`, then fill in the first query with:

`probe_success{instance="https://console.openshift-console.svc.cluster.local:443"}`

Remember - Prometheus metrics are key:value pairs with tags, so to find the metrics for a specific instance, such as the OpenShift web console, add a filter with the key:value pair of `instance:https://console-openshift-console.svc.cluster.local:443`

Hit rhe `Run Queries` button to see the latest value for your query:
![Grafana Single Stat Raw](../images/grafana-raw-single-stat.png)

Now, we can map our values to 'Up' and 'Down' using a value mapping. In the right-hand menu, scroll down to the `Value mappings` section and edit the value mappings:
![Grafana Single Stat Value Mappings](../images/grafana-single-stat-value-mapping.png)

Feel free to play around with other options in the right-hand menu until the panel has a look/feel you like. Here's an example:
![Grafana Single Stat Panel Options](../images/grafana-single-stat-panel-options.png)

When finished, select the `Back to Dashboard` button at the top right. Resize your panel as you'd like, then save your dashboard with the `Save dashboard` button.

![Grafana Single Stat Saved](../images/grafana-single-stat-saved.png)

## Step 3 - Time Series Data
Another common panel on a dashboard is displaying time-series data, such as response times. Add a new panel of type `Time series`, with the following query:
```
probe_http_duration_seconds{instance="https://console.openshift-console.svc.cluster.local:443", phase="connect"}
```

Feel free to modify options in the right hand panel, however it is recommended to set the unit to **Time (seconds)**.

For example:
![Grafana Time Series Panel](../images/grafana-time-series-panel.png)

Once complete, return to the dashboard, resize the panel to your liking, and save your dashboard.

## Step 4 - Collaborate with your Team
Continue to build out the dashboard according to you and your team's preferences. There is no set right or wrong here - feel free to experiment and modify as you'd like.

![Grafana Finished Dashboard](../images/grafana-finished-dashboard.png)

The `Kick start your query` fuction in grafana can help you discover metrics and get them displayed on a panel.

Once done editing, ensure you save your dashboard.

![Grafana Save Dashboard](../images/grafana-save-dashboard.png)

---
**Navigation**

[Previous Exercise](../3.2-investigate-resources/)  [Next Exercise](../4.2-exporting-dashboards/)

[Click here to return to the Workshop Homepage](../../README.md)
