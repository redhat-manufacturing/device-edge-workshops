# Good Practices for Ansible Vars

## "Internal" Vars
For variables only used within a role or collection, it's not a bad idea to denote that it's an "internal" variable. Typically, this is done by preceeding the name with an underscore:

```yaml
_internal_var_one: my-value
_internal_var_two: my-other-value
```

This can also stack: if you have multiple internal vars and want to quickly denote the level of precedence, multiple underscores can be used. For example:
```yaml
# This is defined in role1/defaults:
_internal_var_one: my-value

## This is defined in role2/vars:
__internal_var_two: my-value2
```

Remember: even though these variables are "internal", they're still ansible variables, meaning they can be overriden according to variable precednece.

## "External" Vars
In contrast, external vars are variables that are expected to be defined externally to a role/collection/playbook. They're probably the vabiables the end consumer of your automation will interact with:
```yaml
external_var_one: my-value
external_var_two: my-other-value
```

Generally speaking, it's a good idea to couple external vars with proper documentation and a pre-flight validation. For example, in the documentaiton of a role:

```
# Role Variables
# Define these variables before running the role:
external_var_one: my-value
external_var_two: my-other-value
```


And a supporting pre-flight validation:
```yaml
- name: ensure variables are defined
  ansible.builtin.assert:
    that:
      - external_var_one is defined
      - external_var_two is defined
```

## Real World Example
Here's an example for provisioning a cloud instance, with `cloud` and `subscription` defined at the `role/vars` level, and `region` defined at the `role/defaults` level:

### Internal Variables
```yaml
_cloud: aws
__region: us-east-1
_subscription: aws-sub-1
```

### External Variables
```yaml
cpus: 4
memory_mb: 8192
```

By default, I'll get a new cloud instance in AWS, in the us-east-1 region, in the specified AWS subscription, with 4 cores and 8GB of RAM.


Remember, internal variables can still be overriden. For example, if I wanted an instance in Azure, I can specify that in a location with higher variable precedence, such as an `extra-vars.yml` file:
```yaml
_cloud: azure
__region: us-west-2
_subscription: azure-sub-1
```
