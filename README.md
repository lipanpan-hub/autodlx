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
@lppx/autodlx/0.0.0 linux-x64 node-v22.23.3
$ adl --help [COMMAND]
USAGE
  $ adl COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`adl autocomplete [SHELL]`](#adl-autocomplete-shell)
* [`adl help [COMMAND]`](#adl-help-command)
* [`adl version`](#adl-version)

## `adl autocomplete [SHELL]`

Display autocomplete installation instructions.

```
USAGE
  $ adl autocomplete [SHELL] [-r]

ARGUMENTS
  [SHELL]  (zsh|bash|powershell) Shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  Display autocomplete installation instructions.

EXAMPLES
  $ adl autocomplete

  $ adl autocomplete bash

  $ adl autocomplete zsh

  $ adl autocomplete powershell

  $ adl autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v4.0.4/src/commands/autocomplete/index.ts)_

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

## `adl version`

```
USAGE
  $ adl version [--json] [--verbose]

FLAGS
  --verbose  Show additional information about the CLI.

GLOBAL FLAGS
  --json  Format output as json.

FLAG DESCRIPTIONS
  --verbose  Show additional information about the CLI.

    Additionally shows the architecture, node version, operating system, and versions of plugins that the CLI is using.
```

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/3.0.5/src/commands/version.ts)_
<!-- commandsstop -->
