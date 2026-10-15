import {Args, Flags} from '@oclif/core'

import {AutodlCommand} from '../../lib/autodl/index.js'

export default class AutodlInstanceStart extends AutodlCommand {
  static aliases = ['up', 'inst:up']
  static description = '开机 AutoDL 实例 (有卡模式)'

  static examples = [
    '<%= config.bin %> <%= command.id %> pro-76419909953e',
    '<%= config.bin %> <%= command.id %> pro-76419909953e --command "python train.py"',
  ]

  static args = {
    instanceUuid: Args.string({description: '实例ID', required: true}),
  }

  static flags = {
    command: Flags.string({description: '开机后执行的命令, 会覆盖创建时设置的命令'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(AutodlInstanceStart)
    const client = this.createAutodlClient()

    await client.powerOn(args.instanceUuid, flags.command)
    this.log(`实例 ${args.instanceUuid} 开机指令已发送, 可用 adl instance status ${args.instanceUuid} 查询状态`)
  }
}
