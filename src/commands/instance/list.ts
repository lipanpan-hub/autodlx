import {Flags} from '@oclif/core'

import {AutodlCommand, renderTextTable} from '../../lib/autodl/index.js'

export default class AutodlInstanceList extends AutodlCommand {
  static aliases = ['ps', 'inst:ls']
  static description = '获取 AutoDL 实例列表'

  static examples = ['<%= config.bin %> <%= command.id %> --page 1 --size 20']

  static flags = {
    page: Flags.integer({default: 1, description: '页码, 从 1 开始'}),
    size: Flags.integer({default: 10, description: '每页数量'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(AutodlInstanceList)
    const client = this.createAutodlClient()

    const result = await client.listInstances(flags.page, flags.size)

    const rows = result.list.map((instance) => [
      instance.uuid,
      instance.name,
      instance.status,
      instance.region_name,
      String(instance.req_gpu_amount),
      instance.gpu_spec_uuid,
      instance.charge_type,
      instance.created_at,
    ])
    this.log(
      renderTextTable(
        ['实例ID', '名称', '状态', '地区', 'GPU数', '算力规格', '计费方式', '创建时间'],
        rows,
      ),
    )

    this.log(`共 ${result.result_total} 条记录, 第 ${result.page_index}/${result.max_page} 页`)
  }
}
