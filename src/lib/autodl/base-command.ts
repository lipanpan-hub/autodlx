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
}
