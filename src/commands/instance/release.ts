import * as inquirer from '@inquirer/prompts'
import {Args, Flags} from '@oclif/core'

import {AutodlClient, AutodlCommand} from '../../lib/autodl/index.js'

// 释放确认轮询配置: 每 3 秒拉取一次实例列表, 最多等待 60 秒
const RELEASE_POLL_INTERVAL_MS = 3000
const RELEASE_TIMEOUT_MS = 60_000

export default class AutodlInstanceRelease extends AutodlCommand {
  static aliases = ['rm', 'inst:rm']
  static description = '释放 AutoDL 实例 (不可恢复, 释放前需先关机)'

  static examples = [
    '<%= config.bin %> <%= command.id %> pro-76419909953e',
    '<%= config.bin %> <%= command.id %> pro-76419909953e --force',
  ]

  static args = {
    instanceUuid: Args.string({description: '实例ID (未提供时交互式选择)'}),
  }

  static flags = {
    force: Flags.boolean({default: false, description: '跳过确认直接释放'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(AutodlInstanceRelease)
    const client = this.createAutodlClient()

    const instanceUuid = await this.resolveInstanceUuid(args.instanceUuid)

    // #region 危险操作确认
    if (!flags.force) {
      const isConfirmed = await inquirer.confirm({
        message: `确定要释放实例 ${instanceUuid} 吗? 释放后数据不可恢复`,
        default: false,
      })
      if (!isConfirmed) {
        this.log('已取消释放')
        return
      }
    }
    // #endregion

    await client.releaseInstance(instanceUuid)
    this.log(`实例 ${instanceUuid} 释放指令已发送, 等待释放完成...`)

    await this.waitForRelease(client, instanceUuid)
  }

  // 轮询实例列表, 只有实例从列表中消失才算释放成功, 超时则判定任务失败
  private async waitForRelease(client: AutodlClient, instanceUuid: string): Promise<void> {
    const isReleased = await this.pollUntil(async () => {
      const {list} = await client.listInstances(1, 100)
      const isInstanceGone = !list.some((item) => (item.uuid === instanceUuid))
      if (!isInstanceGone) {
        this.log('实例仍在实例列表中, 继续等待...')
      }
      return isInstanceGone
    }, RELEASE_POLL_INTERVAL_MS, RELEASE_TIMEOUT_MS)

    if (!isReleased) {
      this.error(`实例 ${instanceUuid} 释放超时 (${RELEASE_TIMEOUT_MS / 1000} 秒后仍存在于实例列表), 请手动检查实例状态`)
    }
    this.log(`实例 ${instanceUuid} 已确认释放成功`)
  }
}
