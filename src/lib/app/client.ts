// AutoDL.art 应用实例 API 客户端(门面模式): 统一封装 HOST / 鉴权头 / 响应解包与错误检查,
// 命令层只调用本类的语义化方法, 不感知 HTTP 细节
// 文档: https://www.autodl.art/docs/app_api/

import type {PagedList} from '../autodl/types.js'

import type {AppInstanceSnapshot, AppInstanceSummary, AppResponse, CreateAppInstanceParams} from './types.js'

export const APP_API_HOST = 'https://www.autodl.art'

export class AppClient {
  constructor(private readonly token: string) {}

  // #region 通用请求

  // 发送请求并解包通用响应, code 非 Success 时抛出带服务端 msg 的错误
  // GET 请求将参数拼接到 URL 查询串(fetch 不允许 GET 携带 Body), 其余方法将参数作为 JSON Body 发送
  private async request<T>(
    path: string,
    body: Record<string, unknown> = {},
    method: 'GET' | 'POST' = 'POST',
  ): Promise<T> {
    const queryString = new URLSearchParams(
      Object.entries(body).map(([key, value]) => [key, String(value)]),
    ).toString()
    const isGetRequest = method === 'GET'
    const requestUrl = `${APP_API_HOST}${path}${(isGetRequest && queryString) ? `?${queryString}` : ''}`

    let httpResponse: Response
    try {
      httpResponse = await fetch(requestUrl, {
        method,
        headers: {'Authorization': this.token, 'Content-Type': 'application/json'},
        body: isGetRequest ? undefined : JSON.stringify(body),
      })
    } catch (error) {
      throw new Error(`AutoDL.art 应用实例 API 请求失败: ${path}, 原因: ${error instanceof Error ? error.message : String(error)}`)
    }

    if (!httpResponse.ok) {
      throw new Error(`AutoDL.art 应用实例 API 返回 HTTP ${httpResponse.status}: ${await httpResponse.text()}`)
    }

    const payload = (await httpResponse.json()) as AppResponse<T>
    if (payload.code !== 'Success') {
      throw new Error(`AutoDL.art 应用实例 API 调用失败: ${payload.code} ${payload.msg}`.trim())
    }
    return payload.data
  }

  // #endregion

  // #region 应用实例

  // 创建应用实例, 返回新实例 ID
  async createInstance(params: CreateAppInstanceParams): Promise<string> {
    return this.request<string>('/api/v1/adl_dev/dev/instance/pro/create', {...params})
  }

  // 获取实例详情(接口要求 GET 请求)
  async getInstanceSnapshot(instanceUuid: string): Promise<AppInstanceSnapshot> {
    return this.request<AppInstanceSnapshot>('/api/v1/adl_dev/dev/instance/pro/snapshot', {instance_uuid: instanceUuid}, 'GET')
  }

  // 获取实例状态, 如 running / shutdown (接口要求 GET 请求)
  async getInstanceStatus(instanceUuid: string): Promise<string> {
    return this.request<string>('/api/v1/adl_dev/dev/instance/pro/status', {instance_uuid: instanceUuid}, 'GET')
  }

  // 获取实例列表(分页)
  async listInstances(pageIndex: number, pageSize: number): Promise<PagedList<AppInstanceSummary>> {
    return this.request<PagedList<AppInstanceSummary>>('/api/v1/adl_dev/dev/instance/pro/list', {
      page_index: pageIndex,
      page_size: pageSize,
    })
  }

  // 开机实例(有卡模式), startCommand 会覆盖创建时设置的命令
  async powerOn(instanceUuid: string, startCommand?: string): Promise<void> {
    const body: Record<string, unknown> = {instance_uuid: instanceUuid, payload: 'gpu'}
    if (startCommand) body.start_command = startCommand
    await this.request<null>('/api/v1/adl_dev/dev/instance/pro/power_on', body)
  }

  // 关机实例
  async powerOff(instanceUuid: string): Promise<void> {
    await this.request<null>('/api/v1/adl_dev/dev/instance/pro/power_off', {instance_uuid: instanceUuid})
  }

  // 释放实例(释放前需先关机, 否则可能无法释放)
  async releaseInstance(instanceUuid: string): Promise<void> {
    await this.request<null>('/api/v1/adl_dev/dev/instance/pro/release', {instance_uuid: instanceUuid})
  }

  // #endregion
}
