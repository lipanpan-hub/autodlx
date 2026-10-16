// AutoDL.art ComfyUI API 客户端(门面模式): 统一封装 HOST / 鉴权头 / 响应解包与错误检查,
// 命令层只调用本类的语义化方法, 不感知 HTTP 细节

import {createWriteStream} from 'node:fs'
import {Readable} from 'node:stream'
import {pipeline} from 'node:stream/promises'
import type {ReadableStream as NodeWebReadableStream} from 'node:stream/web'

import type {ArtResponse, ComfyuiTaskSnapshot, ComfyuiTaskSubmission} from './types.js'

export const ART_API_HOST = 'https://autodl.art'

export class ArtClient {
  constructor(private readonly apiKey: string) {}

  // #region 通用请求

  // 发送请求并解包通用响应, code 非 Success 时抛出带服务端 msg 的错误
  // GET 请求不携带 Body, 其余方法将参数作为 JSON Body 发送
  private async request<T>(
    path: string,
    body?: Record<string, unknown>,
    method: 'GET' | 'POST' = 'POST',
  ): Promise<T> {
    let httpResponse: Response
    try {
      httpResponse = await fetch(`${ART_API_HOST}${path}`, {
        method,
        headers: {'Authorization': this.apiKey, 'Content-Type': 'application/json'},
        body: method === 'GET' ? undefined : JSON.stringify(body ?? {}),
      })
    } catch (error) {
      throw new Error(`AutoDL.art API 请求失败: ${path}, 原因: ${error instanceof Error ? error.message : String(error)}`)
    }

    if (!httpResponse.ok) {
      throw new Error(`AutoDL.art API 返回 HTTP ${httpResponse.status}: ${await httpResponse.text()}`)
    }

    const payload = (await httpResponse.json()) as ArtResponse<T>
    if (payload.code !== 'Success') {
      throw new Error(`AutoDL.art API 调用失败: ${payload.code} ${payload.msg}`.trim())
    }
    return payload.data
  }

  // #endregion

  // #region ComfyUI 工作流任务

  // 提交工作流任务, 立即返回任务ID, 结果需通过 getTaskSnapshot 异步查询
  async submitWorkflowTask(workflowId: string, workflowParams: Record<string, unknown>): Promise<ComfyuiTaskSubmission> {
    return this.request<ComfyuiTaskSubmission>(`/api/v1/comfyui/comfyui_workflow/${workflowId}`, workflowParams)
  }

  // 查询任务快照: SUCCESS 后 results 中携带产物 URL (有效期短, 需尽快下载)
  async getTaskSnapshot(taskId: string): Promise<ComfyuiTaskSnapshot> {
    return this.request<ComfyuiTaskSnapshot>(`/api/v1/comfyui/comfyui_workflow/result/${taskId}`, undefined, 'GET')
  }

  // #endregion

  // #region 产物下载

  // 流式下载产物文件到本地路径
  async downloadFile(fileUrl: string, savePath: string): Promise<void> {
    let httpResponse: Response
    try {
      httpResponse = await fetch(fileUrl)
    } catch (error) {
      throw new Error(`产物下载失败: ${fileUrl}, 原因: ${error instanceof Error ? error.message : String(error)}`)
    }
    if (!httpResponse.ok || !httpResponse.body) {
      throw new Error(`产物下载返回 HTTP ${httpResponse.status}: ${fileUrl}`)
    }
    // undici 的 ReadableStream 与 node:stream/web 的类型定义存在差异, 需显式断言后交给流式管道
    const webStream = httpResponse.body as unknown as NodeWebReadableStream
    await pipeline(Readable.fromWeb(webStream), createWriteStream(savePath))
  }

  // #endregion
}
