# autodlx

AutoDL 容器云的命令行管理工具。在终端里完成实例的创建、开关机、释放、保存镜像等日常操作，支持多配置档案切换与交互式参数补全。

## 特性

- **实例全生命周期管理**：创建、开机、关机、释放、状态与详情查询，异步操作轮询确认最终生效
- **镜像管理**：查看私有镜像列表，将实例保存为私有镜像
- **交互式体验**：实例 ID、算力规格、镜像等参数缺省时自动进入交互式选择，支持模糊搜索
- **多配置档案**：YAML 多档案管理 Token，支持一键切换与内置 TUI / 外部编辑器编辑
- **别名友好**：常用命令提供短别名（如 `adl ps`、`adl up`、`adl down`）

## 安装

```sh
npm install -g @lppx/autodlx
```

要求 Node.js >= 18。

## 快速开始

1. 配置开发者 Token (控制台 -> 设置 -> 开发者Token, 省略参数时交互式输入)

```sh
adl login <your-token>
```

2. 查看账户余额与实例列表

```sh
adl balance
adl instance list
```

3. 创建实例 (缺省参数时交互式选择算力规格与镜像)

```sh
adl instance create --gpu-spec 5090-p --image base-image-l2t43iu6uk --name 训练机
```

4. 开机并执行命令

```sh
adl instance start <instance-id> --command "python train.py"
```

5. 查看实例详情 (SSH/Jupyter/服务访问地址等)

```sh
adl instance show <instance-id>
```

6. 用完关机 (轮询确认关机成功后才返回)

```sh
adl instance stop <instance-id>
```

## 配置

Token 保存在多档案 YAML 配置文件中，执行 `adl config show` 可查看配置文件路径与当前内容：

```yaml
current: default
profiles:
  - name: default
    autodlToken: <your-token>
  - name: work
    autodlToken: <another-token>
```

```sh
# 切换当前激活档案 (支持模糊搜索, 输入新名称可直接建档)
adl config switch work

# 编辑配置文件: 默认内置 TUI 编辑器, --editor 可选择系统外部编辑器
adl config edit
adl config edit --editor
```

## 命令速查

- `adl login [token]` — 保存开发者 Token 到当前配置档案
- `adl balance` — 查询账户余额
- `adl instance list` / `adl ps` — 实例列表
- `adl instance create` / `adl new` — 创建实例
- `adl instance start <id>` / `adl up` — 开机
- `adl instance stop [id]` / `adl down` — 关机 (确认关机成功才返回)
- `adl instance release [id]` / `adl rm` — 释放实例 (不可恢复, 需 `--force` 跳过确认)
- `adl instance status [id]` / `adl st` — 实例状态
- `adl instance show [id]` / `adl info` — 实例详情
- `adl instance save-image <id> <name>` / `adl commit` — 保存为私有镜像
- `adl image list` / `adl images` — 私有镜像列表
- `adl config show` / `adl config switch` / `adl config edit` — 配置管理

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
<!-- commands -->
* [`adl autocomplete [SHELL]`](#adl-autocomplete-shell)
* [`adl bal`](#adl-bal)
* [`adl balance`](#adl-balance)
* [`adl cf edit`](#adl-cf-edit)
* [`adl cf ls`](#adl-cf-ls)
* [`adl cf show`](#adl-cf-show)
* [`adl cf sw [NAME]`](#adl-cf-sw-name)
* [`adl cf use [NAME]`](#adl-cf-use-name)
* [`adl commit INSTANCEUUID IMAGENAME`](#adl-commit-instanceuuid-imagename)
* [`adl config edit`](#adl-config-edit)
* [`adl config show`](#adl-config-show)
* [`adl config switch [NAME]`](#adl-config-switch-name)
* [`adl down [INSTANCEUUID]`](#adl-down-instanceuuid)
* [`adl help [COMMAND]`](#adl-help-command)
* [`adl image list`](#adl-image-list)
* [`adl images`](#adl-images)
* [`adl img ls`](#adl-img-ls)
* [`adl info [INSTANCEUUID]`](#adl-info-instanceuuid)
* [`adl inst down [INSTANCEUUID]`](#adl-inst-down-instanceuuid)
* [`adl inst info [INSTANCEUUID]`](#adl-inst-info-instanceuuid)
* [`adl inst ls`](#adl-inst-ls)
* [`adl inst new`](#adl-inst-new)
* [`adl inst rm [INSTANCEUUID]`](#adl-inst-rm-instanceuuid)
* [`adl inst save INSTANCEUUID IMAGENAME`](#adl-inst-save-instanceuuid-imagename)
* [`adl inst st [INSTANCEUUID]`](#adl-inst-st-instanceuuid)
* [`adl inst up INSTANCEUUID`](#adl-inst-up-instanceuuid)
* [`adl instance create`](#adl-instance-create)
* [`adl instance list`](#adl-instance-list)
* [`adl instance release [INSTANCEUUID]`](#adl-instance-release-instanceuuid)
* [`adl instance save-image INSTANCEUUID IMAGENAME`](#adl-instance-save-image-instanceuuid-imagename)
* [`adl instance show [INSTANCEUUID]`](#adl-instance-show-instanceuuid)
* [`adl instance start INSTANCEUUID`](#adl-instance-start-instanceuuid)
* [`adl instance status [INSTANCEUUID]`](#adl-instance-status-instanceuuid)
* [`adl instance stop [INSTANCEUUID]`](#adl-instance-stop-instanceuuid)
* [`adl login [TOKEN]`](#adl-login-token)
* [`adl new`](#adl-new)
* [`adl ps`](#adl-ps)
* [`adl rm [INSTANCEUUID]`](#adl-rm-instanceuuid)
* [`adl st [INSTANCEUUID]`](#adl-st-instanceuuid)
* [`adl up INSTANCEUUID`](#adl-up-instanceuuid)
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

## `adl bal`

查询 AutoDL 账户余额

```
USAGE
  $ adl bal

DESCRIPTION
  查询 AutoDL 账户余额

ALIASES
  $ adl bal

EXAMPLES
  $ adl bal
```

## `adl balance`

查询 AutoDL 账户余额

```
USAGE
  $ adl balance

DESCRIPTION
  查询 AutoDL 账户余额

ALIASES
  $ adl bal

EXAMPLES
  $ adl balance
```

_See code: [src/commands/balance.ts](https://github.com/lipanpan-hub/autodlx/blob/v0.0.0/src/commands/balance.ts)_

## `adl cf edit`

编辑用户配置文件, 默认启动内置 TUI 编辑器, 也可选择系统中的外部编辑器

```
USAGE
  $ adl cf edit [-e]

FLAGS
  -e, --editor  交互式选择系统中可用的外部编辑器进行编辑

DESCRIPTION
  编辑用户配置文件, 默认启动内置 TUI 编辑器, 也可选择系统中的外部编辑器

ALIASES
  $ adl cf edit

EXAMPLES
  $ adl cf edit

  $ adl cf edit --editor
```

## `adl cf ls`

列出所有的配置

```
USAGE
  $ adl cf ls

DESCRIPTION
  列出所有的配置

ALIASES
  $ adl cf ls
  $ adl cf show

EXAMPLES
  $ adl cf ls
```

## `adl cf show`

列出所有的配置

```
USAGE
  $ adl cf show

DESCRIPTION
  列出所有的配置

ALIASES
  $ adl cf ls
  $ adl cf show

EXAMPLES
  $ adl cf show
```

## `adl cf sw [NAME]`

切换配置文件中的默认(当前激活)配置档案

```
USAGE
  $ adl cf sw [NAME]

ARGUMENTS
  [NAME]  要切换到的配置档案名, 省略时进入交互式选择

DESCRIPTION
  切换配置文件中的默认(当前激活)配置档案

ALIASES
  $ adl cf sw
  $ adl cf use

EXAMPLES
  $ adl cf sw work

  $ adl cf sw
```

## `adl cf use [NAME]`

切换配置文件中的默认(当前激活)配置档案

```
USAGE
  $ adl cf use [NAME]

ARGUMENTS
  [NAME]  要切换到的配置档案名, 省略时进入交互式选择

DESCRIPTION
  切换配置文件中的默认(当前激活)配置档案

ALIASES
  $ adl cf sw
  $ adl cf use

EXAMPLES
  $ adl cf use work

  $ adl cf use
```

## `adl commit INSTANCEUUID IMAGENAME`

将 AutoDL 实例保存为私有镜像

```
USAGE
  $ adl commit INSTANCEUUID IMAGENAME

ARGUMENTS
  INSTANCEUUID  实例ID
  IMAGENAME     镜像名称

DESCRIPTION
  将 AutoDL 实例保存为私有镜像

ALIASES
  $ adl commit
  $ adl inst save

EXAMPLES
  $ adl commit pro-76419909953e my-image
```

## `adl config edit`

编辑用户配置文件, 默认启动内置 TUI 编辑器, 也可选择系统中的外部编辑器

```
USAGE
  $ adl config edit [-e]

FLAGS
  -e, --editor  交互式选择系统中可用的外部编辑器进行编辑

DESCRIPTION
  编辑用户配置文件, 默认启动内置 TUI 编辑器, 也可选择系统中的外部编辑器

ALIASES
  $ adl cf edit

EXAMPLES
  $ adl config edit

  $ adl config edit --editor
```

_See code: [src/commands/config/edit.ts](https://github.com/lipanpan-hub/autodlx/blob/v0.0.0/src/commands/config/edit.ts)_

## `adl config show`

列出所有的配置

```
USAGE
  $ adl config show

DESCRIPTION
  列出所有的配置

ALIASES
  $ adl cf ls
  $ adl cf show

EXAMPLES
  $ adl config show
```

_See code: [src/commands/config/show.ts](https://github.com/lipanpan-hub/autodlx/blob/v0.0.0/src/commands/config/show.ts)_

## `adl config switch [NAME]`

切换配置文件中的默认(当前激活)配置档案

```
USAGE
  $ adl config switch [NAME]

ARGUMENTS
  [NAME]  要切换到的配置档案名, 省略时进入交互式选择

DESCRIPTION
  切换配置文件中的默认(当前激活)配置档案

ALIASES
  $ adl cf sw
  $ adl cf use

EXAMPLES
  $ adl config switch work

  $ adl config switch
```

_See code: [src/commands/config/switch.ts](https://github.com/lipanpan-hub/autodlx/blob/v0.0.0/src/commands/config/switch.ts)_

## `adl down [INSTANCEUUID]`

关机 AutoDL 实例 (轮询确认关机成功后才返回)

```
USAGE
  $ adl down [INSTANCEUUID]

ARGUMENTS
  [INSTANCEUUID]  实例ID (未提供时交互式选择)

DESCRIPTION
  关机 AutoDL 实例 (轮询确认关机成功后才返回)

ALIASES
  $ adl down
  $ adl inst down

EXAMPLES
  $ adl down pro-76419909953e
```

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

## `adl image list`

获取 AutoDL 私有镜像列表

```
USAGE
  $ adl image list [--page <value>] [--size <value>]

FLAGS
  --page=<value>  [default: 1] 页码, 从 1 开始
  --size=<value>  [default: 10] 每页数量

DESCRIPTION
  获取 AutoDL 私有镜像列表

ALIASES
  $ adl images
  $ adl img ls

EXAMPLES
  $ adl image list --page 1 --size 20
```

_See code: [src/commands/image/list.ts](https://github.com/lipanpan-hub/autodlx/blob/v0.0.0/src/commands/image/list.ts)_

## `adl images`

获取 AutoDL 私有镜像列表

```
USAGE
  $ adl images [--page <value>] [--size <value>]

FLAGS
  --page=<value>  [default: 1] 页码, 从 1 开始
  --size=<value>  [default: 10] 每页数量

DESCRIPTION
  获取 AutoDL 私有镜像列表

ALIASES
  $ adl images
  $ adl img ls

EXAMPLES
  $ adl images --page 1 --size 20
```

## `adl img ls`

获取 AutoDL 私有镜像列表

```
USAGE
  $ adl img ls [--page <value>] [--size <value>]

FLAGS
  --page=<value>  [default: 1] 页码, 从 1 开始
  --size=<value>  [default: 10] 每页数量

DESCRIPTION
  获取 AutoDL 私有镜像列表

ALIASES
  $ adl images
  $ adl img ls

EXAMPLES
  $ adl img ls --page 1 --size 20
```

## `adl info [INSTANCEUUID]`

获取 AutoDL 实例详情(SSH/Jupyter/服务访问地址等)

```
USAGE
  $ adl info [INSTANCEUUID]

ARGUMENTS
  [INSTANCEUUID]  实例ID (未提供时交互式选择)

DESCRIPTION
  获取 AutoDL 实例详情(SSH/Jupyter/服务访问地址等)

ALIASES
  $ adl info
  $ adl inst info

EXAMPLES
  $ adl info pro-76419909953e

  $ adl info
```

## `adl inst down [INSTANCEUUID]`

关机 AutoDL 实例 (轮询确认关机成功后才返回)

```
USAGE
  $ adl inst down [INSTANCEUUID]

ARGUMENTS
  [INSTANCEUUID]  实例ID (未提供时交互式选择)

DESCRIPTION
  关机 AutoDL 实例 (轮询确认关机成功后才返回)

ALIASES
  $ adl down
  $ adl inst down

EXAMPLES
  $ adl inst down pro-76419909953e
```

## `adl inst info [INSTANCEUUID]`

获取 AutoDL 实例详情(SSH/Jupyter/服务访问地址等)

```
USAGE
  $ adl inst info [INSTANCEUUID]

ARGUMENTS
  [INSTANCEUUID]  实例ID (未提供时交互式选择)

DESCRIPTION
  获取 AutoDL 实例详情(SSH/Jupyter/服务访问地址等)

ALIASES
  $ adl info
  $ adl inst info

EXAMPLES
  $ adl inst info pro-76419909953e

  $ adl inst info
```

## `adl inst ls`

获取 AutoDL 实例列表

```
USAGE
  $ adl inst ls [--page <value>] [--size <value>]

FLAGS
  --page=<value>  [default: 1] 页码, 从 1 开始
  --size=<value>  [default: 10] 每页数量

DESCRIPTION
  获取 AutoDL 实例列表

ALIASES
  $ adl ps
  $ adl inst ls

EXAMPLES
  $ adl inst ls --page 1 --size 20
```

## `adl inst new`

创建 AutoDL 容器实例 (默认按量计费, 未提供 --gpu-spec/--image 时进入交互式选择)

```
USAGE
  $ adl inst new [--gpu-spec <value>] [--image <value>] [--gpu-amount <value>] [--system-disk <value>]
    [--cuda-from <value>] [--data-center <value>...] [--name <value>] [--command <value>]

FLAGS
  --command=<value>         开机后执行的命令
  --cuda-from=<value>       [default: 113] CUDA 版本下限, 113 表示 cuda>=11.3
  --data-center=<value>...  [default: ] 候选地区代码, 可多次指定, 如 --data-center westDC3 --data-center beijingDC2,
                            省略时自动选择
  --gpu-amount=<value>      [default: 1] GPU数量, 取值 1-4
  --gpu-spec=<value>        算力规格ID, 如 pro6000-p / 5090-p / v-48g, 缺省时交互式选择
  --image=<value>           镜像UUID, 如 image-xxx 或公共镜像 base-image-xxx, 缺省时交互式选择
  --name=<value>            实例备注名
  --system-disk=<value>     系统盘扩容大小(GB), 取值 0-500

DESCRIPTION
  创建 AutoDL 容器实例 (默认按量计费, 未提供 --gpu-spec/--image 时进入交互式选择)

ALIASES
  $ adl new
  $ adl inst new

EXAMPLES
  $ adl inst new --gpu-spec pro6000-p --image image-xxxxxxxxx

  $ adl inst new --gpu-spec 5090-p --image base-image-l2t43iu6uk --gpu-amount 2 --name 训练机

  $ adl inst new # 缺少必填参数时交互式选择算力规格与镜像
```

## `adl inst rm [INSTANCEUUID]`

释放 AutoDL 实例 (不可恢复, 释放前需先关机)

```
USAGE
  $ adl inst rm [INSTANCEUUID] [--force]

ARGUMENTS
  [INSTANCEUUID]  实例ID (未提供时交互式选择)

FLAGS
  --force  跳过确认直接释放

DESCRIPTION
  释放 AutoDL 实例 (不可恢复, 释放前需先关机)

ALIASES
  $ adl rm
  $ adl inst rm

EXAMPLES
  $ adl inst rm pro-76419909953e

  $ adl inst rm pro-76419909953e --force
```

## `adl inst save INSTANCEUUID IMAGENAME`

将 AutoDL 实例保存为私有镜像

```
USAGE
  $ adl inst save INSTANCEUUID IMAGENAME

ARGUMENTS
  INSTANCEUUID  实例ID
  IMAGENAME     镜像名称

DESCRIPTION
  将 AutoDL 实例保存为私有镜像

ALIASES
  $ adl commit
  $ adl inst save

EXAMPLES
  $ adl inst save pro-76419909953e my-image
```

## `adl inst st [INSTANCEUUID]`

获取 AutoDL 实例状态 (如 running / shutdown)

```
USAGE
  $ adl inst st [INSTANCEUUID]

ARGUMENTS
  [INSTANCEUUID]  实例ID (未提供时交互式选择)

DESCRIPTION
  获取 AutoDL 实例状态 (如 running / shutdown)

ALIASES
  $ adl st
  $ adl inst st

EXAMPLES
  $ adl inst st pro-76419909953e

  $ adl inst st
```

## `adl inst up INSTANCEUUID`

开机 AutoDL 实例 (有卡模式)

```
USAGE
  $ adl inst up INSTANCEUUID [--command <value>]

ARGUMENTS
  INSTANCEUUID  实例ID

FLAGS
  --command=<value>  开机后执行的命令, 会覆盖创建时设置的命令

DESCRIPTION
  开机 AutoDL 实例 (有卡模式)

ALIASES
  $ adl up
  $ adl inst up

EXAMPLES
  $ adl inst up pro-76419909953e

  $ adl inst up pro-76419909953e --command "python train.py"
```

## `adl instance create`

创建 AutoDL 容器实例 (默认按量计费, 未提供 --gpu-spec/--image 时进入交互式选择)

```
USAGE
  $ adl instance create [--gpu-spec <value>] [--image <value>] [--gpu-amount <value>] [--system-disk <value>]
    [--cuda-from <value>] [--data-center <value>...] [--name <value>] [--command <value>]

FLAGS
  --command=<value>         开机后执行的命令
  --cuda-from=<value>       [default: 113] CUDA 版本下限, 113 表示 cuda>=11.3
  --data-center=<value>...  [default: ] 候选地区代码, 可多次指定, 如 --data-center westDC3 --data-center beijingDC2,
                            省略时自动选择
  --gpu-amount=<value>      [default: 1] GPU数量, 取值 1-4
  --gpu-spec=<value>        算力规格ID, 如 pro6000-p / 5090-p / v-48g, 缺省时交互式选择
  --image=<value>           镜像UUID, 如 image-xxx 或公共镜像 base-image-xxx, 缺省时交互式选择
  --name=<value>            实例备注名
  --system-disk=<value>     系统盘扩容大小(GB), 取值 0-500

DESCRIPTION
  创建 AutoDL 容器实例 (默认按量计费, 未提供 --gpu-spec/--image 时进入交互式选择)

ALIASES
  $ adl new
  $ adl inst new

EXAMPLES
  $ adl instance create --gpu-spec pro6000-p --image image-xxxxxxxxx

  $ adl instance create --gpu-spec 5090-p --image base-image-l2t43iu6uk --gpu-amount 2 --name 训练机

  $ adl instance create # 缺少必填参数时交互式选择算力规格与镜像
```

_See code: [src/commands/instance/create.ts](https://github.com/lipanpan-hub/autodlx/blob/v0.0.0/src/commands/instance/create.ts)_

## `adl instance list`

获取 AutoDL 实例列表

```
USAGE
  $ adl instance list [--page <value>] [--size <value>]

FLAGS
  --page=<value>  [default: 1] 页码, 从 1 开始
  --size=<value>  [default: 10] 每页数量

DESCRIPTION
  获取 AutoDL 实例列表

ALIASES
  $ adl ps
  $ adl inst ls

EXAMPLES
  $ adl instance list --page 1 --size 20
```

_See code: [src/commands/instance/list.ts](https://github.com/lipanpan-hub/autodlx/blob/v0.0.0/src/commands/instance/list.ts)_

## `adl instance release [INSTANCEUUID]`

释放 AutoDL 实例 (不可恢复, 释放前需先关机)

```
USAGE
  $ adl instance release [INSTANCEUUID] [--force]

ARGUMENTS
  [INSTANCEUUID]  实例ID (未提供时交互式选择)

FLAGS
  --force  跳过确认直接释放

DESCRIPTION
  释放 AutoDL 实例 (不可恢复, 释放前需先关机)

ALIASES
  $ adl rm
  $ adl inst rm

EXAMPLES
  $ adl instance release pro-76419909953e

  $ adl instance release pro-76419909953e --force
```

_See code: [src/commands/instance/release.ts](https://github.com/lipanpan-hub/autodlx/blob/v0.0.0/src/commands/instance/release.ts)_

## `adl instance save-image INSTANCEUUID IMAGENAME`

将 AutoDL 实例保存为私有镜像

```
USAGE
  $ adl instance save-image INSTANCEUUID IMAGENAME

ARGUMENTS
  INSTANCEUUID  实例ID
  IMAGENAME     镜像名称

DESCRIPTION
  将 AutoDL 实例保存为私有镜像

ALIASES
  $ adl commit
  $ adl inst save

EXAMPLES
  $ adl instance save-image pro-76419909953e my-image
```

_See code: [src/commands/instance/save-image.ts](https://github.com/lipanpan-hub/autodlx/blob/v0.0.0/src/commands/instance/save-image.ts)_

## `adl instance show [INSTANCEUUID]`

获取 AutoDL 实例详情(SSH/Jupyter/服务访问地址等)

```
USAGE
  $ adl instance show [INSTANCEUUID]

ARGUMENTS
  [INSTANCEUUID]  实例ID (未提供时交互式选择)

DESCRIPTION
  获取 AutoDL 实例详情(SSH/Jupyter/服务访问地址等)

ALIASES
  $ adl info
  $ adl inst info

EXAMPLES
  $ adl instance show pro-76419909953e

  $ adl instance show
```

_See code: [src/commands/instance/show.ts](https://github.com/lipanpan-hub/autodlx/blob/v0.0.0/src/commands/instance/show.ts)_

## `adl instance start INSTANCEUUID`

开机 AutoDL 实例 (有卡模式)

```
USAGE
  $ adl instance start INSTANCEUUID [--command <value>]

ARGUMENTS
  INSTANCEUUID  实例ID

FLAGS
  --command=<value>  开机后执行的命令, 会覆盖创建时设置的命令

DESCRIPTION
  开机 AutoDL 实例 (有卡模式)

ALIASES
  $ adl up
  $ adl inst up

EXAMPLES
  $ adl instance start pro-76419909953e

  $ adl instance start pro-76419909953e --command "python train.py"
```

_See code: [src/commands/instance/start.ts](https://github.com/lipanpan-hub/autodlx/blob/v0.0.0/src/commands/instance/start.ts)_

## `adl instance status [INSTANCEUUID]`

获取 AutoDL 实例状态 (如 running / shutdown)

```
USAGE
  $ adl instance status [INSTANCEUUID]

ARGUMENTS
  [INSTANCEUUID]  实例ID (未提供时交互式选择)

DESCRIPTION
  获取 AutoDL 实例状态 (如 running / shutdown)

ALIASES
  $ adl st
  $ adl inst st

EXAMPLES
  $ adl instance status pro-76419909953e

  $ adl instance status
```

_See code: [src/commands/instance/status.ts](https://github.com/lipanpan-hub/autodlx/blob/v0.0.0/src/commands/instance/status.ts)_

## `adl instance stop [INSTANCEUUID]`

关机 AutoDL 实例 (轮询确认关机成功后才返回)

```
USAGE
  $ adl instance stop [INSTANCEUUID]

ARGUMENTS
  [INSTANCEUUID]  实例ID (未提供时交互式选择)

DESCRIPTION
  关机 AutoDL 实例 (轮询确认关机成功后才返回)

ALIASES
  $ adl down
  $ adl inst down

EXAMPLES
  $ adl instance stop pro-76419909953e
```

_See code: [src/commands/instance/stop.ts](https://github.com/lipanpan-hub/autodlx/blob/v0.0.0/src/commands/instance/stop.ts)_

## `adl login [TOKEN]`

保存 AutoDL 开发者 Token 到当前配置档案 (控制台 -> 设置 -> 开发者Token)

```
USAGE
  $ adl login [TOKEN]

ARGUMENTS
  [TOKEN]  AutoDL 开发者 Token, 省略时进入交互式输入(隐藏回显)

DESCRIPTION
  保存 AutoDL 开发者 Token 到当前配置档案 (控制台 -> 设置 -> 开发者Token)

EXAMPLES
  $ adl login your-token

  $ adl login
```

_See code: [src/commands/login.ts](https://github.com/lipanpan-hub/autodlx/blob/v0.0.0/src/commands/login.ts)_

## `adl new`

创建 AutoDL 容器实例 (默认按量计费, 未提供 --gpu-spec/--image 时进入交互式选择)

```
USAGE
  $ adl new [--gpu-spec <value>] [--image <value>] [--gpu-amount <value>] [--system-disk <value>]
    [--cuda-from <value>] [--data-center <value>...] [--name <value>] [--command <value>]

FLAGS
  --command=<value>         开机后执行的命令
  --cuda-from=<value>       [default: 113] CUDA 版本下限, 113 表示 cuda>=11.3
  --data-center=<value>...  [default: ] 候选地区代码, 可多次指定, 如 --data-center westDC3 --data-center beijingDC2,
                            省略时自动选择
  --gpu-amount=<value>      [default: 1] GPU数量, 取值 1-4
  --gpu-spec=<value>        算力规格ID, 如 pro6000-p / 5090-p / v-48g, 缺省时交互式选择
  --image=<value>           镜像UUID, 如 image-xxx 或公共镜像 base-image-xxx, 缺省时交互式选择
  --name=<value>            实例备注名
  --system-disk=<value>     系统盘扩容大小(GB), 取值 0-500

DESCRIPTION
  创建 AutoDL 容器实例 (默认按量计费, 未提供 --gpu-spec/--image 时进入交互式选择)

ALIASES
  $ adl new
  $ adl inst new

EXAMPLES
  $ adl new --gpu-spec pro6000-p --image image-xxxxxxxxx

  $ adl new --gpu-spec 5090-p --image base-image-l2t43iu6uk --gpu-amount 2 --name 训练机

  $ adl new # 缺少必填参数时交互式选择算力规格与镜像
```

## `adl ps`

获取 AutoDL 实例列表

```
USAGE
  $ adl ps [--page <value>] [--size <value>]

FLAGS
  --page=<value>  [default: 1] 页码, 从 1 开始
  --size=<value>  [default: 10] 每页数量

DESCRIPTION
  获取 AutoDL 实例列表

ALIASES
  $ adl ps
  $ adl inst ls

EXAMPLES
  $ adl ps --page 1 --size 20
```

## `adl rm [INSTANCEUUID]`

释放 AutoDL 实例 (不可恢复, 释放前需先关机)

```
USAGE
  $ adl rm [INSTANCEUUID] [--force]

ARGUMENTS
  [INSTANCEUUID]  实例ID (未提供时交互式选择)

FLAGS
  --force  跳过确认直接释放

DESCRIPTION
  释放 AutoDL 实例 (不可恢复, 释放前需先关机)

ALIASES
  $ adl rm
  $ adl inst rm

EXAMPLES
  $ adl rm pro-76419909953e

  $ adl rm pro-76419909953e --force
```

## `adl st [INSTANCEUUID]`

获取 AutoDL 实例状态 (如 running / shutdown)

```
USAGE
  $ adl st [INSTANCEUUID]

ARGUMENTS
  [INSTANCEUUID]  实例ID (未提供时交互式选择)

DESCRIPTION
  获取 AutoDL 实例状态 (如 running / shutdown)

ALIASES
  $ adl st
  $ adl inst st

EXAMPLES
  $ adl st pro-76419909953e

  $ adl st
```

## `adl up INSTANCEUUID`

开机 AutoDL 实例 (有卡模式)

```
USAGE
  $ adl up INSTANCEUUID [--command <value>]

ARGUMENTS
  INSTANCEUUID  实例ID

FLAGS
  --command=<value>  开机后执行的命令, 会覆盖创建时设置的命令

DESCRIPTION
  开机 AutoDL 实例 (有卡模式)

ALIASES
  $ adl up
  $ adl inst up

EXAMPLES
  $ adl up pro-76419909953e

  $ adl up pro-76419909953e --command "python train.py"
```

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

## 开发

```sh
npm install        # 安装依赖
npm run build      # 构建
npm run lint       # 代码检查
npm test           # 运行测试
```

## License

BSL-1.0
