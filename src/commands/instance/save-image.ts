import {Args} from '@oclif/core'

import {AutodlCommand} from '../../lib/autodl/index.js'

export default class AutodlInstanceSaveImage extends AutodlCommand {
  static aliases = ['commit', 'inst:save']
  static description = '将 AutoDL 实例保存为私有镜像'

  static examples = ['<%= config.bin %> <%= command.id %> pro-76419909953e my-image']

  static args = {
    instanceUuid: Args.string({description: '实例ID', required: true}),
    imageName: Args.string({description: '镜像名称', required: true}),
  }

  public async run(): Promise<void> {
    const {args} = await this.parse(AutodlInstanceSaveImage)
    const client = this.createAutodlClient()

    const result = await client.saveImage(args.instanceUuid, args.imageName)
    this.log(`镜像保存任务已提交: ${result.image_uuid}, 可用 adl image list 确认保存状态`)
  }
}
