import {Args} from '@oclif/core'

import {AutodlCommand} from '../../lib/autodl/index.js'

export default class AutodlInstanceStatus extends AutodlCommand {
  static aliases = ['st', 'inst:st']
  static description = '获取 AutoDL 实例状态 (如 running / shutdown)'

  static examples = [
    '<%= config.bin %> <%= command.id %> pro-76419909953e',
    '<%= config.bin %> <%= command.id %>',
  ]

  static args = {
    instanceUuid: Args.string({description: '实例ID (未提供时交互式选择)'}),
  }

  public async run(): Promise<void> {
    const {args} = await this.parse(AutodlInstanceStatus)
    const client = this.createAutodlClient()

    const instanceUuid = await this.resolveInstanceUuid(args.instanceUuid)
    const status = await client.getInstanceStatus(instanceUuid)
    this.log(status)
  }
}
