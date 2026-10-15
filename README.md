@lppx/autodlx
=================

A developer-friendly multi-command CLI tool


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@lppx/autodlx.svg)](https://npmjs.org/package/@lppx/autodlx)
[![Downloads/week](https://img.shields.io/npm/dw/@lppx/autodlx.svg)](https://npmjs.org/package/@lppx/autodlx)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @lppx/autodlx
$ adl COMMAND
running command...
$ adl (--version)
@lppx/autodlx/0.0.0 win32-x64 node-v24.14.1
$ adl --help [COMMAND]
USAGE
  $ adl COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`adl hello PERSON`](#adl-hello-person)
* [`adl hello world`](#adl-hello-world)
* [`adl help [COMMAND]`](#adl-help-command)
* [`adl plugins`](#adl-plugins)
* [`adl plugins add PLUGIN`](#adl-plugins-add-plugin)
* [`adl plugins:inspect PLUGIN...`](#adl-pluginsinspect-plugin)
* [`adl plugins install PLUGIN`](#adl-plugins-install-plugin)
* [`adl plugins link PATH`](#adl-plugins-link-path)
* [`adl plugins remove [PLUGIN]`](#adl-plugins-remove-plugin)
* [`adl plugins reset`](#adl-plugins-reset)
* [`adl plugins uninstall [PLUGIN]`](#adl-plugins-uninstall-plugin)
* [`adl plugins unlink [PLUGIN]`](#adl-plugins-unlink-plugin)
* [`adl plugins update`](#adl-plugins-update)

## `adl hello PERSON`

Say hello

```
USAGE
  $ adl hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ adl hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/lipanpan-hub/autodlx/blob/v0.0.0/src/commands/hello/index.ts)_

## `adl hello world`

Say hello world

```
USAGE
  $ adl hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ adl hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/lipanpan-hub/autodlx/blob/v0.0.0/src/commands/hello/world.ts)_

## `adl help [COMMAND]`

Display help for adl.

```
USAGE
  $ adl help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for adl.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/6.3.0/src/commands/help.ts)_

## `adl plugins`

List installed plugins.

```
USAGE
  $ adl plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ adl plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.5.2/src/commands/plugins/index.ts)_

## `adl plugins add PLUGIN`

Installs a plugin into adl.

```
USAGE
  $ adl plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into adl.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the ADL_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the ADL_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ adl plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ adl plugins add myplugin

  Install a plugin from a github url.

    $ adl plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ adl plugins add someuser/someplugin
```

## `adl plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ adl plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ adl plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.5.2/src/commands/plugins/inspect.ts)_

## `adl plugins install PLUGIN`

Installs a plugin into adl.

```
USAGE
  $ adl plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into adl.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the ADL_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the ADL_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ adl plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ adl plugins install myplugin

  Install a plugin from a github url.

    $ adl plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ adl plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.5.2/src/commands/plugins/install.ts)_

## `adl plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ adl plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ adl plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.5.2/src/commands/plugins/link.ts)_

## `adl plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ adl plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ adl plugins unlink
  $ adl plugins remove

EXAMPLES
  $ adl plugins remove myplugin
```

## `adl plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ adl plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.5.2/src/commands/plugins/reset.ts)_

## `adl plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ adl plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ adl plugins unlink
  $ adl plugins remove

EXAMPLES
  $ adl plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.5.2/src/commands/plugins/uninstall.ts)_

## `adl plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ adl plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ adl plugins unlink
  $ adl plugins remove

EXAMPLES
  $ adl plugins unlink myplugin
```

## `adl plugins update`

Update installed plugins.

```
USAGE
  $ adl plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.5.2/src/commands/plugins/update.ts)_
<!-- commandsstop -->
