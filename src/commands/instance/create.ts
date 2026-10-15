import {Flags} from '@oclif/core'

import {AutodlCommand} from '../../lib/autodl/index.js'

export default class AutodlInstanceCreate extends AutodlCommand {
  static aliases = ['new', 'inst:new']
  static description = '创建 AutoDL 容器实例 (默认按量计费)'

  static examples = [
    '<%= config.bin %> <%= command.id %> --gpu-spec pro6000-p --image image-xxxxxxxxx',
    '<%= config.bin %> <%= command.id %> --gpu-spec 5090-p --image base-image-l2t43iu6uk --gpu-amount 2 --name 训练机',
  ]

  static flags = {
    'gpu-spec': Flags.string({required: true, description: '算力规格ID, 如 pro6000-p / 5090-p / v-48g'}),
    image: Flags.string({required: true, description: '镜像UUID, 如 image-xxx 或公共镜像 base-image-xxx'}),
    'gpu-amount': Flags.integer({default: 1, description: 'GPU数量, 取值 1-4'}),
    'system-disk': Flags.integer({default: 0, description: '系统盘扩容大小(GB), 取值 0-500'}),
    'cuda-from': Flags.integer({default: 113, description: 'CUDA 版本下限, 113 表示 cuda>=11.3'}),
    'data-center': Flags.string({multiple: true, default: [], description: '候选地区代码, 可多次指定, 如 --data-center westDC3 --data-center beijingDC2, 省略时自动选择'}),
    name: Flags.string({description: '实例备注名'}),
    command: Flags.string({description: '开机后执行的命令'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(AutodlInstanceCreate)
    const client = this.createAutodlClient()

    const instanceUuid = await client.createInstance({
      data_center_list: flags['data-center'].length > 0 ? flags['data-center'] : undefined,
      req_gpu_amount: flags['gpu-amount'],
      expand_system_disk_by_gb: flags['system-disk'],
      gpu_spec_uuid: flags['gpu-spec'],
      image_uuid: flags.image,
      cuda_v_from: flags['cuda-from'],
      instance_name: flags.name,
      start_command: flags.command,
    })

    this.log(`实例创建成功: ${instanceUuid}`)
  }
}
