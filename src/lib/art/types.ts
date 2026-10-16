// AutoDL.art ComfyUI API 类型定义

// 通用响应包装
export interface ArtResponse<T> {
  code: string
  data: T
  msg: string
  request_id: string
}

// 提交工作流任务的返回
export interface ComfyuiTaskSubmission {
  task_id: string
  workflow: string
  status: string
  client_id?: string
  message?: string
  created_at?: string
}

// 任务快照: status 已知取值为 QUEUED/RUNNING/SUCCESS/FAILED;
// results 元素结构官方未约定(图片/视频等资源), 统一按 unknown 处理, 消费时从中递归提取资源 URL
export interface ComfyuiTaskSnapshot {
  task_id: string
  status: string
  client_id?: string
  created_at?: string
  started_at?: string
  duration?: number
  results?: unknown[]
}
