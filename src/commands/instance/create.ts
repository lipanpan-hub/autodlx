import * as inquirer from '@inquirer/prompts'
import {Flags} from '@oclif/core'

import {AUTODL_GPU_SPEC_CATALOG, AUTODL_PUBLIC_BASE_IMAGE_CATALOG, AutodlCommand} from '../../lib/autodl/index.js'
import type {AutodlClient, PrivateImage} from '../../lib/autodl/index.js'

export default class AutodlInstanceCreate extends AutodlCommand {
  static aliases = ['new', 'inst:new']
  static description = '创建 AutoDL 容器实例 (默认按量计费, 未提供 --gpu-spec/--image 时进入交互式选择)'

  static examples = [
    '<%= config.bin %> <%= command.id %> --gpu-spec pro6000-p --image image-xxxxxxxxx',
    '<%= config.bin %> <%= command.id %> --gpu-spec 5090-p --image base-image-l2t43iu6uk --gpu-amount 2 --name 训练机',
    '<%= config.bin %> <%= command.id %> # 缺少必填参数时交互式选择算力规格与镜像',
  ]

  static flags = {
    'gpu-spec': Flags.string({description: '算力规格ID, 如 pro6000-p / 5090-p / v-48g, 缺省时交互式选择'}),
    image: Flags.string({description: '镜像UUID, 如 image-xxx 或公共镜像 base-image-xxx, 缺省时交互式选择'}),
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

    // #region 补全缺失的必填参数(交互式选择)
    const gpuSpecUuid = flags['gpu-spec'] ?? (await this.promptGpuSpec())
    const imageUuid = flags.image ?? (await this.promptImage(client))
    // #endregion

    const instanceUuid = await client.createInstance({
      data_center_list: flags['data-center'].length > 0 ? flags['data-center'] : undefined,
      req_gpu_amount: flags['gpu-amount'],
      expand_system_disk_by_gb: flags['system-disk'],
      gpu_spec_uuid: gpuSpecUuid,
      image_uuid: imageUuid,
      cuda_v_from: flags['cuda-from'],
      instance_name: flags.name,
      start_command: flags.command,
    })

    this.log(`实例创建成功: ${instanceUuid}`)
  }

  // #region 交互式参数补全

  // 交互式选择算力规格(候选来自官方文档附录的静态目录)
  private async promptGpuSpec(): Promise<string> {
    return inquirer.select({
      message: '选择算力规格',
      pageSize: 10,
      choices: AUTODL_GPU_SPEC_CATALOG.map((specItem) => ({
        name: `${specItem.model} (${specItem.category}, ${specItem.specId})`,
        value: specItem.specId,
      })),
    })
  }

  // 交互式选择镜像: 支持私有镜像/公共基础镜像列表选择, 或手动输入 UUID
  private async promptImage(client: AutodlClient): Promise<string> {
    const imageSource = await inquirer.select({
      message: '选择镜像来源',
      choices: [
        {name: '私有镜像', value: 'private'},
        {name: '公共基础镜像', value: 'public'},
        {name: '手动输入镜像UUID', value: 'manual'},
      ],
    })

    if (imageSource === 'manual') {
      return inquirer.input({message: '输入镜像UUID, 如 image-xxx / base-image-xxx'})
    }

    if (imageSource === 'public') {
      return inquirer.select({
        message: '选择公共基础镜像',
        pageSize: 15,
        choices: AUTODL_PUBLIC_BASE_IMAGE_CATALOG.map((imageItem) => ({
          name: `[${imageItem.framework}] ${imageItem.image} (${imageItem.imageUuid})`,
          value: imageItem.imageUuid,
        })),
      })
    }

    const privateImages = await this.listAllPrivateImages(client)
    if (privateImages.length === 0) {
      throw new Error('账户下没有私有镜像, 请改用公共基础镜像或手动输入镜像UUID')
    }
    return inquirer.select({
      message: '选择私有镜像',
      pageSize: 15,
      // 仅 finished 状态的镜像可用于创建实例, 其余置灰不可选
      choices: privateImages.map((image) => ({
        name: `${image.name} (${(image.image_size / (1024 ** 3)).toFixed(2)}GB, ${image.image_uuid})`,
        value: image.image_uuid,
        disabled: image.status !== 'finished' ? `状态: ${image.status}` : false,
      })),
    })
  }

  // 分页拉取全部私有镜像
  private async listAllPrivateImages(client: AutodlClient): Promise<PrivateImage[]> {
    const allImages: PrivateImage[] = []
    const pageSize = 100
    for (let pageIndex = 1; ; pageIndex++) {
      const pageResult = await client.listPrivateImages(pageIndex, pageSize)
      allImages.push(...pageResult.list)
      const isLastPage = (pageResult.list.length === 0) || (pageIndex >= pageResult.max_page)
      if (isLastPage) break
    }
    return allImages
  }

  // #endregion
}
