import {Args} from '@oclif/core'

import {AutodlClient, AutodlCommand} from '../../lib/autodl/index.js'

// 关机确认轮询配置: 每 3 秒查询一次状态, 最多等待 60 秒
const POWER_OFF_POLL_INTERVAL_MS = 3000
const POWER_OFF_TIMEOUT_MS = 60_000

export default class AutodlInstanceStop extends AutodlCommand {
  static aliases = ['down', 'inst:down']
  static description = '关机 AutoDL 实例 (轮询确认关机成功后才返回)'

  static examples = ['<%= config.bin %> <%= command.id %> pro-76419909953e']

  static args = {
    instanceUuid: Args.string({description: '实例ID (未提供时交互式选择)'}),
  }

  public async run(): Promise<void> {
    const {args} = await this.parse(AutodlInstanceStop)
    const client = this.createAutodlClient()

    const instanceUuid = await this.resolveInstanceUuid(args.instanceUuid)
    await client.powerOff(instanceUuid)
    this.log(`实例 ${instanceUuid} 关机指令已发送, 等待关机完成...`)

    await this.waitForPowerOff(client, instanceUuid)
  }

  // 轮询实例状态, 只有确认 shutdown 才算关机成功, 超时则判定任务失败
  private async waitForPowerOff(client: AutodlClient, instanceUuid: string): Promise<void> {
    const isPoweredOff = await this.pollUntil(async () => {
      const instanceStatus = await client.getInstanceStatus(instanceUuid)
      if (instanceStatus !== 'shutdown') {
        this.log(`当前状态: ${instanceStatus}, 继续等待...`)
      }
      return (instanceStatus === 'shutdown')
    }, POWER_OFF_POLL_INTERVAL_MS, POWER_OFF_TIMEOUT_MS)

    if (!isPoweredOff) {
      this.error(`实例 ${instanceUuid} 关机超时 (${POWER_OFF_TIMEOUT_MS / 1000} 秒未进入 shutdown 状态), 请手动检查实例状态`)
    }
    this.log(`实例 ${instanceUuid} 已确认关机成功`)
  }
}
