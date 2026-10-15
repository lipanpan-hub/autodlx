// AutoDL API 类型定义
// 文档: https://www.autodl.com/docs/common_api/ 与 https://www.autodl.com/docs/instance_pro_api/
// 字段名沿用 API 原始的 snake_case 风格, 由 client 原样透传, 避免无意义的映射样板代码

// API 通用响应结构
export interface AutodlResponse<T> {
  code: string
  data: T
  msg: string
}

// 钱包余额(金额单位均为"毫", 除以 1000 得到元)
export interface WalletBalance {
  // 当前余额
  assets: number
  // 累计消费金额
  accumulate: number
  // 当前代金券可用余额
  voucher_balance: number
}

// 通用分页结构
export interface PagedList<T> {
  list: T[]
  page_index: number
  page_size: number
  max_page: number
  result_total: number
}

// 实例摘要(列表项)
export interface InstanceSummary {
  uuid: string
  name: string
  status: string
  region_sign: string
  region_name: string
  // 计费方式: payg 按量计费
  charge_type: string
  // 有卡模式: gpu
  start_mode: string
  req_gpu_amount: number
  gpu_spec_uuid: string
  created_at: string
}

// 实例资源使用信息
export interface InstanceUsageInfo {
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

// 实例详情(快照)
export interface InstanceSnapshot {
  region_sign: string
  // 折扣后的按量计费价格(毫/小时)
  payg_price: number
  // 折扣前的按量计费价格(毫/小时)
  origin_pay_price: number
  snapshot_gpu_alias_name: string
  chip_corp: string
  cpu_arch: string
  usage_info: InstanceUsageInfo
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
  expand_system_disk_size: number
  system_init_disk_size: number
}

// 创建实例参数
export interface CreateInstanceParams {
  // 地区代码列表, 省略时系统自动选择
  data_center_list?: string[]
  // GPU 数量, 1-4
  req_gpu_amount: number
  // 系统盘扩容大小(GB), 0-500
  expand_system_disk_by_gb: number
  // 算力规格 ID, 如 pro6000-p
  gpu_spec_uuid: string
  // 镜像 UUID, 如 image-xxx / base-image-xxx
  image_uuid: string
  // CUDA 版本下限, 113 表示 cuda>=11.3
  cuda_v_from: number
  instance_name?: string
  start_command?: string
}

// 保存镜像结果
export interface SaveImageResult {
  image_uuid: string
}

// 私有镜像条目
export interface PrivateImage {
  image_uuid: string
  name: string
  // 如 finished
  status: string
  // 镜像大小(字节)
  image_size: number
  create_at: string
}
