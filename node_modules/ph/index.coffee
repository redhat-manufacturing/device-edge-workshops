##############################
### PH - a better git push ###
##############################

inquirer = require "inquirer"
{exec, spawn} = require "child_process"
{exists} = require "fs"
chalk = require "chalk"
pkg = require "./package.json"
_ = require "underscore"
async = require "async"

# set up args and append a dash if the user
# omited one
args = process.argv.slice(2).join ' '
args = "-#{args}" if args[0] isnt '-'
args = args.split " "
argv = require("minimist") args

isGitRepo = (cb, iter=1) ->
  if iter is 0
    pre = "./"
  else
    pre = (for i in [0...iter-1] then "../").join ''

  exists "#{pre}.git", (good) ->
    if good
      cb true
    else if iter <= (process.env.PH_SEARCH_GIT_REPO_AMT or 20)
      isGitRepo cb, iter+1
    else
      cb false


class GitPush
  constructor: (@argv) ->
    # help?
    if @argv.help or @argv['?']
      console.log @help()
      return

    # version?
    if @argv.v or @argv.version
      console.log """
      ph - version #{chalk.cyan pkg.version}
      Run #{chalk.blue "--help"} for help
      """
      return

    # push or pull?
    # inquirer.prompt [
    #   name: "action",
    #   message: "---> push/pull?"
    #   default: "push",
    #   type: "list",
    #   choices: ["push", "pull"]

    # ], (answers) =>
    #   action = answers.action

    if @argv.pull or @argv.l
      action = "pull"
    else
      action = "push"

    # get datapoints
    @getRemote (@remote) =>
      @getBranch (@branches, @pushToBranch) =>

        # pull out all the flags that we care about and stick the rest
        # at the end of the command.
        ignoreFlags = ["_", "pull", "remote", "branch", "origin", "current-branch", "v", "q", "n", "o", "h", "p", "m", "d", "c", "l"]
        extra = Object.keys(@argv).map (k) =>
          if k not in ignoreFlags
            if typeof @argv[k] is "boolean"
              if k.length is 1
                "-#{k}"
              else
                "--#{k}"
            else
              "--#{k} #{@argv[k]}"
          else
            ""

        extra = extra.join(" ").trim " "


        # log the command we are about to run
        async.forEach _.uniq(@branches), (branch, cb) =>

          if @pushToBranch is branch or not @pushToBranch
            @pushToBranch = ""
          else
            @pushToBranch = ":#{@pushToBranch}"


          console.log [
            "----->"
            "git"
            action
            chalk.magenta @remote
            "#{chalk.cyan branch}#{chalk.bgBlue @pushToBranch}"
            extra
          ].join " "

          # and, run it!
          child = spawn "git", _.compact([action, @remote, branch, @pushToBranch, extra])

          onData = (buffer) =>
            s = buffer.toString().trim '\n'
            if @branches.length isnt 1 
              branch = "(#{chalk.cyan branch.trim()}) "
            else
              branch = ""


            # colorize messages
            if s.indexOf("up-to-date") isnt -1
              console.log "-----> #{chalk.green s} #{branch}"
            else if s.indexOf("fatal: ") isnt -1
              console.log "-----> #{chalk.red s} #{branch}"
            else if s.length
              console.log branch+s


          cb = _.once cb
          child.stdout.on 'data', onData
          child.stderr.on 'data', onData
          child.stdout.on 'end', -> cb null
          child.stderr.on 'end', (buffer) -> cb buffer

        , (err, results) ->
          if err
            console.log "-----> Error, aborting."
          else
            console.log "+1"


  getRemote: (cb) =>
    return cb "origin" if @argv.o or @argv.origin
    return cb "heroku" if @argv.h or @argv.heroku
    return cb "production" if @argv.p or @argv.prod
    return cb "upstream" if @argv.u or @argv.upstream

    if not (@argv.r or @argv.remote)
      exec "git remote", (err, remotes) ->
        r = remotes.trim("\n").split "\n"
        inquirer.prompt [
          name: "remote",
          message: "---> remote?"
          default: "origin",
          type: "list",
          choices: r

        ], (answers) ->
          remote = answers.remote
          cb remote
    else
      remote = @argv.r or @argv.remote
      cb remote

  getBranch: (cb) =>
    currentBranch = "master"
    pushBranches = []

    # add branches to list if it matches the flags
    pushBranches.push "master" if @argv.m or @argv.master
    pushBranches.push "dev" if @argv.d or @argv.dev

    if not (@argv.b or @argv.branch)
      exec "git branch", (err, branches) =>

        # construct branch array and find current branch
        b = branches.trim('\n').split('\n').map (b) ->
          if b[0] is "*"
            currentBranch = b.slice(2)
            currentBranch.trim()
          else
            b.trim()
            b
        # add current branche to list if it matches the flag
        pushBranches.push currentBranch if @argv.c or @argv["current-branch"]

        # return if branches contains something
        return cb pushBranches if pushBranches.length

        b = ["master"].concat b if "master" not in b
        inquirer.prompt [
            name: "branch",
            message: "---> branch?"
            type: "list",
            choices: b
            default: currentBranch
          ,
            name: "pushto",
            message: "---> to which remote branch?"
            type: "list"
            choices: b
            default: currentBranch
          ], (answers) ->
            cb [answers.branch], answers.pushto
    else
      branch = @argv.b or @argv.branch
      cb [branch]

  help: ->
    """
    Usage: ph [options]

    #{chalk.bold chalk.yellow "== Action =="}
    By default, do a git push.
    However, by specifing #{chalk.green "--pull"} or #{chalk.green "-l"}
    this behavior can be switched, so a pull will occur instead.

    #{chalk.bold chalk.yellow "== Branch Choices =="}
    #{chalk.cyan "-m"} branch = master
    #{chalk.cyan "-d"} branch = dev
    #{chalk.cyan "-c"} branch = currently active branch

    #{chalk.bold chalk.yellow "== Remote Choices =="}
    #{chalk.magenta "-o"} remote = origin
    #{chalk.magenta "-h"} remote = heroku
    #{chalk.magenta "-p"} remote = production
    #{chalk.magenta "-u"} remote = upstream

    Any other arguments are just passed through to git push/pull.

    == Examples ==
    #{chalk.blue "ph c"} or #{chalk.blue "ph --current-branch"}
    - ask for the remote but push to the current branch.

    #{chalk.blue "ph oc"} or #{chalk.blue "ph --remote origin --current-branch"}
    - push to origin the current branch.

    #{chalk.blue "ph hm"} or #{chalk.blue "ph -h -m"} or #{chalk.blue "ph --remote heroku --branch master"}
    - push to heroku the master branch.

    #{chalk.blue "ph oml"} or #{chalk.blue "ph --pull --branch master --remote origin"}
    - pull from master the current branch.
    """

exports.GitPush = GitPush

# and, check to make sure this is a git repo
isGitRepo (doesit) ->
  if doesit or argv.help or argv['?']
    new GitPush argv
  else
    console.log chalk.red "This isn't a git repo!"
