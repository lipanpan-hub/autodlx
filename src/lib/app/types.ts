// AutoDL.art 应用实例 API 类型定义
// 文档: https://www.autodl.art/docs/app_api/
// 字段名沿用 API 原始的 snake_case 风格, 由 client 原样透传, 避免无意义的映射样板代码

// API 通用响应结构
export interface AppResponse<T> {
  code: string
  data: T
  msg: string
}

// 实例关联的网页应用信息(如 ComfyUI-纯净版)
export interface AppApplicationInfo {
  application_uuid: string
  // 实例当前使用的应用版本
  current_version: string
  application_name: string
  logo: string
}

// 应用实例摘要(列表项)
export interface AppInstanceSummary {
  uuid: string
  name: string
  status: string
  sub_status: string
  region_sign: string
  region_name: string
  machine_id: string
  machine_alias: string
  // 计费方式: payg 按量计费
  charge_type: string
  // 有卡模式: gpu
  start_mode: string
  req_gpu_amount: number
  gpu_spec_uuid: string
  created_at: string
  status_at: string
  cg_application_info: AppApplicationInfo
}

// 应用实例资源使用信息
export interface AppInstanceUsageInfo {
  valid_at: string
  cpu_usage_percent: number
  mem_usage_percent: number
  mem_usage: number
  mem_limit: number
  root_fs_used_size: number
  root_fs_total_size: number
  pull_image_progress: number
  download_image_progress: number
}

// 应用实例详情(快照)
export interface AppInstanceSnapshot {
  region_sign: string
  // 折扣后的按量计费价格(毫/小时)
  payg_price: number
  // 折扣前的按量计费价格(毫/小时)
  origin_pay_price: number
  snapshot_gpu_alias_name: string
  chip_corp: string
  cpu_arch: string
  usage_info: AppInstanceUsageInfo
  expand_system_disk_size: number
  system_init_disk_size: number
  ssh_command: string
  proxy_host: string
  root_password: string
  ssh_port: number
  jupyter_token: string
  jupyter_domain: string
  service_6006_domain: string
  service_6006_port_protocol: string
  service_6008_domain: string
  service_6008_port_protocol: string
  cg_application_info: AppApplicationInfo
}

// 创建应用实例参数(暂仅支持按量计费)
export interface CreateAppInstanceParams {
  // 候选地区代码列表, 省略时系统自动选择
  data_center_list?: string[]
  // GPU 数量, 1-4
  req_gpu_amount: number
  // 系统盘扩容大小(GB), 0-500
  expand_system_disk_by_gb: number
  // 算力规格 ID, 如 pro6000-p
  gpu_spec_uuid: string
  // 网页应用的 UUID, 在网页应用详情页查看
  application_uuid: string
  // 应用版本, latest 表示自动使用最新版本
  application_version: string
  instance_name?: string
  start_command?: string
}
