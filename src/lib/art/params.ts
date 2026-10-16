// 工作流参数解析与产物 URL 提取的纯函数工具: 无 IO, 供各命令复用

import {readFileSync} from 'node:fs'

// 构造工作流参数: JSON 文件参数为底, 命令行 key=value 参数覆盖同名键
export function buildWorkflowParams(paramsFile: string | undefined, rawParams: string[] | undefined): Record<string, unknown> {
  const fileParams = loadParamsFile(paramsFile)
  const inlineParams = parseKeyValueParams(rawParams ?? [])
  return {...fileParams, ...inlineParams}
}

// 解析 key=value 形式的工作流参数: value 先尝试 JSON 解析(支持数字/布尔/数组/对象), 失败则按纯文本处理
function parseKeyValueParams(rawParams: string[]): Record<string, unknown> {
  const workflowParams: Record<string, unknown> = {}
  for (const rawParam of rawParams) {
    // 只按第一个 = 分割, 保证 value 中可以继续包含 = 号
    const separatorIndex = rawParam.indexOf('=')
    if (separatorIndex <= 0) {
      throw new Error(`参数格式不合法: "${rawParam}", 应为 key=value 形式`)
    }
    const paramKey = rawParam.slice(0, separatorIndex).trim()
    const rawValue = rawParam.slice(separatorIndex + 1).trim()
    workflowParams[paramKey] = parseScalarValue(rawValue)
  }
  return workflowParams
}

// 解析标量值: 先尝试 JSON 解析(支持数字/布尔/数组/对象), 失败则按纯文本处理
export function parseScalarValue(rawValue: string): unknown {
  try {
    return JSON.parse(rawValue)
  } catch {
    return rawValue
  }
}

function loadParamsFile(paramsFile: string | undefined): Record<string, unknown> {
  if (!paramsFile) return {}
  try {
    return JSON.parse(readFileSync(paramsFile, 'utf8')) as Record<string, unknown>
  } catch (error) {
    throw new Error(`读取参数文件失败: ${paramsFile}, 原因: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// 从任务 results 中递归提取所有资源 URL (官方未约定 results 元素结构, 统一遍历收集)
export function extractResourceUrls(results: unknown): string[] {
  const resourceUrls: string[] = []
  collectResourceUrls(results, resourceUrls)
  return resourceUrls
}

function collectResourceUrls(node: unknown, collected: string[]): void {
  if (typeof node === 'string') {
    if (node.startsWith('http://') || node.startsWith('https://')) collected.push(node)
    return
  }
  if (Array.isArray(node)) {
    for (const item of node) collectResourceUrls(item, collected)
    return
  }
  if (node !== null && typeof node === 'object') {
    for (const value of Object.values(node)) collectResourceUrls(value, collected)
  }
}
