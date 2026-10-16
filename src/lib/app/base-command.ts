// AutoDL.art 应用实例命令基类(模板方法): 统一实现"读取当前配置档案中的 AutoDL Token -> 构造 API 客户端"
// 与"参数缺失 -> 拉取实例列表 -> 交互选择"流程, 子类只需实现各自的业务逻辑
// 文档: https://www.autodl.art/docs/app_api/

import {BaseCommand} from '../base-command.js'
import {ToolConfigManager} from '../config/index.js'

import {AppClient} from './client.js'

export abstract class AppCommand extends BaseCommand {
  // 从当前激活档案读取 AutoDL 开发者 Token 并构造客户端, 未配置 Token 时直接报错并给出指引
  protected createAppClient(): AppClient {
    const configManager = ToolConfigManager.fromConfigDir(this.config.configDir)
    configManager.ensureConfig()

    const token = configManager.getCurrentProfile()?.autodlToken
    if (!token) {
      this.error('未配置 AutoDL 开发者 Token, 请先执行: adl login')
    }
    return new AppClient(token)
  }

  // 解析实例ID: 已提供时直接使用, 未提供时拉取应用实例列表交互式选择, 超时未操作则中断流程
  protected async resolveInstanceUuid(instanceUuid?: string): Promise<string> {
    if (instanceUuid) return instanceUuid

    const client = this.createAppClient()
    const {list} = await client.listInstances(1, 100)
    if (list.length === 0) this.error('当前账号下没有应用实例, 请先执行: adl app create')

    return this.selectWithTimeout(
      '请选择应用实例',
      list.map((item) => ({
        name: `${item.name} (${item.uuid}) [${item.status}]`,
        value: item.uuid,
      })),
      '可通过参数显式指定实例ID',
    )
  }

  // 轮询实例状态, 只有确认 shutdown 才算关机成功, 超时则报错退出
  protected async waitUntilPoweredOff(client: AppClient, instanceUuid: string, intervalMs: number, timeoutMs: number): Promise<void> {
    const isPoweredOff = await this.pollUntil(async () => {
      const instanceStatus = await client.getInstanceStatus(instanceUuid)
      if (instanceStatus !== 'shutdown') {
        this.log(`当前状态: ${instanceStatus}, 继续等待...`)
      }
      return (instanceStatus === 'shutdown')
    }, intervalMs, timeoutMs)

    if (!isPoweredOff) {
      this.error(`实例 ${instanceUuid} 关机超时 (${timeoutMs / 1000} 秒未进入 shutdown 状态), 请手动检查实例状态`)
    }
    this.log(`实例 ${instanceUuid} 已确认关机成功`)
  }
}
