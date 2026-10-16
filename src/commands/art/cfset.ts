import * as inquirer from '@inquirer/prompts'
import {Args} from '@oclif/core'

import {BaseCommand} from '../../lib/base-command.js'
import {ToolConfigManager} from '../../lib/config/index.js'

export default class ArtConfigSet extends BaseCommand {
  static description = '保存 AutoDL.art 的 ComfyUI API Key 到当前配置档案'

  static examples = [
    '<%= config.bin %> <%= command.id %> your-api-key',
    '<%= config.bin %> <%= command.id %>',
  ]

  static args = {
    apiKey: Args.string({description: 'ComfyUI API Key, 省略时进入交互式输入(隐藏回显)'}),
  }

  public async run(): Promise<void> {
    const {args} = await this.parse(ArtConfigSet)
    const configManager = ToolConfigManager.fromConfigDir(this.config.configDir)
    configManager.ensureConfig()

    // #region 获取 API Key: 参数直填, 缺省时交互输入
    let apiKey = args.apiKey
    if (!apiKey) {
      apiKey = await inquirer.password({message: '请输入 ComfyUI API Key:'})
    }

    const trimmedApiKey = apiKey.trim()
    if (!trimmedApiKey) {
      this.error('API Key 不能为空')
    }
    // #endregion

    configManager.updateCurrentProfile({comfyuiApiKey: trimmedApiKey})
    const profileName = configManager.getCurrentProfile()?.name ?? ''
    this.log(`已保存 ComfyUI API Key 到当前配置档案 "${profileName}"`)
  }
}
