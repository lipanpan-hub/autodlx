import path from 'node:path'

import {Args, Flags} from '@oclif/core'

import {ArtCommand, extractResourceUrls} from '../../lib/art/index.js'

export default class ArtTaskDownload extends ArtCommand {
  static description = '下载已完成的 AutoDL.art ComfyUI 任务产物 (产物 URL 有效期短, 请尽快保存)'

  static examples = [
    '<%= config.bin %> <%= command.id %> 2a25da1d-39ad-495c-8dac-bae8e8f6b1a1',
    '<%= config.bin %> <%= command.id %> <task_id> --out ./outputs',
  ]

  static flags = {
    out: Flags.string({char: 'o', description: '下载目录', default: '.'}),
  }

  static args = {
    taskId: Args.string({description: '任务ID (提交任务时返回)', required: true}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(ArtTaskDownload)
    const client = this.createArtClient()

    const snapshot = await client.getTaskSnapshot(args.taskId)
    if (snapshot.status !== 'SUCCESS') {
      this.error(`任务尚未成功 (当前状态: ${snapshot.status}), 请稍后再试`)
    }

    const resourceUrls = extractResourceUrls(snapshot.results)
    if (resourceUrls.length === 0) {
      this.error(`任务成功但未发现可下载的资源, 原始结果: ${JSON.stringify(snapshot.results)}`)
    }

    await this.downloadArtifacts(client, resourceUrls, flags.out, args.taskId)
    this.log(`共下载 ${resourceUrls.length} 个文件到 ${path.resolve(flags.out)}`)
  }
}
