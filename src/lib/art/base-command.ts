// AutoDL.art 命令基类(模板方法): 统一实现"读取当前配置档案中的 ComfyUI API Key -> 构造 API 客户端"流程,
// 子类只需实现各自的业务逻辑

import {mkdir} from 'node:fs/promises'

import {BaseCommand} from '../base-command.js'
import {ToolConfigManager} from '../config/index.js'

import {ArtClient} from './client.js'
import {resolveSavePaths} from './download.js'
import {parseScalarValue} from './params.js'
import {PRESET_WORKFLOWS, type PresetWorkflow, type PresetWorkflowParam} from './workflows.js'

export abstract class ArtCommand extends BaseCommand {
  // 从当前激活档案读取 ComfyUI API Key 并构造客户端, 未配置时直接报错并给出指引
  protected createArtClient(): ArtClient {
    const configManager = ToolConfigManager.fromConfigDir(this.config.configDir)
    configManager.ensureConfig()

    const apiKey = configManager.getCurrentProfile()?.comfyuiApiKey
    if (!apiKey) {
      this.error('未配置 ComfyUI API Key, 请先执行: adl art cfset')
    }
    return new ArtClient(apiKey)
  }

  // 解析工作流调用信息: 工作流ID已提供且不在注册表时直接使用 (无参数元数据, 保持纯命令行模式);
  // 命中注册表(或未提供走交互选择)时, 逐项交互填写缺失的工作流参数后一并返回
  protected async resolveWorkflowInvocation(
    workflowIdArg: string | undefined,
    initialParams: Record<string, unknown>,
  ): Promise<{workflowId: string; workflowParams: Record<string, unknown>}> {
    // #region 确定工作流: 显式指定优先(命中注册表时也支持补填缺失参数), 未指定则从预置清单交互选择
    let presetWorkflow: PresetWorkflow | undefined
    if (workflowIdArg) {
      presetWorkflow = PRESET_WORKFLOWS.find((workflow) => workflow.id === workflowIdArg)
      if (!presetWorkflow) {
        return {workflowId: workflowIdArg, workflowParams: initialParams}
      }
    } else {
      presetWorkflow = await this.selectWithTimeout(
        '请选择工作流',
        PRESET_WORKFLOWS.map((workflow) => ({
          name: `${workflow.name} (${workflow.id})`,
          value: workflow,
        })),
        '可通过参数显式指定工作流ID',
      )
    }
    // #endregion

    this.log(`已选择工作流: ${presetWorkflow.name} (${presetWorkflow.id})`)
    const workflowParams = await this.fillMissingWorkflowParams(presetWorkflow, initialParams)
    return {workflowId: presetWorkflow.id, workflowParams}
  }

  // 逐项交互填写缺失参数: 命令行/--file 已提供的跳过; 必填参数空输入时重试, 可选参数回车跳过
  private async fillMissingWorkflowParams(workflow: PresetWorkflow, initialParams: Record<string, unknown>): Promise<Record<string, unknown>> {
    // #region 过滤出需要交互填写的参数
    const missingParams = workflow.params.filter((param) => !(param.name in initialParams))
    if (missingParams.length === 0) return initialParams
    // #endregion

    const workflowParams = {...initialParams}
    for (const param of missingParams) {
      const filledValue = await this.fillSingleWorkflowParam(param)
      if (filledValue !== undefined) workflowParams[param.name] = filledValue
    }
    return workflowParams
  }

  // 交互填写单个参数: example 作为默认值(直接回车即采用); 返回 undefined 代表可选参数被跳过; 值统一经 parseScalarValue 解析(数字/布尔/文本)
  private async fillSingleWorkflowParam(param: PresetWorkflowParam): Promise<unknown> {
    const requirementMark = param.isRequired ? '[必填]' : '[可选, 回车跳过]'
    const defaultText = param.example ? `, 默认: ${param.example}` : ''
    for (;;) {
      const rawValue = await this.inputWithTimeout(
        `${requirementMark} ${param.name} - ${param.description}${defaultText}:`,
        '可通过 key=value 参数显式指定工作流参数',
        param.example,
      )
      const trimmedValue = rawValue.trim()
      if (trimmedValue) return parseScalarValue(trimmedValue)
      if (!param.isRequired) return undefined
      this.log('该参数为必填, 请输入值')
    }
  }

  // 下载任务产物到本地目录 (产物 URL 有效期短, 获取后立即保存)
  protected async downloadArtifacts(client: ArtClient, resourceUrls: string[], outputDir: string, taskId: string): Promise<void> {
    await mkdir(outputDir, {recursive: true})
    const savePaths = resolveSavePaths(resourceUrls, outputDir, taskId)
    for (const [index, resourceUrl] of resourceUrls.entries()) {
      const savePath = savePaths[index]
      await client.downloadFile(resourceUrl, savePath)
      this.log(`已下载: ${savePath}`)
    }
  }
}
