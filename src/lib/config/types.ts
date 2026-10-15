// 配置文件类型定义

import type {ConfigFile, NamedProfile} from './config-manager.js'

// 单个配置档案: 在通用 NamedProfile 之上扩展各工具的工作参数
export interface Profile extends NamedProfile {
  documentsPath?: string
  // AutoDL 开发者 Token (控制台 -> 设置 -> 开发者Token)
  autodlToken?: string
}

// 顶层配置: 通用多档案结构在 vptool 档案上的特化
export type Config = ConfigFile<Profile>
