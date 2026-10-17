import {existsSync, readFileSync} from 'node:fs'
import {mkdir, readdir} from 'node:fs/promises'
import path from 'node:path'

import {Args, Flags} from '@oclif/core'

import {ArtCommand, buildWorkflowParams, extractResourceUrls, parseVttCues} from '../../lib/art/index.js'
import type {ComfyuiTaskSnapshot, VttCue} from '../../lib/art/index.js'

// indextts2 工作流ID (预置注册表中的文本转语音工作流)
const INDEXTTS2_WORKFLOW_ID = 'indextts2-v1'

// 默认参考音频 (预览音色, 与预置注册表中 indextts2 的 prompt_simple 示例一致)
const DEFAULT_REFERENCE_AUDIO = 'http://lipanpan.oss-cn-shenzhen.aliyuncs.com/voice-preview.wav'

// 本地参考音频扩展名与 MIME 类型映射 (转 base64 data URI 时使用)
const AUDIO_MIME_TYPES: Record<string, string> = {
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.flac': 'audio/flac',
  '.m4a': 'audio/mp4',
  '.ogg': 'audio/ogg',
}

// 输出文件名序号的补零位数
const FILE_INDEX_PAD_WIDTH = 3

// 单条配音结果: 成功时携带音频 URL, 失败时携带错误信息
interface TtsCueResult {
  audioUrl?: string
  errorMessage?: string
  vttCue: VttCue
}

export default class ArtTts extends ArtCommand {
  static description = '批量调用 indextts2 工作流为 VTT 字幕生成配音 (全部并发提交, 统一等待完成后下载到输出目录)'

  static examples = [
    '<%= config.bin %> <%= command.id %> ./subtitle.vtt --ref https://example.com/voice.wav',
    '<%= config.bin %> <%= command.id %> ./subtitle.vtt --ref ./voice.wav -o ./tts-output',
    '<%= config.bin %> <%= command.id %> ./subtitle.vtt --ref ./voice.wav emo_happy=0.8',
  ]

  static flags = {
    ref: Flags.string({char: 'r', description: '参考音频: URL 或本地文件路径 (整批共用同一音色)', default: DEFAULT_REFERENCE_AUDIO}),
    out: Flags.string({char: 'o', description: '配音输出目录', default: './tts-output'}),
    emo: Flags.string({description: '情绪控制方法 (emo_control_method)', default: '与音色参考音频相同'}),
    timeout: Flags.integer({description: '等待全部任务完成的超时秒数', default: 600}),
  }

  static args = {
    // 受 oclif 限制(variadic 前不允许 optional arg), 字幕文件路径与额外参数合并为单个 variadic 接收:
    // params 强制 key=value 格式, 因此不含 = 的首个 token 为字幕文件路径, 运行时按此规则拆分
    inputs: Args.string({
      description: 'VTT 字幕文件路径 与 key=value 参数 (首个不含 = 的 token 为字幕文件路径, 省略时交互输入)',
      multiple: true,
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(ArtTts)

    // #region 拆分 variadic 输入: 不含 = 的首个 token 为字幕文件路径, 其余为 key=value 参数
    const inputs = args.inputs ?? []
    const subtitleFileArg = inputs.find((token) => !token.includes('='))
    const rawParams = inputs.filter((token) => token.includes('='))
    // #endregion

    // #region 解析字幕与参考音频: 字幕文件路径未提供时扫描当前目录供交互选择 (30 秒未操作自动中断)
    const rawSubtitleFile = subtitleFileArg ?? (await this.selectSubtitleFile())
    const subtitleFilePath = rawSubtitleFile.trim()
    if (!subtitleFilePath) {
      this.error('未提供 VTT 字幕文件路径')
    }
    const vttCues = parseVttCues(readFileSync(subtitleFilePath, 'utf8'))
    if (vttCues.length === 0) {
      this.error(`字幕文件中未解析到任何文本: ${subtitleFilePath}`)
    }
    const referenceAudio = resolveReferenceAudio(flags.ref)
    const extraWorkflowParams = buildWorkflowParams(undefined, rawParams)
    this.log(`共解析到 ${vttCues.length} 条字幕, 音色参考音频: ${flags.ref}`)
    // #endregion

    const client = this.createArtClient()

    // #region 全部并发提交并静默轮询, 单条失败不影响其余任务, 结束后统一汇总
    this.log(`开始并发提交 ${vttCues.length} 个配音任务...`)
    let completedCount = 0
    const cueResultList = await Promise.allSettled(vttCues.map(async (vttCue) => {
      const workflowParams = {
        prompt_text: vttCue.text,
        prompt_simple: referenceAudio,
        emo_control_method: flags.emo,
        ...extraWorkflowParams,
      }
      const submission = await client.submitWorkflowTask(INDEXTTS2_WORKFLOW_ID, workflowParams)
      const snapshot = await this.waitForTaskSuccess(client, submission.task_id, flags.timeout, true)
      completedCount += 1
      this.log(`[${completedCount}/${vttCues.length}] 第 ${vttCue.index} 条配音完成 (任务ID: ${submission.task_id})`)
      return {vttCue, audioUrl: extractFirstAudioUrl(snapshot)}
    }))
    const ttsCueResults = summarizeTtsResults(vttCues, cueResultList)
    // #endregion

    // #region 下载成功产物: 按字幕序号补零命名, 存入输出目录
    await mkdir(flags.out, {recursive: true})
    for (const ttsCueResult of ttsCueResults) {
      if (!ttsCueResult.audioUrl) continue
      const savePath = buildAudioSavePath(flags.out, ttsCueResult.vttCue.index, ttsCueResult.audioUrl)
      await client.downloadFile(ttsCueResult.audioUrl, savePath)
      this.log(`已下载: ${savePath}`)
    }
    // #endregion

    // #region 汇总失败任务: 已提交的任务ID不会丢失, 可用 art status/download 续查补救
    const failedTtsResults = ttsCueResults.filter((ttsCueResult) => !ttsCueResult.audioUrl)
    if (failedTtsResults.length > 0) {
      const failureLines = failedTtsResults.map((ttsCueResult) => `  第 ${ttsCueResult.vttCue.index} 条 "${ttsCueResult.vttCue.text}": ${ttsCueResult.errorMessage}`)
      this.error(`有 ${failedTtsResults.length}/${vttCues.length} 条字幕配音失败:\n${failureLines.join('\n')}`)
    }
    this.log(`全部完成, 共生成 ${vttCues.length} 个音频文件到 ${path.resolve(flags.out)}`)
    // #endregion
  }

  // 扫描当前执行目录下的 VTT 字幕文件 (按文件名排序) 供交互选择, 找不到时给出显式传参指引
  private async selectSubtitleFile(): Promise<string> {
    const vttFileNames = (await readdir(process.cwd()))
      .filter((fileName) => fileName.toLowerCase().endsWith('.vtt'))
      .sort()
    if (vttFileNames.length === 0) {
      this.error('当前目录未找到 VTT 字幕文件, 可通过参数显式指定字幕文件路径')
    }
    return this.selectWithTimeout(
      '请选择 VTT 字幕文件',
      vttFileNames.map((fileName) => ({name: fileName, value: fileName})),
      '可通过参数显式指定字幕文件路径',
    )
  }
}

// 从任务快照中提取首个产物 URL (indextts2 每个任务只产出一个音频)
function extractFirstAudioUrl(snapshot: ComfyuiTaskSnapshot): string {
  const [firstAudioUrl] = extractResourceUrls(snapshot.results)
  if (!firstAudioUrl) {
    throw new Error(`任务成功但未返回音频产物, 原始结果: ${JSON.stringify(snapshot.results)}`)
  }
  return firstAudioUrl
}

// 汇总各字幕的执行结果: fulfilled 归入成功 (可能未提取到 URL), rejected 归入失败
function summarizeTtsResults(vttCues: VttCue[], cueResultList: PromiseSettledResult<Omit<TtsCueResult, 'errorMessage'>>[]): TtsCueResult[] {
  return vttCues.map((vttCue, index) => {
    const cueResult = cueResultList[index]
    if (cueResult.status === 'fulfilled') {
      return {vttCue, audioUrl: cueResult.value.audioUrl, errorMessage: cueResult.value.audioUrl ? undefined : '任务成功但未返回音频产物'}
    }
    const reason = cueResult.reason instanceof Error ? cueResult.reason.message : String(cueResult.reason)
    return {vttCue, errorMessage: reason}
  })
}

// 解析参考音频: 本地存在的路径读为 base64 data URI, 否则按 URL 原样返回
function resolveReferenceAudio(referenceArg: string): string {
  if (!existsSync(referenceArg)) return referenceArg
  const audioBuffer = readFileSync(referenceArg)
  const mimeType = AUDIO_MIME_TYPES[path.extname(referenceArg).toLowerCase()] ?? 'audio/wav'
  return `data:${mimeType};base64,${audioBuffer.toString('base64')}`
}

// 保存路径规划: 按字幕序号补零命名, 扩展名取产物 URL 路径末段, 缺失时按 .wav 兜底
function buildAudioSavePath(outputDir: string, cueIndex: number, audioUrl: string): string {
  const paddedIndex = String(cueIndex).padStart(FILE_INDEX_PAD_WIDTH, '0')
  const audioExtension = path.extname(new URL(audioUrl).pathname) || '.wav'
  return path.join(outputDir, `${paddedIndex}${audioExtension}`)
}
