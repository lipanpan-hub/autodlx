import {Flags} from '@oclif/core'

import {AUTODL_GPU_SPEC_CATALOG} from '../../lib/autodl/index.js'
import {AppCommand} from '../../lib/app/index.js'

export default class AutodlAppCreate extends AppCommand {
  static aliases = ['app:new']
  static description = '创建 AutoDL.art 应用实例 (默认按量计费, 未提供 --gpu-spec/--app 时进入交互式补全)'

  static examples = [
    '<%= config.bin %> <%= command.id %> --gpu-spec pro6000-p --app J1c7lsvbq5',
    '<%= config.bin %> <%= command.id %> --gpu-spec 5090-p --app J1c7lsvbq5 --version v2 --gpu-amount 2 --name ComfyUI机',
    '<%= config.bin %> <%= command.id %> # 缺少必填参数时交互式选择算力规格并输入应用UUID',
  ]

  static flags = {
    'gpu-spec': Flags.string({description: '算力规格ID, 如 pro6000-p / 5090-p / v-48g, 缺省时交互式选择'}),
    app: Flags.string({description: '网页应用的UUID, 在网页应用详情页查看, 缺省时交互式输入'}),
    version: Flags.string({default: 'latest', description: '应用版本, latest 表示自动使用最新版本'}),
    'gpu-amount': Flags.integer({default: 1, description: 'GPU数量, 取值 1-4'}),
    'system-disk': Flags.integer({default: 0, description: '系统盘扩容大小(GB), 取值 0-500'}),
    'data-center': Flags.string({multiple: true, default: [], description: '候选地区代码, 可多次指定, 如 --data-center westDC3 --data-center beijingDC2, 省略时自动选择'}),
    name: Flags.string({description: '实例备注名'}),
    command: Flags.string({description: '开机后执行的命令'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(AutodlAppCreate)
    const client = this.createAppClient()

    // #region 补全缺失的必填参数(交互式)
    const gpuSpecUuid = flags['gpu-spec'] ?? (await this.promptGpuSpec())
    const applicationUuid = flags.app ?? (await this.inputWithTimeout('请输入网页应用的UUID (在网页应用详情页查看):', '可通过 --app 参数显式指定应用UUID'))
    // #endregion

    const instanceUuid = await client.createInstance({
      data_center_list: flags['data-center'].length > 0 ? flags['data-center'] : undefined,
      req_gpu_amount: flags['gpu-amount'],
      expand_system_disk_by_gb: flags['system-disk'],
      gpu_spec_uuid: gpuSpecUuid,
      application_uuid: applicationUuid,
      application_version: flags.version,
      instance_name: flags.name,
      start_command: flags.command,
    })

    this.log(`应用实例创建成功: ${instanceUuid}`)
    this.log(`可用 adl app show ${instanceUuid} 查看访问地址, 实例就绪前请耐心等待`)
  }

  // 交互式选择算力规格(候选来自官方文档附录的静态目录), 超时未操作则中断
  private async promptGpuSpec(): Promise<string> {
    return this.selectWithTimeout(
      '选择算力规格',
      AUTODL_GPU_SPEC_CATALOG.map((specItem) => ({
        name: `${specItem.model} (${specItem.category}, ${specItem.specId})`,
        value: specItem.specId,
      })),
      '可通过 --gpu-spec 参数显式指定算力规格',
    )
  }
}
