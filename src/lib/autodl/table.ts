// 简易文本表格渲染: 不引入额外依赖, 且正确处理中文全角字符的终端宽度

// 计算字符串的终端显示宽度: CJK 表意文字与全角符号按 2 列计, 其余按 1 列计
function getDisplayWidth(text: string): number {
  let width = 0
  for (const char of text) {
    const codePoint = char.codePointAt(0) ?? 0
    // CJK 统一表意文字(4E00-9FFF) / CJK 符号标点(3000-303F) / 全角形式(FF00-FFEF) 均为全角
    const isWideChar =
      (codePoint >= 0x4e_00 && codePoint <= 0x9f_ff) ||
      (codePoint >= 0x30_00 && codePoint <= 0x30_3f) ||
      (codePoint >= 0xff_00 && codePoint <= 0xff_ef)
    width += isWideChar ? 2 : 1
  }
  return width
}

// 按显示宽度右侧补空格, 等价于 padEnd 的全角感知版本
function padEndByDisplayWidth(text: string, targetWidth: number): string {
  const paddingLength = Math.max(targetWidth - getDisplayWidth(text), 0)
  return text + ' '.repeat(paddingLength)
}

/**
 * 渲染左对齐的简易文本表格(表头 + 分隔线 + 数据行), 列宽取各列内容显示宽度的最大值。
 *
 * @param headers - 表头文本
 * @param rows - 数据行, 每行的单元格数量应与表头一致
 * @returns 以换行符拼接的多行表格文本
 */
export function renderTextTable(headers: string[], rows: string[][]): string {
  // 逐列计算宽度: 取表头与所有数据行中该列显示宽度的最大值
  const columnWidths = headers.map((header, columnIndex) =>
    Math.max(
      getDisplayWidth(header),
      ...rows.map((row) => getDisplayWidth(row[columnIndex] ?? '')),
    ),
  )

  const formatRow = (cells: string[]) =>
    cells.map((cell, columnIndex) => padEndByDisplayWidth(cell ?? '', columnWidths[columnIndex])).join('  ')

  const headerLine = formatRow(headers)
  const dividerLine = columnWidths.map((width) => '-'.repeat(width)).join('  ')
  const bodyLines = rows.map((row) => formatRow(row))

  return [headerLine, dividerLine, ...bodyLines].join('\n')
}
