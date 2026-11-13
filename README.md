# autodlx

AutoDL 容器云的命令行管理工具。在终端里完成实例的创建、开关机、释放、保存镜像等日常操作，还能调用 AutoDL.art 提交 ComfyUI 工作流任务（文生视频、语音合成等）并自动下载产物，支持多配置档案切换与交互式参数补全。

## 特性

- **实例全生命周期管理**：创建、开机、关机、释放、状态与详情查询，异步操作轮询确认最终生效
- **应用实例管理**：管理 AutoDL.art 网页应用（如 ComfyUI）实例的创建、开关机与释放
- **AI 生成任务**：一条命令提交 ComfyUI 工作流任务，等待完成后自动下载产物（URL 有效期短，避免过期）
- **预置工作流**：内置常用工作流参数清单（如 indextts2 语音合成、H3 文生视频），缺省参数时逐项交互补全
- **镜像管理**：查看私有镜像列表，将实例保存为私有镜像
- **交互式体验**：实例 ID、算力规格、镜像等参数缺省时自动进入交互式选择，支持模糊搜索
- **多配置档案**：YAML 多档案管理 Token 与 API Key，支持一键切换与内置 TUI / 外部编辑器编辑
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

7. 提交 AI 生成任务并自动下载产物 (以文生视频为例, 缺省工作流ID时交互选择预置工作流)

```sh
adl art run minimax_h3_lightx2v_no_pic prompt="一只小猫咪在云端漫步" --out ./outputs
```

## 配置

Token 保存在多档案 YAML 配置文件中，执行 `adl config show` 可查看配置文件路径与当前内容：

```yaml
current: default
profiles:
  - name: default
    autodlToken: <your-token>
    comfyuiApiKey: <your-comfyui-api-key>
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

AutoDL.art 相关命令使用独立的凭据：实例操作用 `autodlToken`，ComfyUI 工作流任务用 `comfyuiApiKey` (在 AutoDL.art 控制台获取)：

```sh
# 保存 ComfyUI API Key 到当前配置档案 (省略参数时交互式输入)
adl art cfset <your-api-key>
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
- `adl art cfset [apiKey]` — 保存 ComfyUI API Key 到当前配置档案
- `adl art submit [工作流ID key=value...]` — 提交工作流任务, 仅返回任务ID
- `adl art run [工作流ID key=value...]` — 提交任务并等待完成, `--out` 可自动下载产物
- `adl art status <taskId>` — 查询任务状态与结果
- `adl art download <taskId>` — 下载已完成任务的产物 (`--out` 指定目录)
- `adl app create` / `adl app new` — 创建应用实例 (如 ComfyUI)
- `adl app start <id>` / `adl app up` — 应用实例开机
- `adl app stop [id]` / `adl app down` — 应用实例关机
- `adl app release [id]` / `adl app rm` — 释放应用实例 (未关机时自动先关机)
- `adl app list` / `adl app ls` — 应用实例列表
- `adl app show [id]` — 应用实例详情 (访问地址等)
- `adl config show` / `adl config switch` / `adl config edit` — 配置管理

<!-- usage -->
```sh-session
$ npm install -g @lppx/autodlx
$ adl COMMAND
running command...
$ adl (--version)
@lppx/autodlx/1.0.0 linux-x64 node-v24.22.2
$ adl --help [COMMAND]
USAGE
  $ adl COMMAND
...
```
<!-- usagestop -->
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

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v4.0.6/src/commands/autocomplete/index.ts)_

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

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/3.0.7/src/commands/version.ts)_
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
