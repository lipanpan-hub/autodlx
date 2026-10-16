import {Args} from '@oclif/core'

import {AppCommand} from '../../lib/app/index.js'

export default class AutodlAppStatus extends AppCommand {
  static aliases = ['app:st']
  static description = '获取 AutoDL.art 应用实例状态 (如 running / shutdown)'

  static examples = [
    '<%= config.bin %> <%= command.id %> pro-76419909953e',
    '<%= config.bin %> <%= command.id %>',
  ]

  static args = {
    instanceUuid: Args.string({description: '实例ID (未提供时交互式选择)'}),
  }

  public async run(): Promise<void> {
    const {args} = await this.parse(AutodlAppStatus)
    const client = this.createAppClient()

    const instanceUuid = await this.resolveInstanceUuid(args.instanceUuid)
    const status = await client.getInstanceStatus(instanceUuid)
    this.log(status)
  }
}
