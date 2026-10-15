import {Args} from '@oclif/core'

import {AutodlCommand} from '../../lib/autodl/index.js'

export default class AutodlInstanceShow extends AutodlCommand {
  static aliases = ['info', 'inst:info']
  static description = '获取 AutoDL 实例详情(SSH/Jupyter/服务访问地址等)'

  static examples = [
    '<%= config.bin %> <%= command.id %> pro-76419909953e',
    '<%= config.bin %> <%= command.id %>',
  ]

  static args = {
    instanceUuid: Args.string({description: '实例ID (未提供时交互式选择)'}),
  }

  public async run(): Promise<void> {
    const {args} = await this.parse(AutodlInstanceShow)
    const client = this.createAutodlClient()

    const instanceUuid = await this.resolveInstanceUuid(args.instanceUuid)

    const snapshot = await client.getInstanceSnapshot(instanceUuid)

    // #region 基础信息
    this.log(`实例ID: ${instanceUuid}`)
    this.log(`地区: ${snapshot.region_sign}`)
    this.log(`GPU: ${snapshot.snapshot_gpu_alias_name} (${snapshot.chip_corp} / ${snapshot.cpu_arch})`)
    this.log(`按量价格: ${(snapshot.payg_price / 1000).toFixed(3)} 元/小时 (原价 ${(snapshot.origin_pay_price / 1000).toFixed(3)})`)
    // #endregion

    // #region SSH 访问信息
    this.log(`SSH 命令: ${snapshot.ssh_command}`)
    this.log(`SSH 密码: ${snapshot.root_password}`)
    // #endregion

    // #region 常用服务地址
    if (snapshot.jupyter_domain) this.log(`JupyterLab: https://${snapshot.jupyter_domain}/lab?token=${snapshot.jupyter_token}`)
    if (snapshot.service_6006_domain) this.log(`6006 端口服务: ${snapshot.service_6006_port_protocol}://${snapshot.service_6006_domain}`)
    if (snapshot.service_6008_domain) this.log(`6008 端口服务: ${snapshot.service_6008_port_protocol}://${snapshot.service_6008_domain}`)
    // #endregion

    // #region 资源使用情况(字节统一换算为 GB)
    const usage = snapshot.usage_info
    this.log(`CPU 使用率: ${usage.cpu_usage_percent.toFixed(2)}%`)
    this.log(`内存使用: ${((usage.mem_usage / (1024 ** 3)).toFixed(2))} GB / ${((usage.mem_limit / (1024 ** 3)).toFixed(2))} GB (${usage.mem_usage_percent.toFixed(2)}%)`)
    this.log(`系统盘使用: ${((usage.root_fs_used_size / (1024 ** 3)).toFixed(2))} GB / ${((usage.root_fs_total_size / (1024 ** 3)).toFixed(2))} GB`)
    if (usage.valid_at) this.log(`开机时间: ${usage.valid_at}`)
    // #endregion
  }
}
