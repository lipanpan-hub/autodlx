import {Args} from '@oclif/core'

import {AppCommand} from '../../lib/app/index.js'

// 关机确认轮询配置: 每 3 秒查询一次状态, 最多等待 60 秒
const POWER_OFF_POLL_INTERVAL_MS = 3000
const POWER_OFF_TIMEOUT_MS = 60_000

export default class AutodlAppStop extends AppCommand {
  static aliases = ['app:down']
  static description = '关机 AutoDL.art 应用实例 (轮询确认关机成功后才返回)'

  static examples = ['<%= config.bin %> <%= command.id %> pro-76419909953e']

  static args = {
    instanceUuid: Args.string({description: '实例ID (未提供时交互式选择)'}),
  }

  public async run(): Promise<void> {
    const {args} = await this.parse(AutodlAppStop)
    const client = this.createAppClient()

    const instanceUuid = await this.resolveInstanceUuid(args.instanceUuid)
    await client.powerOff(instanceUuid)
    this.log(`实例 ${instanceUuid} 关机指令已发送, 等待关机完成...`)

    await this.waitUntilPoweredOff(client, instanceUuid, POWER_OFF_POLL_INTERVAL_MS, POWER_OFF_TIMEOUT_MS)
  }
}
