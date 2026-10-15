import {AutodlCommand} from '../lib/autodl/index.js'

export default class AutodlBalance extends AutodlCommand {
  static aliases = ['bal']
  static description = '查询 AutoDL 账户余额'

  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const client = this.createAutodlClient()
    const balance = await client.getBalance()

    // API 金额单位为"毫", 除以 1000 换算为元
    this.log(`当前余额: ${(balance.assets / 1000).toFixed(2)} 元`)
    this.log(`代金券余额: ${(balance.voucher_balance / 1000).toFixed(2)} 元`)
    this.log(`累计消费: ${(balance.accumulate / 1000).toFixed(2)} 元`)
  }
}
