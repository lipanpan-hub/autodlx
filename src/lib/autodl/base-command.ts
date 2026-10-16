// AutoDL 命令基类(模板方法): 统一实现"读取当前配置档案中的 Token -> 构造 API 客户端"流程,
// 子类只需实现各自的业务逻辑

import {BaseCommand} from '../base-command.js'
import {ToolConfigManager} from '../config/index.js'

import {AutodlClient} from './client.js'

export abstract class AutodlCommand extends BaseCommand {
  // 从当前激活档案读取 AutoDL Token 并构造客户端, 未配置 Token 时直接报错并给出指引
  protected createAutodlClient(): AutodlClient {
    const configManager = ToolConfigManager.fromConfigDir(this.config.configDir)
    configManager.ensureConfig()

    const token = configManager.getCurrentProfile()?.autodlToken
    if (!token) {
      this.error('未配置 AutoDL 开发者 Token, 请先执行: adl login')
    }
    return new AutodlClient(token)
  }

  // 解析实例ID: 已提供时直接使用, 未提供时拉取实例列表交互式选择, 超时未操作则中断流程
  protected async resolveInstanceUuid(instanceUuid?: string): Promise<string> {
    if (instanceUuid) return instanceUuid

    const client = this.createAutodlClient()
    const {list} = await client.listInstances(1, 100)
    if (list.length === 0) this.error('当前账号下没有实例, 请先创建实例')

    return this.selectWithTimeout(
      '请选择实例',
      list.map((item) => ({
        name: `${item.name} (${item.uuid}) [${item.status}]`,
        value: item.uuid,
      })),
      '可通过参数显式指定实例ID',
    )
  }
}
