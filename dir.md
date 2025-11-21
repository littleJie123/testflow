# 修改计划

## 需要更改的文件清单

### 修改的文件
1.  `src/testRunner/TestRunner.ts`
    *   修改 `scan` 函数，使其能够识别目录并将目录作为一种特殊的测试用例（或节点）加入到 `testMap` 中。
2.  `client/index.html`
    *   修改前端渲染逻辑，支持树形结构的展示（文件夹/文件）。
    *   增加文件夹的展开/折叠交互。
3.  `client/css/index.css`
    *   增加文件夹、层级缩进等相关样式。

### 新增的文件
1.  `src/testCase/DirectoryTestCase.ts` (可选，或者直接使用 `TestCase` 的特殊子类)
    *   用于表示一个目录节点，继承自 `TestCase`，但不需要执行具体的测试逻辑（或者执行目录下所有测试）。

## 修改计划详情

### 1. 后端修改 (Node.js)

#### 1.1 创建 `DirectoryTestCase` 类
在 `src/testCase` 下创建 `DirectoryTestCase.ts`。
*   继承自 `TestCase`。
*   `getName()` 返回目录名。
*   `doTest()` 可以为空，或者预留为运行该目录下所有测试。
*   `toJson()` 需要返回一个标识，表明这是一个目录（例如 `type: 'directory'`）。

#### 1.2 修改 `TestRunner.ts` 的 `scan` 方法
*   在遍历文件时，如果遇到目录：
    *   创建一个 `DirectoryTestCase` 实例。
    *   设置其 `testId`（生成规则与普通文件一致，基于路径）。
    *   将其加入到 `map` 中。
    *   继续递归扫描子目录。

### 2. 前端修改 (HTML/JS/CSS)

#### 2.1 修改数据处理逻辑 (`client/index.html`)
*   在 `fetchData` 获取到扁平的 `list` 后。
*   根据 `testId` (或者新增的 `parentId`/`path` 字段) 将扁平列表转换为树形结构。
    *   目前 `testId` 是 `root_dir_file` 格式，可以利用这个特性构建树，或者依赖后端返回的层级关系。
    *   建议后端返回的数据中包含 `type` 字段区分文件和文件夹。

#### 2.2 修改渲染逻辑 (`renderTestCases`)
*   不再只是简单的 `map` 渲染。
*   递归渲染树形结构。
*   文件夹节点需要包含：
    *   文件夹图标/名称。
    *   展开/折叠按钮。
    *   子节点容器（默认折叠或展开）。
*   文件节点保持原有的渲染方式，但要有缩进。

#### 2.3 样式调整 (`client/css/index.css`)
*   添加 `.folder-node` 样式。
*   添加缩进样式 (e.g., `padding-left`).
*   添加展开/折叠图标样式。

## 验证计划
1.  运行 `TestRunner`，确保后端不报错，且 `/listTestCase` 接口返回的数据包含目录节点。
2.  打开浏览器访问 `index.html`，检查：
    *   是否显示了文件夹结构。
    *   文件夹是否可以展开/折叠。
    *   点击文件是否仍能正常查看/运行。
