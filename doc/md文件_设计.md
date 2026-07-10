# md 文件设计文档

## 1. 需求回顾

在 testflow 测试框架中，支持为测试用例关联 Markdown 文档，并在 `detail.html` 中查看、编辑、保存。

### 1.1 功能要点

| 能力 | 说明 |
|------|------|
| 同名 md 自动关联 | 测试用例同目录下存在同名 `.md` 文件时，自动在步骤列表中展示 |
| 手动插入 MdFileAction | 在 `buildActions()` 中可插入 `MdFileAction`，指定 md 绝对路径 |
| 查看 | md 步骤显示「查看」按钮，弹窗以 HTML 渲染 md 内容 |
| 编辑保存 | 弹窗提供「修改」按钮，编辑源码后保存；**同时写入 src 与 dist** |
| 构建复制 | `npm start` 时将 `src` 下 md 复制到 `dist` |

### 1.2 约束

- `MdFileAction.doTest()` 为空操作，不改变测试变量、不发起 HTTP 请求
- 程序可能以 **ts 模式**（读 src）或 **js 模式**（读 dist）运行，保存时必须双写
- 与现有 HTTP 步骤的「查看 / copymd / 重新运行」弹窗并存，按步骤类型分支

---

## 2. 总体方案

### 2.1 架构示意

```
supplyTest/src/testCase/admin/FlowAdminUser.ts   ← 测试用例
supplyTest/src/testCase/admin/FlowAdminUser.md   ← 同名 md（可选）

         │ npm start: tsc + copyMd
         ▼
supplyTest/dist/testCase/admin/FlowAdminUser.js
supplyTest/dist/testCase/admin/FlowAdminUser.md

         │ TestRunner.scan
         ▼
TestCase (记录 sourcePath、autoMdPath)
         │ getActions = [auto MdFileAction?] + buildActions()
         ▼
GetTestCase → detail.html 步骤列表
         │ 查看
         ▼
getMdFile / saveMdFile → 读写在 src + dist
```

### 2.2 新增 / 修改文件

```
testflow/src/
  testAction/
    MdFileAction.ts              # 新增：md 步骤
  testCase/
    TestCase.ts                  # 修改：getActions 合并 md 步骤
  testRunner/
    TestRunner.ts                # 修改：scan 记录 md 路径
  util/
    MdPathUtil.ts                # 新增：src/dist 路径互转
  webServer/httpAction/
    GetMdFile.ts                 # 新增：读取 md
    SaveMdFile.ts                # 新增：保存 md（双写）
  scripts/
    copyMd.ts                    # 新增：复制 src/**/*.md → dist
  testflow.ts                    # 导出 MdFileAction

testflow/client/
  detail.html                    # md 弹窗：查看 / 修改 / 保存
  js/marked.min.js               # 新增（或 CDN）：md → html

testflow/package.json            # start 脚本增加 copyMd
```

使用方（如 supplyTest）的 `package.json` 的 `start` 脚本同样增加 md 复制（与 testflow 脚本一致或调用相同逻辑）。

---

## 3. MdFileAction 设计

**位置**：`src/testAction/MdFileAction.ts`

**继承**：`BaseTest`（不继承 `UrlAction`，无 HTTP 行为）

```typescript
export default class MdFileAction extends BaseTest {
  private filePath: string;

  constructor(filePath: string) {
    super();
    this.filePath = path.normalize(filePath);
  }

  getName(): string {
    return path.basename(this.filePath, '.md');
  }

  needInScreen(): boolean {
    return true;
  }

  protected couldLookDetail(): boolean {
    return true;
  }

  protected async doTest(): Promise<void> {
    // 空操作
  }

  getFilePath(): string {
    return this.filePath;
  }

  toJson() {
    const paths = MdPathUtil.resolveSrcAndDist(this.filePath);
    return {
      name: this.getName(),
      status: this.getRunStatus(),
      id: this.getTestId(),
      couldLookDetail: true,
      actionType: 'mdFile',
      filePath: this.filePath,
      srcPath: paths.srcPath,
      distPath: paths.distPath,
    };
  }
}
```

**运行行为**：走正常 `test()` 生命周期（init → running → processed），耗时 0ms，不写日志业务内容。

---

## 4. TestRunner.scan 改造

**位置**：`src/testRunner/TestRunner.ts`

加载测试文件 `FlowAdminUser.ts` 时：

1. 记录测试源文件绝对路径：`testInstance.setSourceFilePath(fullPath)`
2. 计算同名 md：`fullPath.replace(/\.(ts|js)$/, '.md')`
3. 若 md 存在：`testInstance.setAutoMdFilePath(mdPath)`

```typescript
const baseName = file.replace(/\.(ts|js)$/, '');
const mdPath = path.join(testPath, baseName + '.md');
if (fs.existsSync(mdPath)) {
  testInstance.setAutoMdFilePath(path.resolve(mdPath));
}
testInstance.setSourceFilePath(path.resolve(fullPath));
```

**说明**：scan 时的 `testPath` 可能是 `dist/testCase` 或 `src/testCase`，md 路径以实际扫描目录为准；`MdPathUtil` 负责推导成对的 src/dist 路径。

---

## 5. TestCase.getActions 改造

**位置**：`src/testCase/TestCase.ts`

```typescript
getActions(): BaseTest[] {
  let list = this.buildActions();
  list = this.mergeAutoMdAction(list);
  let id = 0;
  for (let row of list) {
    row.setTestId(`${this.testId}-${id++}`);
  }
  if (this.index == null) {
    return list;
  }
  return list.slice(0, this.index + 1);
}

private mergeAutoMdAction(list: BaseTest[]): BaseTest[] {
  if (this.autoMdFilePath == null) {
    return list;
  }
  const alreadyHas = list.some(
    (a) => a instanceof MdFileAction && a.getFilePath() === this.autoMdFilePath
  );
  if (alreadyHas) {
    return list;
  }
  return [new MdFileAction(this.autoMdFilePath), ...list];
}
```

**合并规则**：

| 规则 | 说明 |
|------|------|
| 插入位置 | 自动发现的 md 插入到 **buildActions 数组最前面**（步骤 0，便于运行前阅读说明） |
| 去重 | `buildActions` 中已含同路径 `MdFileAction` 时不再自动插入 |
| 手动 MdFileAction | 可在 `buildActions` 任意位置插入其他 md 文件 |

**clone 改造**：`TestCase.clone()` 需复制 `autoMdFilePath`、`sourceFilePath`，否则 `getTestCase` 克隆后丢失 md 关联。

```typescript
clone() {
  let ret = new (this.clazz)();
  ret.setTestId(this.getTestId());
  ret.setAutoMdFilePath(this.autoMdFilePath);
  ret.setSourceFilePath(this.sourceFilePath);
  return ret;
}
```

---

## 6. MdPathUtil 设计

**位置**：`src/util/MdPathUtil.ts`

根据传入路径（可能在 `src` 或 `dist` 下），解析成对的读写路径。

```typescript
interface MdPaths {
  srcPath: string;
  distPath: string;
}

static resolveSrcAndDist(filePath: string): MdPaths
```

**推导规则**（按优先级）：

1. 路径含 `\dist\` 或 `/dist/` → `distPath = filePath`，`srcPath = filePath.replace(/[\\/]dist[\\/]/, '/src/')`（扩展名 `.md` 不变）
2. 路径含 `\src\` 或 `/src/` → `srcPath = filePath`，`distPath = filePath.replace(/[\\/]src[\\/]/, '/dist/')`
3. 无法识别 → `srcPath` 与 `distPath` 均设为 `filePath`（仅写一处，并 console.warn）

**SaveMdFile** 使用 `MdPathUtil.resolveSrcAndDist` 后 `fs.writeFileSync` 写入两个路径（目录不存在则 `mkdirSync` recursive）。

---

## 7. HTTP 接口设计

沿用现有 `httpAction` 扫描注册机制，新增：

### 7.1 `/getMdFile`

**请求**：

```javascript
{
  filePath: "C:/jswork/supplyTest/dist/testCase/admin/FlowAdminUser.md"
  // 或使用 getTestCase 返回的 srcPath / distPath 之一
}
```

**响应**：

```javascript
{
  content: "# 标题\n\n正文...",
  srcPath: "...",
  distPath: "..."
}
```

**逻辑**：优先读 `distPath` 存在则读 dist，否则读 `srcPath`；文件不存在返回空字符串或 404 错误信息。

### 7.2 `/saveMdFile`

**请求**：

```javascript
{
  filePath: "...",   // 与 getMdFile 一致，用于解析双路径
  content: "..."     // md 源码
}
```

**响应**：

```javascript
{
  ok: true,
  srcPath: "...",
  distPath: "..."
}
```

**逻辑**：`MdPathUtil.resolveSrcAndDist` → 分别写入 src、dist；编码 UTF-8。

---

## 8. detail.html 界面设计

### 8.1 步骤列表

`renderActions` 不变；`buildLookDetailBtn` 已在 `couldLookDetail === true` 时显示「查看」。

`GetTestCase` 返回的 action 增加字段 `actionType: 'mdFile'` 时，前端识别为 md 步骤。

### 8.2 弹窗分支

`showStepDetails(stepId)` 根据步骤 metadata 分支：

| actionType | 弹窗内容 |
|------------|----------|
| 缺省 / http | 现有 URL、Headers、Params、Result、copymd、重新运行 |
| `mdFile` | md 预览 + 修改 + 保存 |

**md 弹窗结构**：

```html
<div class="modal-header">
  <button onclick="editMdFile()">修改</button>
  <button onclick="saveMdFile()">保存</button>  <!-- 编辑模式下显示 -->
</div>
<div id="modal-md-preview" class="md-preview"></div>
<textarea id="modal-md-source" style="display:none"></textarea>
```

**流程**：

1. 打开弹窗 → `http.post('/getMdFile', { filePath })`
2. 使用 `marked.parse(content)` 渲染到 `#modal-md-preview`
3. 点击「修改」→ 隐藏 preview，显示 textarea 填入源码
4. 点击「保存」→ `http.post('/saveMdFile', { filePath, content })` → toast 提示 → 重新渲染 preview

**Markdown 渲染**：在 `client/` 引入 `marked`（本地 `marked.min.js` 或 CDN），不增加服务端依赖。

### 8.3 与 copymd 的关系

- **copymd**：复制 HTTP 步骤的输入/输出（已有功能）
- **md 步骤**：独立文档，不提供 copymd，可提供「复制 md 源码」可选按钮（非必须，首版可不做）

---

## 9. 构建：md 文件复制

### 9.1 testflow

**`src/scripts/copyMd.ts`**（编译后在 `dist/scripts/copyMd.js` 执行，或 ts-node 直接跑 src 版）：

- 递归扫描 `src/**/*.md`
- 按相对路径复制到 `dist/` 对应位置
- 不删除 dist 中多余 md（仅覆盖/新增）

**`package.json`**：

```json
{
  "scripts": {
    "copyMd": "node dist/scripts/copyMd.js",
    "start": "tsc && npm run copyMd && node dist/main.js"
  }
}
```

`copyMd.ts` 需纳入 `tsc` 编译（放在 `src/scripts/` 下）。

### 9.2 supplyTest 等使用方

testflow 依赖安装后，通过 npm bin 命令 `testflow-copy-md` 复制 md（路径在 `node_modules/testflow` 内，无需相对路径指向 monorepo）：

```json
{
  "scripts": {
    "copyMd": "testflow-copy-md src dist",
    "start": "tsc && npm run copyMd && node dist/main.js"
  }
}
```

**首次 copyMd 实现可简化为**：

```typescript
// 参数: [srcRoot, distRoot]，默认 src=./src, dist=./dist
copyMdFiles(srcRoot, distRoot);
```

---

## 10. 使用示例

### 10.1 同名 md 自动关联

```
supplyTest/src/testCase/admin/
  FlowAdminUser.ts
  FlowAdminUser.md    ← 新增
```

启动 testflow Web 后打开 `FlowAdminUser` 详情，步骤 0 为 `FlowAdminUser`，可查看/编辑 md。

### 10.2 手动指定 md

```typescript
import { TestCase, BaseTest, MdFileAction } from 'testflow';

export default class extends TestCase {
  protected buildActions(): BaseTest[] {
    return [
      new MdFileAction('C:/jswork/supplyTest/doc/某说明.md'),
      new LoginAdmin(),
      // ...
    ];
  }
}
```

---

## 11. 数据结构汇总

### 11.1 getTestCase.actions[] 中 md 步骤

```javascript
{
  "id": "FlowAdminUser-0",
  "name": "FlowAdminUser",
  "status": "init",
  "couldLookDetail": true,
  "actionType": "mdFile",
  "filePath": "C:\\jswork\\supplyTest\\dist\\testCase\\admin\\FlowAdminUser.md",
  "srcPath": "C:\\jswork\\supplyTest\\src\\testCase\\admin\\FlowAdminUser.md",
  "distPath": "C:\\jswork\\supplyTest\\dist\\testCase\\admin\\FlowAdminUser.md"
}
```

### 11.2 HTTP 步骤（不变）

```javascript
{
  "id": "FlowAdminUser-1",
  "name": "管理员登录",
  "status": "init",
  "couldLookDetail": true
  // 无 actionType
}
```

---

## 12. 实施步骤建议

1. 实现 `MdPathUtil`、`copyMd.ts`
2. 实现 `MdFileAction`，导出到 `testflow.ts`
3. 改造 `TestRunner.scan`、`TestCase.getActions` / `clone`
4. 实现 `GetMdFile`、`SaveMdFile`
5. 改造 `detail.html` + 引入 marked
6. 更新 `package.json` start 脚本
7. supplyTest 增加示例 `FlowAdminUser.md` 并更新 start 脚本
8. 手工验证：查看、修改、保存后 src/dist 内容一致

---

## 13. 测试方案

| 项 | 验证方式 |
|----|----------|
| scan 发现同名 md | 放置 `TestXxx.md`，getTestCase 返回多一步骤 |
| 自动步骤在最前 | 步骤 id 为 `{caseId}-0` |
| 手动 MdFileAction | buildActions 插入指定路径，弹窗可读 |
| 去重 | 同名 md 自动 + 手动只出现一次 |
| doTest 无副作用 | 运行用例变量与无 md 时一致 |
| 双写保存 | 修改保存后 src、dist 文件内容相同 |
| js 模式 | 仅 dist 运行时，get/save 仍正确写 src |
| copyMd 构建 | npm start 后 dist 下存在 md |

单元测试（可选）：对 `MdPathUtil.resolveSrcAndDist` 做路径解析用例。

---

## 14. 注意事项

1. **路径安全**：`GetMdFile` / `SaveMdFile` 应限制只能访问测试项目 `src` / `dist` 目录下的 `.md` 文件，避免任意路径读写（校验路径包含 `testCase` 或以注册的 `testPath` 为根）。
2. **并发保存**：首版不做锁；多人同时编辑同一 md 以最后保存为准。
3. **编码**：统一 UTF-8。
4. **大文件**：首版不做分页；超大 md 可后续加限制提示。
5. **与 Test 前缀**：测试文件命名惯例不变；md 文件名与 ts/js ** basename 相同** 即可，不要求 Test 前缀。
