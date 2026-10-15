import {Args} from '@oclif/core'

import {AutodlCommand} from '../../lib/autodl/index.js'

export default class AutodlInstanceStop extends AutodlCommand {
  static aliases = ['down', 'inst:down']
  static description = '关机 AutoDL 实例'

  static examples = ['<%= config.bin %> <%= command.id %> pro-76419909953e']

  static args = {
    instanceUuid: Args.string({description: '实例ID', required: true}),
  }

  public async run(): Promise<void> {
    const {args} = await this.parse(AutodlInstanceStop)
    const client = this.createAutodlClient()

    await client.powerOff(args.instanceUuid)
    this.log(`实例 ${args.instanceUuid} 关机指令已发送`)
  }
}
