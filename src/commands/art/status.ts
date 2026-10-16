import {Args} from '@oclif/core'

import {ArtCommand, extractResourceUrls} from '../../lib/art/index.js'
import type {ComfyuiTaskSnapshot} from '../../lib/art/index.js'

export default class ArtTaskStatus extends ArtCommand {
  static description = '查询 AutoDL.art ComfyUI 任务状态与结果'

  static examples = ['<%= config.bin %> <%= command.id %> 2a25da1d-39ad-495c-8dac-bae8e8f6b1a1']

  static args = {
    taskId: Args.string({description: '任务ID (提交任务时返回)', required: true}),
  }

  public async run(): Promise<void> {
    const {args} = await this.parse(ArtTaskStatus)
    const client = this.createArtClient()

    const snapshot = await client.getTaskSnapshot(args.taskId)
    this.printTaskSnapshot(snapshot)
  }

  // 打印任务快照: 状态/耗时 + 成功时的产物 URL, 失败时输出完整快照便于排查
  private printTaskSnapshot(snapshot: ComfyuiTaskSnapshot): void {
    this.log(`任务 ${snapshot.task_id} 状态: ${snapshot.status}`)
    if (snapshot.duration !== undefined) {
      this.log(`已耗时: ${snapshot.duration} 秒`)
    }

    const resourceUrls = extractResourceUrls(snapshot.results)
    if (resourceUrls.length === 0) {
      if (snapshot.status === 'FAILED') {
        this.log(`失败详情: ${JSON.stringify(snapshot, null, 2)}`)
      }
      return
    }

    this.log(`生成结果 (${resourceUrls.length} 个资源):`)
    for (const resourceUrl of resourceUrls) {
      this.log(`  ${resourceUrl}`)
    }
  }
}
