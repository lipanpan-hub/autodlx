// WebVTT 字幕解析的纯函数工具: 无 IO, 从 VTT 文本中按序提取每条 cue 的文本, 供批量配音命令复用

export interface VttCue {
  // 序号 (按文件内出现顺序, 从 1 起)
  index: number
  // 开始时间戳 (原始文本, 如 00:00:01.000)
  startTime: string
  // 结束时间戳 (原始文本)
  endTime: string
  // 字幕文本 (多行合并为单行)
  text: string
}

// 解析 VTT 文本为 cue 列表: 按 cue 之间的空行分块, 跳过 WEBVTT 头部与 NOTE/STYLE/REGION 等非 cue 块
export function parseVttCues(vttContent: string): VttCue[] {
  const blocks = vttContent.split(/\r?\n\r?\n/)
  const parsedCues: Omit<VttCue, 'index'>[] = []
  for (const block of blocks) {
    const parsedCue = parseVttBlock(block)
    if (parsedCue) parsedCues.push(parsedCue)
  }
  return parsedCues.map((parsedCue, index) => ({...parsedCue, index: index + 1}))
}

// 解析单个文本块: 含时间轴行(--> )的才是 cue, 文本取时间轴行之后的所有行合并
function parseVttBlock(block: string): Omit<VttCue, 'index'> | undefined {
  const lines = block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  const timingLineIndex = lines.findIndex((line) => line.includes('-->'))
  if (timingLineIndex < 0) return undefined

  // 去除时间轴行尾的 cue 设置项 (如 position/align), 只保留起止时间戳
  const [rawStart, rawEndAndSettings] = lines[timingLineIndex].split('-->')
  const startTime = rawStart.trim()
  const endTime = rawEndAndSettings.trim().split(/\s+/)[0]
  // 多行合并为单行, 并剥离 <v>/<c> 等内联标签 (TTS 只需要纯文本)
  const cueText = lines.slice(timingLineIndex + 1).join(' ').replace(/<[^>]+>/g, '').trim()
  if (!cueText) return undefined
  return {startTime, endTime, text: cueText}
}
