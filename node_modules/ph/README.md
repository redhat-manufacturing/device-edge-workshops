# PH: Add some chemistry to your git push!

Typing `git push origin master` or arrowing through history sucks. 

Instead, do this: `ph om`

## Install
  Run `npm i -g ph` to install. `cd` into a git repo, then try out some of the examples below.

## Usage: ph [options]
- `-f, -v, -q, -n` are the same as git push, normally.

## Branch Choices
- `-m` branch = master
- `-d` branch = dev
- `-c` or `--current-branch` branch = currently active branch
- `--branch [branch]` pick an arbitrary branch

## Remote Choices
- `-o` remote = origin
- `-h` remote = heroku
- `-p` remote = production
- `--remote [remote]` pick an arbitrary remote

## Examples
- `ph c` ask for the remote but push to the current branch.
- `ph oc` push to origin the current branch.
- `ph hm` push to heroku the master branch.
- `ph ocf` force-push to origin with the current branch.
- `ph --remote origin --branch master` push to origin with the master branch.

Any data not specified is prompted for. For example, if you'd like to push to either origin or production, then do `ph c`. This will allow you to choose a remote to push to each time.