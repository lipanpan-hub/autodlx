import {Args, Flags} from '@oclif/core'

import {AppCommand} from '../../lib/app/index.js'

export default class AutodlAppStart extends AppCommand {
  static aliases = ['app:up']
  static description = '开机 AutoDL.art 应用实例 (有卡模式)'

  static examples = [
    '<%= config.bin %> <%= command.id %> pro-76419909953e',
    '<%= config.bin %> <%= command.id %> pro-76419909953e --command "sleep 1"',
  ]

  static args = {
    instanceUuid: Args.string({description: '实例ID', required: true}),
  }

  static flags = {
    command: Flags.string({description: '开机后执行的命令, 会覆盖创建时设置的命令'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(AutodlAppStart)
    const client = this.createAppClient()

    await client.powerOn(args.instanceUuid, flags.command)
    this.log(`实例 ${args.instanceUuid} 开机指令已发送, 可用 adl app status ${args.instanceUuid} 查询状态`)
  }
}
