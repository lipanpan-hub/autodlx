import * as inquirer from '@inquirer/prompts'
import {Args, Flags} from '@oclif/core'

import {AutodlCommand} from '../../lib/autodl/index.js'

export default class AutodlInstanceRelease extends AutodlCommand {
  static aliases = ['rm', 'inst:rm']
  static description = '释放 AutoDL 实例 (不可恢复, 释放前需先关机)'

  static examples = [
    '<%= config.bin %> <%= command.id %> pro-76419909953e',
    '<%= config.bin %> <%= command.id %> pro-76419909953e --force',
  ]

  static args = {
    instanceUuid: Args.string({description: '实例ID', required: true}),
  }

  static flags = {
    force: Flags.boolean({default: false, description: '跳过确认直接释放'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(AutodlInstanceRelease)

    // #region 危险操作确认
    if (!flags.force) {
      const isConfirmed = await inquirer.confirm({
        message: `确定要释放实例 ${args.instanceUuid} 吗? 释放后数据不可恢复`,
        default: false,
      })
      if (!isConfirmed) {
        this.log('已取消释放')
        return
      }
    }
    // #endregion

    const client = this.createAutodlClient()
    await client.releaseInstance(args.instanceUuid)
    this.log(`实例 ${args.instanceUuid} 释放指令已发送`)
  }
}
