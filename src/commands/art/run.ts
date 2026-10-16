import {Args, Flags} from '@oclif/core'

import {ArtClient, ArtCommand, buildWorkflowParams, extractResourceUrls} from '../../lib/art/index.js'
import type {ComfyuiTaskSnapshot} from '../../lib/art/index.js'

// 任务状态轮询配置: 每 3 秒查询一次, 默认最长等待 10 分钟
const POLL_INTERVAL_MS = 3000
const DEFAULT_TIMEOUT_SECONDS = 600

export default class ArtWorkflowRun extends ArtCommand {
  static description = '提交 AutoDL.art ComfyUI 工作流任务并等待完成 (可自动下载产物)'

  static examples = [
    '<%= config.bin %> <%= command.id %> minimax_h3_lightx2v_no_pic prompt="一只小猫咪在云端漫步" duration=1 resolution="480p竖"',
    '<%= config.bin %> <%= command.id %> indextts2-v1 prompt_text="你好" prompt_simple="https://example.com/voice.wav"',
    '<%= config.bin %> <%= command.id %> --file params.json --out ./outputs',
  ]

  static flags = {
    file: Flags.string({char: 'f', description: '从 JSON 文件加载工作流参数 (命令行参数将覆盖同名键)'}),
    out: Flags.string({char: 'o', description: '任务成功后下载产物到指定目录'}),
    timeout: Flags.integer({description: '等待任务完成的超时秒数', default: DEFAULT_TIMEOUT_SECONDS}),
  }

  static args = {
    // 受 oclif 限制(variadic 前不允许 optional arg), 工作流ID与参数合并为单个 variadic 接收:
    // params 强制 key=value 格式, 因此不含 = 的 token 必为工作流ID, 运行时按此规则拆分
    inputs: Args.string({
      description: '工作流ID 与 key=value 参数 (首个不含 = 的 token 为工作流ID, 省略时交互选择预置工作流)',
      multiple: true,
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(ArtWorkflowRun)

    // #region 拆分 variadic 输入: 不含 = 的首个 token 为工作流ID, 其余为 key=value 参数
    const inputs = args.inputs ?? []
    const workflowIdArg = inputs.find((token) => !token.includes('='))
    const rawParams = inputs.filter((token) => token.includes('='))
    // #endregion

    const initialParams = buildWorkflowParams(flags.file, rawParams)
    const {workflowId, workflowParams} = await this.resolveWorkflowInvocation(workflowIdArg, initialParams)
    const client = this.createArtClient()
    const submission = await client.submitWorkflowTask(workflowId, workflowParams)
    this.log(`任务已提交: ${submission.task_id} (${submission.workflow})`)

    const snapshot = await this.waitForTaskSuccess(client, submission.task_id, flags.timeout)

    // #region 输出产物 URL, 指定输出目录时立即下载 (URL 有效期短)
    const resourceUrls = extractResourceUrls(snapshot.results)
    if (resourceUrls.length === 0) {
      this.error(`任务成功但未发现产物 URL, 原始结果: ${JSON.stringify(snapshot.results)}`)
    }
    this.log(`生成结果 (${resourceUrls.length} 个资源):`)
    for (const resourceUrl of resourceUrls) {
      this.log(`  ${resourceUrl}`)
    }

    if (flags.out) {
      await this.downloadArtifacts(client, resourceUrls, flags.out, submission.task_id)
    }
    // #endregion
  }

  // 轮询任务状态直至 SUCCESS, FAILED 时报错退出, 超时则提示改用 status 命令续查
  private async waitForTaskSuccess(client: ArtClient, taskId: string, timeoutSeconds: number): Promise<ComfyuiTaskSnapshot> {
    let latestSnapshot: ComfyuiTaskSnapshot | undefined
    const isSucceeded = await this.pollUntil(async () => {
      latestSnapshot = await client.getTaskSnapshot(taskId)
      if (latestSnapshot.status === 'FAILED') {
        this.error(`任务执行失败: ${taskId}\n${JSON.stringify(latestSnapshot, null, 2)}`)
      }
      if (latestSnapshot.status !== 'SUCCESS') {
        this.log(`当前状态: ${latestSnapshot.status}, 已耗时 ${latestSnapshot.duration ?? 0} 秒, 继续等待...`)
      }
      return (latestSnapshot.status === 'SUCCESS')
    }, POLL_INTERVAL_MS, timeoutSeconds * 1000)

    if (!isSucceeded || !latestSnapshot) {
      this.error(`等待任务结果超时 (${timeoutSeconds} 秒), 任务ID: ${taskId}, 可稍后用 adl art status ${taskId} 续查`)
    }
    return latestSnapshot
  }
}
