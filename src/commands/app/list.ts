import {Flags} from '@oclif/core'

import {AppCommand} from '../../lib/app/index.js'
import {renderTextTable} from '../../lib/autodl/index.js'

export default class AutodlAppList extends AppCommand {
  static aliases = ['app:ls']
  static description = '获取 AutoDL.art 应用实例列表'

  static examples = ['<%= config.bin %> <%= command.id %> --page 1 --size 20']

  static flags = {
    page: Flags.integer({default: 1, description: '页码, 从 1 开始'}),
    size: Flags.integer({default: 10, description: '每页数量'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(AutodlAppList)
    const client = this.createAppClient()

    const result = await client.listInstances(flags.page, flags.size)

    const rows = result.list.map((instance) => [
      instance.uuid,
      instance.name,
      instance.cg_application_info?.application_name ?? '-',
      instance.cg_application_info?.current_version ?? '-',
      instance.status,
      instance.region_name,
      String(instance.req_gpu_amount),
      instance.gpu_spec_uuid,
      instance.created_at,
    ])
    this.log(
      renderTextTable(
        ['实例ID', '名称', '应用', '版本', '状态', '地区', 'GPU数', '算力规格', '创建时间'],
        rows,
      ),
    )

    this.log(`共 ${result.result_total} 条记录, 第 ${result.page_index}/${result.max_page} 页`)
  }
}
