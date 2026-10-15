import * as inquirer from '@inquirer/prompts'
import {Args} from '@oclif/core'

import {BaseCommand} from '../lib/base-command.js'
import {ToolConfigManager} from '../lib/config/index.js'

export default class AutodlLogin extends BaseCommand {
  static description = '保存 AutoDL 开发者 Token 到当前配置档案 (控制台 -> 设置 -> 开发者Token)'

  static examples = [
    '<%= config.bin %> <%= command.id %> your-token',
    '<%= config.bin %> <%= command.id %>',
  ]

  static args = {
    token: Args.string({description: 'AutoDL 开发者 Token, 省略时进入交互式输入(隐藏回显)'}),
  }

  public async run(): Promise<void> {
    const {args} = await this.parse(AutodlLogin)
    const configManager = ToolConfigManager.fromConfigDir(this.config.configDir)
    configManager.ensureConfig()

    // #region 获取 Token: 参数直填, 缺省时交互输入
    let token = args.token
    if (!token) {
      token = await inquirer.password({message: '请输入 AutoDL 开发者 Token:'})
    }

    const trimmedToken = token.trim()
    if (!trimmedToken) {
      this.error('Token 不能为空')
    }
    // #endregion

    configManager.updateCurrentProfile({autodlToken: trimmedToken})
    const profileName = configManager.getCurrentProfile()?.name ?? ''
    this.log(`已保存 AutoDL Token 到当前配置档案 "${profileName}"`)
  }
}
