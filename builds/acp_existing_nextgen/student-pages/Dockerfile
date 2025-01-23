FROM ansible-automation-platform-24/ee-minimal-rhel9 as template-handler

# Add in static files
USER 0
ADD app-src /tmp/src

# Add in what needs to be templated
ADD templates /tmp/templates

# Add in playbook to handle templates
ADD playbooks /tmp/playbooks

# Run script to handle templates
RUN ansible-playbook /tmp/playbooks/create-pages.yaml --inventory localhost, -vv

# Fix permissions
RUN chown -R 1001:0 /tmp/src

# Start a nodejs builder
FROM ubi9/nodejs-16-minimal as builder
USER 0

# Copy files from template-handler
COPY --from=template-handler /tmp/src /tmp/src

# Fix the permissions
RUN chown -R 1001:0 /tmp/src

# Do this next part as "not-root"
USER 1001

# Use the magic assemble script
RUN /usr/libexec/s2i/assemble

# Start the container to host the assembled 
FROM registry.redhat.io/ubi9/nodejs-16-minimal

# Get the assembled app
COPY --from=builder $HOME $HOME

# Sometimes you need this
RUN chmod -R 777 /opt/app-root/src/node_modules

# Finally run the thing
CMD /usr/libexec/s2i/run
