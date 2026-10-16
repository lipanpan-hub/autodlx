// 产物保存路径规划: 纯函数, 不涉及 IO

import path from 'node:path'

// 为资源 URL 列表规划本地保存路径: 文件名取 URL 路径末段, 缺失或重复时用 task_id+序号兜底, 避免相互覆盖
export function resolveSavePaths(resourceUrls: string[], outputDir: string, taskId: string): string[] {
  const usedFileNames = new Set<string>()
  return resourceUrls.map((resourceUrl, index) => {
    const urlFileName = path.basename(new URL(resourceUrl).pathname)
    // URL 末段缺失(以 / 结尾)或与已规划文件名重复时, 用 task_id+序号兜底并保留原扩展名
    const fileName = (urlFileName && !usedFileNames.has(urlFileName))
      ? urlFileName
      : `${taskId}-${index + 1}${path.extname(urlFileName)}`
    usedFileNames.add(fileName)
    return path.join(outputDir, fileName)
  })
}
