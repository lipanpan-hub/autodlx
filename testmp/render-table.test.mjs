// renderTextTable 快速自测脚本: node testmp/render-table.test.mjs
import assert from 'node:assert/strict'

import {renderTextTable} from '../dist/lib/autodl/table.js'

// 独立实现视觉列计算(不复用被测代码): CJK 全角按 2 列计
function getVisualColumn(line, searchText) {
  const charIndex = line.indexOf(searchText)
  let visualColumn = 0
  for (const char of line.slice(0, charIndex)) {
    const codePoint = char.codePointAt(0)
    const isWide =
      (codePoint >= 0x4e_00 && codePoint <= 0x9f_ff) || (codePoint >= 0x30_00 && codePoint <= 0x30_3f) || (codePoint >= 0xff_00 && codePoint <= 0xff_ef)
    visualColumn += isWide ? 2 : 1
  }
  return visualColumn
}

// #region 常规表格: 中文表头 + 英文数据
const output = renderTextTable(
  ['实例ID', '名称', '状态'],
  [
    ['pro-76419909953e', 'API创建的实例', 'running'],
    ['pro-76576c61fdf1', 'train', 'shutdown'],
  ],
)
console.log(output)
// #endregion

// #region 断言: 各行第二列/第三列的视觉起始列对齐(第一列宽 16 + 2 空格 = 视觉列 18)
const lines = output.split('\n')
assert.equal(lines.length, 4, '应输出 表头+分隔线+2 行数据')
assert.ok(lines[1].includes('---'), '第二行应为分隔线')
assert.equal(getVisualColumn(lines[0], '名称'), 18, '表头第二列起始视觉列应为 18')
assert.equal(getVisualColumn(lines[2], 'API创建的实例'), 18, '数据行第二列起始视觉列应为 18')
assert.equal(getVisualColumn(lines[3], 'train'), 18, '数据行第二列起始视觉列应为 18')
assert.equal(getVisualColumn(lines[2], 'running'), 33, '第二列宽 13, 第三列起始视觉列应为 33')
// #endregion

// #region 空数据行: 不应抛错且只输出表头和分隔线
const emptyOutput = renderTextTable(['镜像ID'], [])
assert.equal(emptyOutput.split('\n').length, 2, '空数据时应只有表头和分隔线')
// #endregion

console.log('renderTextTable 自测通过')
