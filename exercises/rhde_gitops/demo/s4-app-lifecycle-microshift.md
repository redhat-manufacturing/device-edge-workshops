# APPs with Microshift

Before starting this section is a good idea to double-check that Microshift is running by reviewing if all pods are in "running state". As root user in the edge device run:

```bash
[root@edge-848bcd4d1537 ~]# oc --kubeconfig /var/lib/microshift/resources/kubeadmin/kubeconfig get pod --all-namespaces
NAMESPACE                  NAME                                       READY   STATUS    RESTARTS       AGE
kube-system                csi-snapshot-controller-85cc4fd76b-v2hp8   1/1     Running   0              168m
kube-system                csi-snapshot-webhook-869fcd59f8-ljrs8      1/1     Running   0              168m
openshift-dns              dns-default-5wk47                          2/2     Running   0              164m
openshift-dns              node-resolver-s87rt                        1/1     Running   0              168m
openshift-ingress          router-default-7bf6cc7bbd-rnfx8            1/1     Running   0              168m
openshift-ovn-kubernetes   ovnkube-master-vpgbf                       4/4     Running   1 (164m ago)   168m
openshift-ovn-kubernetes   ovnkube-node-czhfw                         1/1     Running   2 (164m ago)   168m
openshift-service-ca       service-ca-585c8dc78-bzbmd                 1/1     Running   0              168m
openshift-storage          topolvm-controller-6457fbcd6c-ld9sz        5/5     Running   0              168m
openshift-storage          topolvm-node-62sbm                         4/4     Running   0              164m
test                       test-hello-f9974746-52fjv                  1/1     Running   0              168m
```

Depending on the network Bandwidth and the system resources, Microshift can take some time to start since it needs to download the container images and run the required PODs (I've seen even 15 minutes delays). While starting you will see PODs such as `ovnkube-master`, `ovnkube-node` and `node-resolver` in `ContainerCreating` and the rest of PODs in `Pending`.

If after some time your PODs are still not running, it could happen that your system does not have the `pull-secret` configured in `/etc/crio/openshift-pull-secret` (it should have been deployed by the kickstart file that we prepared during Section 1 but maybe you didn't include the pull-secret variable or you used a different kickstart that does not add the pull-secret in the system).


.
  >**Note**
  >
  > Microshift, which is a Kubernetes node, will rely on a wildcard domain name to publish the APPs. Since the edge device IP is not fixed by the playbooks we don't setup any DNS entry on the edge local server. The easiest way to obtain a wildcard for this demo is by using the [nio.ip](http://nio.io) service which resolves to the IP that you use as a prefix on the domain name (so `http://1.1.1.1.nip.io` will resolve to `1.1.1.1`). As you can see there is already a deployed test app that you can check on `http://test.apps.<edge device ip>.nip.io` on the Web Browser with the SOCKS proxy configured..


## Deploy an APP on Microsift from Manifest files on Gitea

1. Go to `device-edge-configs/APPs/microshift/manifest` in Gitea. There you will find example manifest files that you can use to deploy the 2048 Web Browser application on top Microshift. Show the files.

2. Go to the edge device and as root user run `watch "oc --kubeconfig /var/lib/microshift/resources/kubeadmin/kubeconfig get pod --all-namespace"`. Keep the terminal visible to show how new PODs are created while proceeding with the steps below.

3. Again two options: Launch manually the Template "Microshift APP Deploy - Manifest" or change something on those Manifest files (ie. adding `demo: gitops` label on the deployment.yaml) to use EDA (again, if you choose this option let visible the AAP "Jobs" list while pushing your change in Gitea). 

4. Once you see the new POD "Running" (namespace `game2048`) on the edge device CLI Terminal running `watch` you can show the application using the Web Browser with the SOCKS proxy configured at `http://frontend-game2048.apps.<edge device ip>.nip.io`


In the manifest `deployment.yaml` file you can see how we are using the 2048 app `v1`, the one with the problem (image not loading). You can take advantage of that and show how to perform a day-2 action: update the image version, but just changing it on the manifest on Gitea.

5. Be sure that you have AAP "Jobs" and the edge device CLI Terminal running `watch` visible.

6. Open the `device-edge-configs/APPs/microshift/manifest/2-deployment.yml` in Gitea and change the image tag from `v1` to `v3` (remember that `v2` does not work).

7. Wait until the new POD is running (you can see it on the CLI running `watch`)

8. Clear the cache of the Web Browser where SOCKS proxy is configured (or use Private/Incognito mode) and open again the 2048 game app in `http://frontend-game2048.apps.<edge device ip>.nip.io`. This time the image will be loaded since we are using the new version.


## Deploy an APP on Microsift with external Helm repo and vars file on Gitea 

Now we are going to deploy an APP on Microshift by using Helm from AAP and by gathering the vars from a file hosted in Gitea.

1. Be sure that you have AAP "Jobs" and the edge device CLI Terminal running `watch "oc --kubeconfig /var/lib/microshift/resources/kubeadmin/kubeconfig get pod --all-namespace"` visible.

2. Open `device-edge-configs/APPs/microshift/helm/wordpress_vars.yml` where you will find the definition of the variables for a Helm Chart that deploys `Wordpress`.

3. Either change something in that file (ie. the `wordpressBlogName`) or launch manually the AAP Template "Microshift APP Deploy - Helm" to get installed the APP on the edge device

  >**Note**
  >
  > The Helm Chart repo (`https://raw.githubusercontent.com/luisarizmendi/helm-chart-repo/main/packages`) and Chart (the one that deploys `Wordpress`) are defined on the variables associated to the AAP Template. This is just an example for the demo, in production there might be better ways to do it, more if you use many different Helm Charts.

4. Wait until the PODs are running and show the APP on the Web Browser with the SOCKS proxy configured at `http://wordpress-wordpress.apps.<edge device ip>.nip.io`

Now you can show how to modify the APP by just changing the values on the Gitea.

5. Open `device-edge-configs/APPs/microshift/helm/wordpress_vars.yml` and change the `replicaCount` number

6. Wait and see how that number of replicas is deployed on Microshift.

  >**Note**
  >
  > That will be the replicaCount of just the Wordpress frontend, the mysql database will keep one single replica.



