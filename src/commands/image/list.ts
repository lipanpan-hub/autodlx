import {Flags} from '@oclif/core'

import {AutodlCommand, renderTextTable} from '../../lib/autodl/index.js'

export default class AutodlImageList extends AutodlCommand {
  static aliases = ['images', 'img:ls']
  static description = '获取 AutoDL 私有镜像列表'

  static examples = ['<%= config.bin %> <%= command.id %> --page 1 --size 20']

  static flags = {
    page: Flags.integer({default: 1, description: '页码, 从 1 开始'}),
    size: Flags.integer({default: 10, description: '每页数量'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(AutodlImageList)
    const client = this.createAutodlClient()

    const result = await client.listPrivateImages(flags.page, flags.size)

    // 镜像大小 API 返回字节, 统一换算为 GB 展示
    const rows = result.list.map((image) => [
      image.image_uuid,
      image.name,
      image.status,
      (image.image_size / (1024 ** 3)).toFixed(2),
      image.create_at,
    ])
    this.log(renderTextTable(['镜像ID', '名称', '状态', '大小(GB)', '创建时间'], rows))

    this.log(`共 ${result.result_total} 条记录, 第 ${result.page_index}/${result.max_page} 页`)
  }
}
