// 静态目录数据(注册表模式): 集中维护 AutoDL 官方文档附录中的枚举数据,
// 用于交互式选择场景, 与 API 客户端解耦
// 文档: https://www.autodl.com/docs/instance_pro_api/

// GPU 算力规格目录项
export interface GpuSpecCatalogItem {
  // 前台网页显示的 GPU 型号
  model: string
  // 规格分类, 如 通用型 / 性能型
  category: string
  // API 使用的算力规格 ID
  specId: string
}

// 公共基础镜像目录项
export interface PublicBaseImageCatalogItem {
  // 镜像 UUID
  imageUuid: string
  // 框架, 如 PyTorch / TensorFlow / Miniconda / TensorRT
  framework: string
  // 镜像描述
  image: string
}

// #region GPU 算力规格目录

// GPU 型号与算力规格 ID 对应表
export const AUTODL_GPU_SPEC_CATALOG: GpuSpecCatalogItem[] = [
  {model: 'PRO6000-96G', category: '性能型', specId: 'pro6000-p'},
  {model: '5090-32G', category: '性能型', specId: '5090-p'},
  {model: '4080(S)-32G', category: '性能型', specId: 'v-32g-p'},
  {model: '4090-48G', category: '通用型', specId: 'v-48g'},
  {model: '3090-48G', category: '通用型', specId: 'v-48g-350w'},
  {model: '4090D', category: '通用型', specId: '4090D'},
  {model: 'H800-80G', category: '通用型', specId: 'h800'},
]

// #endregion

// #region 公共基础镜像目录

// 公共基础镜像 UUID 对应表
export const AUTODL_PUBLIC_BASE_IMAGE_CATALOG: PublicBaseImageCatalogItem[] = [
  {imageUuid: 'base-image-l2t43iu6uk', framework: 'PyTorch', image: 'cuda11.8-cudnn8-devel-ubuntu20.04-py38-torch2.0.0'},
  {imageUuid: 'base-image-u9r24vthlk', framework: 'PyTorch', image: 'cuda11.3-cudnn8-devel-ubuntu20.04-py38-torch1.10.0'},
  {imageUuid: 'base-image-l374uiucui', framework: 'PyTorch', image: 'cuda11.3-cudnn8-devel-ubuntu20.04-py38-torch1.11.0'},
  {imageUuid: 'base-image-12be412037', framework: 'PyTorch', image: 'cuda11.1-cudnn8-devel-ubuntu18.04-py38-torch1.9.0'},
  {imageUuid: 'base-image-uxeklgirir', framework: 'TensorFlow', image: 'cuda11.2-cudnn8-devel-ubuntu20.04-py38-tf2.9.0'},
  {imageUuid: 'base-image-0gxqmciyth', framework: 'TensorFlow', image: 'cuda11.2-cudnn8-devel-ubuntu18.04-py38-tf2.5.0'},
  {imageUuid: 'base-image-4bpg0tt88l', framework: 'TensorFlow', image: 'cuda11.4-py38-tf1.15.5'},
  {imageUuid: 'base-image-mbr2n4urrc', framework: 'Miniconda', image: 'cuda11.6-cudnn8-devel-ubuntu20.04-py38'},
  {imageUuid: 'base-image-h041hn36yt', framework: 'Miniconda', image: 'cuda11.1-cudnn8-devel-ubuntu18.04-py38'},
  {imageUuid: 'base-image-7bn8iqhkb5', framework: 'Miniconda', image: 'cudagl11.3-cudnn8-devel-ubuntu20.04-py38'},
  {imageUuid: 'base-image-qkkhitpik5', framework: 'Miniconda', image: 'cuda10.2-cudnn7-devel-ubuntu18.04-py38'},
  {imageUuid: 'base-image-k0vep6kyq8', framework: 'Miniconda', image: 'cuda9.0-cudnn7-devel-ubuntu16.04-py36'},
  {imageUuid: 'base-image-l2843iu23k', framework: 'TensorRT', image: 'cuda11.8-cudnn8-devel-ubuntu20.04-py38-trt8.5.1'},
]

// #endregion
