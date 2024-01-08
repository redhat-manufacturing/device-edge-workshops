# Summary and demo step guide



0. Introduction
    1. De

1. Section 1 - Creating RHEL Images the GitOps way
    1. De

2. Section 2 - Automated device onboarding
    1. Bo

3. Section 3 - Consistent edge device configuration at scale
    1. Bo

4. Section 4 - Edge computing APPs lifecycle management

    - APPs with Podman and Systemd

        - Serverless APP with Podman and Systemd
            1. Run `podman ps`
            2. Run `watch podman ps`
            3. Visit `http://<edge device IP>:8080` from your laptop
            4. Show what happened in the terminal where `watch podman ps`
            5. Wait 90 seconds and show how the Container is stopped automatically

        - Podman container image auto-update
            1. Open `http:<edge device ip>:8081` in your laptop
            2. Show the image load problem in the APP
            3. Show the binding betwen `prod` and `v1` tags in Quay.io for the 2048 continer image
            4. Show the issue introduced in container image `v2`
            5. Run the `watch 'podman auto-update --dry-run; echo ""; podman ps'`
            6. Move the `prod` container image tag to `v2` in Quay.io
            7. Show how the new image is detected and deployed but how Podman rollback to the previous version due to the issue
            8. Move the `prod` container image tag to `v3` where the image locad problem is solved and show the fixed app in your Browser 
        - Deploying an APP in Podman in a declarative way
            1. Show `device-edge-configs/APPs/podman/quadlet` folder in Gitea
            2. Run the "Create Quadlet APP" Template in AAP
            3. Run `podman ps` on the device
            4. Show the APP by visiting `http:<edge device IP>:<configured port>`
            5. Change something in the `device-edge-configs/APPs/podman/quadlet/app_fuxa_scada.container` file and see the change in the APP

    - APPs with Microshift

        - Deploy an APP on Microsift from Manifest files on Gitea
            1. Show manifests located in `device-edge-configs/APPs/microshift/manifest` in Gitea.
            2. Run `watch "oc --kubeconfig /var/lib/microshift/resources/kubeadmin/kubeconfig get pod --all-namespace"` as root
            3. Launch the  "Microshift APP Deploy - Manifest" Template in AAP
            4. Open `http://frontend-game2048.apps.<edge device ip>.nip.io` in your laptop
            5. Open "Jobs" in AAP and keep it visible along with the `watch` on the CLI
            6. Change image version to `v3` in `device-edge-configs/APPs/microshift/manifest/2-deployment.yml`
            7. Check the `watch` command and wait until the new POD is running
            8. Open `http://frontend-game2048.apps.<edge device ip>.nip.io` in your laptop and show the 2048 app with the image loaded

        - Deploy an APP on Microsift with external Helm repo and vars file on Gitea
            1. Open "Jobs" in AAP and `watch "oc --kubeconfig /var/lib/microshift/resources/kubeadmin/kubeconfig get pod --all-namespace"`
            2. Show `device-edge-configs/APPs/microshift/helm/wordpress_vars.yml` in Gitea
            3. Run the  "Microshift APP Deploy - Helm" Template manually in the AAP
            4. Visit `http://wordpress-wordpress.apps.<edge device ip>.nip.io` in your laptop when the PODs are running
            5. Open `device-edge-configs/APPs/microshift/helm/wordpress_vars.yml` and change the `replicaCount` number
            6. Wait and see how that number of replicas is deployed on Microshift

5. Section 5 - Bulletproof system upgrades
    1. Bo

6. Closing
    1. Bo
