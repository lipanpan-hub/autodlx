// 预置常用工作流注册表(数据驱动): 存储名称/ID/所需参数说明, 用户未显式指定工作流ID时供交互选择,
// 新增常用工作流只需在 PRESET_WORKFLOWS 中补充条目 (参数可在工作流详情页右侧抽屉的 API 标签中查看)

export interface PresetWorkflowParam {
  // 参数名 (API 请求体字段)
  name: string
  // 参数说明
  description: string
  // 是否必填
  isRequired: boolean
  // 示例值 (字符串形式, 展示用)
  example?: string
}

export interface PresetWorkflow {
  // 工作流ID (提交任务 API 路径中的标识)
  id: string
  // 展示名称
  name: string
  // 功能描述
  description: string
  // 所需参数清单
  params: PresetWorkflowParam[]
}

export const PRESET_WORKFLOWS: PresetWorkflow[] = [
  {
    id: 'indextts2-v1',
    name: 'indextts2 文本转语音',
    description: '基于文本 + 参考音频生成目标语音, 保留说话人音色、支持情绪表达 (https://www.autodl.art/large-model/comfyui/indextts2-v1)',
    params: [
      {name: 'prompt_text', description: '要合成的文本 (1-2048 字)', isRequired: true, example: '"你好，这是一段测试文本"'},
      {name: 'prompt_simple', description: '参考音频, 支持 URL 或 base64', isRequired: true, example: '"http://lipanpan.oss-cn-shenzhen.aliyuncs.com/voice-preview.wav "'},
      {name: 'emo_control_method', description: '情绪控制方法', isRequired: true, example: '"与音色参考音频相同"'},
      {name: 'emo_happy', description: '情绪强度: 高兴 (0-1.4), 其余情绪为同前缀参数 emo_sad/emo_angry/emo_calm 等', isRequired: false, example: '0.5'},
      {name: 'emo_random', description: '是否随机情绪', isRequired: false, example: 'false'},
    ],
  },
  {
    id: 'minimax_h3_lightx2v_no_pic',
    name: 'H3 文生视频',
    description: 'MiniMax H3 文本生成视频 (高速版)',
    params: [
      {name: 'prompt', description: '视频内容描述', isRequired: true, example: '"一只小猫咪在云端漫步"'},
      {name: 'duration', description: '视频时长档位', isRequired: false, example: '1'},
      {name: 'resolution', description: '分辨率', isRequired: false, example: '"480p竖"'},
    ],
  },
]
