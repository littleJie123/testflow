## 2025-08-18

- **feature: 美化步骤详情弹窗中的JSON显示**
  - 新增 `highlightJson` 公共方法，用于对JSON字符串进行语法高亮处理。
  - 新增了相应的CSS样式，为JSON的键、字符串、数字等不同类型的值提供不同的颜色。
  - 在步骤详情弹窗中，将 `headers` 和 `params` 的显示和编辑控件从 `<textarea>` 修改为 `<pre contenteditable="true">`，以便在支持编辑的同时能够渲染高亮样式。
  - 对弹窗内的 `headers`、`params` 和 `result` 区域应用了JSON语法高亮，提升了可读性。
  - 修改了“重新运行”的逻辑，以兼容从 `<pre>` 控件获取修改后的数据，并将新结果同样高亮显示。
- **fix: 修复 `highlightJson` 函数未定义错误**
  - 将 `highlightJson` 函数从全局范围移动到 `Util` 类中作为静态方法，解决了在 `detail.html` 中调用时出现的 `ReferenceError`。
  - 更新了 `detail.html` 中所有对 `highlightJson` 的调用，改为 `Util.highlightJson`。
- **fix: 修复 `util.js` 语法错误**
  - 修复了 `Util` 类因缺少闭合括号 `}` 导致的 `SyntaxError`，该错误导致 `Util` 类无法被正确解析和定义。
- **style: 将弹窗中JSON字体修改为“微软雅黑”**
  - 更新了 `index.css` 文件，为弹窗中的 `<pre>` 元素指定了新字体。

## 2025-11-17
- **optimization: 删除client/css/index.css中未使用的样式**

## 2025-12-11
- **feature: 增加目录浏览功能**
  - 在 `index.html` 中增加了对测试用例目录的浏览功能。
  - 实现了 `path` 变量来跟踪当前目录。
  - 修改了 `fetchData` 函数，以便在请求测试用例列表时发送当前 `path`。
  - 更新了渲染逻辑，以区分普通测试用例和目录，并为目录添加了 📂 图标以增强视觉区分度。
  - 为目录增加了“进入”功能，并为非根目录提供了“上一级”导航。