import {Args, Flags} from '@oclif/core'

import {ArtCommand, buildWorkflowParams} from '../../lib/art/index.js'

export default class ArtWorkflowSubmit extends ArtCommand {
  static description = '提交 AutoDL.art ComfyUI 工作流任务 (仅返回任务ID, 不等待完成)'

  static examples = [
    '<%= config.bin %> <%= command.id %> minimax_h3_lightx2v_no_pic prompt="一只小猫咪在云端漫步"',
    '<%= config.bin %> <%= command.id %> <workflow_id> --file params.json',
  ]

  static flags = {
    file: Flags.string({char: 'f', description: '从 JSON 文件加载工作流参数 (命令行参数将覆盖同名键)'}),
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
    const {args, flags} = await this.parse(ArtWorkflowSubmit)

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
    this.log(`查询进度: adl art status ${submission.task_id}`)
  }
}
