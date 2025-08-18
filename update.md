# 代码修改记录 (2025-08-16)

本次更新动态调整了日志面板的高度，以优化页面布局。

---

### `client/detail.html`

#### 1. 动态调整日志面板高度

新增了`adjustLogPanelHeight` JavaScript函数，用于动态调整右侧日志面板的高度。该函数会确保日志面板的高度至少为一屏幕高度，或者与左侧步骤面板的高度保持一致（当步骤面板高于一屏幕时）。

```javascript
function adjustLogPanelHeight() {
  const actionsPanel = document.querySelector('.actions-panel');
  const logsPanel = document.querySelector('.logs-panel');
  const windowHeight = window.innerHeight;
  const actionsHeight = actionsPanel.offsetHeight;

  if (actionsHeight > windowHeight) {
    logsPanel.style.height = `${actionsHeight}px`;
  } else {
    logsPanel.style.height = `${windowHeight}px`;
  }
}

window.addEventListener('resize', adjustLogPanelHeight);

// MutationObserver to watch for changes in the actions list
const observer = new MutationObserver(adjustLogPanelHeight);
observer.observe(document.getElementById('actionsList'), { childList: true, subtree: true });
```

在渲染测试步骤后，会调用`adjustLogPanelHeight`函数以确保日志面板的高度被正确设置。

```javascript
renderActions(data.actions || []);
adjustLogPanelHeight();
```

### `client/css/index.css`

#### 1. 移除日志面板固定高度

移除了`.logs-panel`的固定高度样式，以便JavaScript能够动态调整其高度。

```diff
.logs-panel {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;
    display: flex;
    flex-direction: column;
-   height: calc(100vh - 20px);
    word-wrap: break-word;
}
```

# 代码修改记录 (2025-08-15)

本次更新优化了测试步骤的按钮布局、日志显示功能和弹窗内容。

---

### `client/css/index.css`

#### 1. 步骤按钮自动换行

为了防止步骤的按钮在某些情况下溢出，我们为 `.action-buttons` 容器增加了 `flex-wrap: wrap;` 样式。当按钮的总宽度超过容器宽度时，按钮会自动换行显示，避免了布局错乱。

```diff
.action-buttons {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
+   flex-wrap: wrap;
}
```

### `client/detail.html`

#### 1. 在弹窗中显示步骤的运行状态

修改了 `showStepDetails` 函数，现在当用户点击“查看”按钮时，弹窗中会额外显示当前步骤的运行状态（如：初始化、运行中、成功、失败）。

```javascript
function showStepDetails(stepId) {
  const data = stepData[stepId];
  const stepElement = document.getElementById(stepId);
  let status = '未知';
  if (stepElement) {
    const statusClass = Array.from(stepElement.classList).find(c => ['init', 'running', 'processed', 'error'].includes(c));
    if (statusClass) {
      status = getStatusText(statusClass);
    }
  }

  if (data) {
    modalContent.innerHTML = `
            <div class="modal-header">
                <button class="btn" onclick="rerunAction('${stepId}')">重新运行</button>
            </div>
            <p><strong>Status:</strong> ${status}</p>
            <p><strong>URL:</strong> <span id="modal-url">${data.url}</span></p>
            ...
        `;
    stepModal.style.display = "block";
  } else {
    modalContent.innerHTML = `<p>No data available for this step.</p>`;
    stepModal.style.display = "block";
  }
}
```

#### 2. 实时显示测试日志

新增了对 WebSocket `log` 事件的监听。当收到新的日志消息时，会动态地在右侧日志面板中创建并追加一个新的日志条目，实现了日志的实时显示。

```javascript
http.on('log', function (msg) {
  const logsList = document.getElementById('logsList');
  const logElement = document.createElement('div');
  logElement.classList.add('log-item', msg.type);
  logElement.dataset.stepId = msg.id;
  logElement.textContent = msg.message;
  logElement.onclick = () => scrollToStep(msg.id);
  logsList.appendChild(logElement);
});
```

#### 3. 修正按钮文本错误

修复了一个UI上的文本错误，将一个错误的“日志”按钮文本更正为“运行”。

```diff
- <button class="btn" onclick=runTestCase(${index})>日志</button>
+ <button class="btn" onclick=runTestCase(${index})>运行</button>
```


# 代码修改记录 (2025-08-14)

本次更新在`detail.html`页面增加了多个功能并修复了一个bug，优化了用户体验。

---

### `client/detail.html`

#### 1. 修复步骤状态不更新的Bug

修复了运行测试后，步骤状态始终显示为“初始化”的bug。

-   **新增 `runStatus` 事件处理**：添加了对 WebSocket `runStatus` 事件的监听。当接收到状态变更消息时，会动态更新对应步骤的UI，包括状态样式和文本。
-   **兼容后端状态拼写错误**：`getStatusText` 函数增加了对后端错误拼写 `runing` 的兼容处理，确保“运行中”状态能正确显示。

```diff
-     http.on('httpParam', function (msg) {
-       stepData[msg.id] = msg;
-     });
+     http.on('httpParam', function (msg) {
+       stepData[msg.id] = msg;
+     });
+ 
+     http.on('runStatus', function (msg) {
+       const stepElement = document.getElementById(msg.id);
+       if (stepElement) {
+         stepElement.classList.remove('processed', 'error', 'running', 'init', 'runing');
+         let status = msg.status;
+         if(status === 'runing'){
+             status = 'running';
+         }
+         stepElement.classList.add(status);
+         const statusTxt = stepElement.querySelector('.statusTxt');
+         if (statusTxt) {
+           statusTxt.textContent = '状态: ' + getStatusText(msg.status);
+         }
+       }
+     });
```

```diff
-     function getStatusText(status) {
-       const statusMap = {
-         init: '初始化',
-         running: '运行中',
-         processed: '成功',
-         error: '失败'
-       };
-       return statusMap[status] || status;
-     }
+     function getStatusText(status) {
+       const statusMap = {
+         init: '初始化',
+         running: '运行中',
+         runing: '运行中',
+         processed: '成功',
+         error: '失败'
+       };
+       return statusMap[status] || status;
+     }
```

#### 2. 点击运行后重置步骤状态

点击“运行测试”按钮后，会先将所有步骤的状态在前端重置为“初始化”，然后再向服务器发送运行请求。

```diff
-     async function runTestCase() {
-       try {
-         Util.initStatus();
-         const logsList = document.getElementById('logsList');
-         if (logsList) {
-           logsList.innerHTML = ''; // 清空日志列表
-         }
-         await http.post('/runTestCase', { id: [testCaseId] });
- 
- 
-       } catch (error) {
-         console.error('运行测试用例失败:', error);
-       }
-     }
+     async function runTestCase() {
+       try {
+         const actionItems = document.querySelectorAll('.action-item');
+         actionItems.forEach(item => {
+           item.classList.remove('processed', 'error', 'running', 'init');
+           item.classList.add('init');
+           const statusTxt = item.querySelector('.statusTxt');
+           if (statusTxt) {
+             statusTxt.textContent = '状态: 初始化';
+           }
+         });
+ 
+         Util.initStatus();
+         const logsList = document.getElementById('logsList');
+         if (logsList) {
+           logsList.innerHTML = ''; // 清空日志列表
+         }
+         await http.post('/runTestCase', { id: [testCaseId] });
+ 
+ 
+       } catch (error) {
+         console.error('运行测试用例失败:', error);
+       }
+     }
```

#### 3. 修复状态文本`id`重复的问题

在渲染步骤时，将原先重复的 `id='statusTxt'` 修改为 `class='statusTxt'`，以确保DOM元素的唯一性。

```diff
-                         <div id='statusTxt'>状态: ${getStatusText(action.status)}</div>
+                         <div class="statusTxt">状态: ${getStatusText(action.status)}</div>
```

#### 4. 新增“跳到出错”按钮

在“运行测试”按钮旁边，增加了一个“跳到出错”按钮，方便快速定位到失败的步骤。

```diff
-   <div class="toolbar" id="toolbar">
-     <button class="btn" onclick="runTestCase()">运行测试</button>
-   </div>
+   <div class="toolbar" id="toolbar">
+     <button class="btn" onclick="runTestCase()">运行测试</button>
+     <button class="btn" onclick="jumpToError()">跳到出错</button>
+   </div>
```

#### 5. 实现“跳到出错”功能

新增 `jumpToError()` JavaScript 函数。点击按钮后，该函数会查找页面上第一个状态为“失败”的测试步骤，并自动将页面滚动到该步骤的位置。

```javascript
function jumpToError() {
  const errorStep = document.querySelector('.action-item.error');
  if (errorStep) {
    errorStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    alert('没有发现错误的步骤');
  }
}
```

#### 6. 新增底部工具栏

当测试步骤数量大于16个时，在页面底部额外显示一个工具栏，方便长页面下的操作。

```diff
-   <div id="stepModal" class="modal">
+   <div class="toolbar" id="bottomToolbar" style="display: none; margin-top: 1rem;">
+     <button class="btn" onclick="runTestCase()">运行测试</button>
+     <button class="btn" onclick="jumpToError()">跳到出错</button>
+   </div>
+ 
+   <div id="stepModal" class="modal">
```

#### 7. 动态显示底部工具栏

修改 `renderActions()` 函数，在渲染完测试步骤后，会检查步骤总数。如果步骤数量大于16，则显示底部的工具栏。

```diff
-     `).join('');
-     }
+     `).join('');
+       
+       const bottomToolbar = document.getElementById('bottomToolbar');
+       if (actions.length > 16) {
+         bottomToolbar.style.display = 'flex';
+       } else {
+         bottomToolbar.style.display = 'none';
+       }
+     }
```

---

# 代码修改记录 (2025-08-11)

本次更新优化了`detail.html`页面的布局，解决了右侧日志内容过长时挤压左侧步骤列表的问题。

---

### `client/css/index.css`

#### 1. 采用响应式布局以防止屏幕溢出

为了解决内容超出屏幕宽度的问题，将 `.detail` 容器的布局从固定宽度修改为百分比宽度。现在，左侧步骤面板和右侧日志面板的宽度比例为 `65%` 和 `35%`，这使得布局能够根据不同的屏幕尺寸进行自适应，避免了水平滚动条的出现。

```diff
- .detail{
-   display: grid;
-   gap: 1rem;
-   grid-template-columns: 900px 1fr;
- }
+ .detail{
+   display: grid;
+   gap: 1rem;
+   grid-template-columns: 65% 35%;
+ }
```

#### 2. 增加日志内容自动换行

为右侧的日志面板（`.logs-panel`）添加了 `word-wrap: break-word;` 样式，确保当单行日志内容过长时能够自动换行，而不是水平溢出。

```diff
- .logs-panel {
-     flex: 1;
-     border: 1px solid #ddd;
-     border-radius: 4px;
-     padding: 15px;
-     display: flex;
-     flex-direction: column;
-     height: calc(100vh - 20px);
- }
+ .logs-panel {
+     flex: 1;
+     border: 1px solid #ddd;
+     border-radius: 4px;
+     padding: 15px;
+     display: flex;
+     flex-direction: column;
+     height: calc(100vh - 20px);
+     word-wrap: break-word;
+ }
```

---

# 代码修改记录 (2025-08-10)

本次更新对卡片式布局进行了精细调整，以确保布局的稳定性、可读性和美观性。

---

### `client/css/index.css`

#### 1. 全局设置 `box-sizing`

在样式文件顶部添加了 `box-sizing: border-box;` 的全局规则。这修复了因 `padding` 和 `border` 导致卡片宽度计算不准的问题，确保一行能够稳定显示4个卡片。

```diff
+ *, *::before, *::after {
+   box-sizing: border-box;
+ }
```

#### 2. 优化卡片宽度与名称换行

-   将 `.action-item` 的 `flex` 属性修改为 `calc(25% - 0.75rem)`，更精确地适配了4列布局下的 `gap` 间距。
-   为卡片标题 `<h3>` 添加了 `overflow-wrap: break-word;` 和 `word-break: break-all;` 样式，强制长文本换行，防止其撑破卡片布局。

```diff
- .actions-panel .action-item {
-     flex: 1 1 calc(25% - 1.5rem);
+ .actions-panel .action-item {
+     flex: 1 1 calc(25% - 0.75rem); /* Corrected width for 4 items with 1rem gap */
...
+ .action-info h3 {
+     margin-top: 0;
+     font-size: 1em; /* Adjust font size if needed */
+     overflow-wrap: break-word;
+     word-break: break-all;
+ }
```

### `client/detail.html`

#### 1. 为步骤卡片添加数字编号

修改了 `renderActions` 函数，利用 `map` 方法的 `index` 参数，为每个测试步骤的名称前增加了从0开始的数字编号，使其更清晰有序。

```diff
-       actionsList.innerHTML = actions.map(action => `
+       actionsList.innerHTML = actions.map((action, index) => `
...
-                         <h3>${action.name}</h3>
+                         <h3>${index}. ${action.name}</h3>
```

---

# 代码修改记录 (2025-08-10)

本次更新将测试步骤的列表视图修改为更加节省空间的卡片式网格布局。

---

### `client/css/index.css`

#### 1. 步骤列表改为卡片式布局

为了优化空间利用率，我们将原有的垂直列表布局改为了多列卡片式布局。

-   为步骤容器 `#actionsList` 添加了 `display: flex` 和 `flex-wrap: wrap` 属性，使其成为一个支持换行的弹性容器。
-   修改了 `.action-item` 的样式，使其表现为卡片。主要包括：
    -   使用 `flex: 1 1 calc(25% - 1.5rem)` 设置卡片宽度，实现一行显示4张卡片的效果。
    -   将卡片内部布局改为 `flex-direction: column`，使内容垂直排列。
    -   增加了 `border` 和 `box-shadow`，增强了卡片的视觉效果。
    -   添加了简单的 `:hover` 效果，提升了交互性。

```diff
- .actions-panel .action-item {
-     padding: 10px;
-     margin-bottom: 10px;
-     border-radius: 4px;
-     display: flex;
-     justify-content: space-between;
-     align-items: center;
-     transition: background-color 0.3s;
- }
+ #actionsList {
+     display: flex;
+     flex-wrap: wrap;
+     gap: 1rem;
+ }
+ 
+ .actions-panel .action-item {
+     flex: 1 1 calc(25% - 1.5rem);
+     border: 1px solid #ddd;
+     box-shadow: 0 2px 4px rgba(0,0,0,0.05);
+     padding: 10px;
+     border-radius: 4px;
+     display: flex;
+     flex-direction: column;
+     justify-content: space-between;
+     transition: background-color 0.3s, box-shadow 0.3s;
+     min-width: 180px;
+ }
+ 
+ .actions-panel .action-item:hover {
+     box-shadow: 0 4px 8px rgba(0,0,0,0.1);
+ }
```

---

# 代码修改记录 (2025-08-10)

本次更新优化了点击日志后的交互效果，将步骤高亮从单次闪烁改为多次闪烁。

---

### `client/detail.html`

#### 1. 优化步骤高亮效果

修改了 `scrollToStep` 函数中的高亮逻辑。现在，当点击日志定位到步骤时，对应步骤的背景会连续闪烁3次，以提供更明显的视觉反馈。

-   使用 `setInterval` 代替了原有的 `setTimeout`。
-   通过 `classList.toggle` 方法在固定的时间间隔内（300毫秒）切换高亮类，总共切换6次（3次亮起，3次熄灭）。
-   在闪烁结束后，通过 `clearInterval` 清除定时器，并确保高亮样式被移除。

```diff
-         // Add highlight class
-         stepElement.classList.add('step-highlight');
- 
-         // Remove highlight class after a delay
-         setTimeout(() => {
-           stepElement.classList.remove('step-highlight');
-         }, 1500); // Keep highlight for 1.5 seconds
+         let blinkCount = 0;
+         const maxBlinks = 6; // 3 flashes (on/off is one flash, so 3*2=6)
+         const blinkInterval = setInterval(() => {
+             stepElement.classList.toggle('step-highlight');
+             blinkCount++;
+             if (blinkCount >= maxBlinks) {
+                 clearInterval(blinkInterval);
+                 // Ensure the class is removed at the end
+                 stepElement.classList.remove('step-highlight');
+             }
+         }, 300); // Blink every 300ms
```

---

# 代码修改记录 (2025-08-10)

本次更新增加了用户交互功能，允许通过点击日志来定位并高亮显示相关的测试步骤。

---

### 新功能：点击日志定位步骤

当用户点击右侧日志面板中的任意一条日志时，页面会自动平滑滚动到左侧对应的测试步骤，并且该步骤的背景会短暂高亮（闪烁一下），以方便用户快速定位。

### `client/detail.html`

#### 1. 为日志条目添加点击事件

在 `renderLogs` 函数中，为每个生成的日志 `div` 添加了 `onclick="scrollToStep('${log.id}')"` 事件，将日志的ID传递给新的处理函数。

```diff
-     <div class="log-item ${log.type}" data-step-id="${log.id}" onclick="toggleStack(this)">
+     <div class="log-item ${log.type}" data-step-id="${log.id}" onclick="scrollToStep('${log.id}')">
```

#### 2. 实现步骤滚动与高亮功能

新增 `scrollToStep(stepId)` 函数。该函数负责：
-   通过 `document.getElementById()` 查找对应的步骤元素。
-   调用 `scrollIntoView()` 方法将步骤滚动到屏幕中央。
-   为步骤元素添加 `step-highlight` 类以改变背景色，并使用 `setTimeout` 在1.5秒后移除该类，从而实现闪烁效果。

```javascript
function scrollToStep(stepId) {
    const stepElement = document.getElementById(stepId);
    if (stepElement) {
        stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add highlight class
        stepElement.classList.add('step-highlight');
        
        // Remove highlight class after a delay
        setTimeout(() => {
            stepElement.classList.remove('step-highlight');
        }, 1500); // Keep highlight for 1.5 seconds
    }
}
```

### `client/css/index.css`

#### 1. 增加步骤高亮样式

添加了 `.action-item.step-highlight` 类，用于定义步骤在被高亮时的背景色，并增加了平滑的过渡效果。

```diff
+ .action-item.step-highlight {
+     background-color: #fff3cd !important; /* A light yellow color */
+     transition: background-color 0.5s ease;
+ }
```

#### 2. 修正日志面板高度

再次将 `.logs-panel` 的 `height` 修正为 `calc(100vh - 200px)`，以确保日志面板在视口内正确显示并独立滚动。


# 代码修改记录 (2025-08-09)

本次更新在`detail.html`页面中增加了多个功能并优化了样式。

---

### `client/detail.html`

#### 1. 动态设置页面标题

在获取测试用例数据后，会自动将页面的 `<title>` 设置为用例的 `name` 属性，以便在浏览器标签页上更清晰地展示当前查看的用例。

```diff
-         document.getElementById('pageTitle').textContent = data.name+`[ ${testCaseId} ]`;
+         document.getElementById('pageTitle').textContent = data.name+`[ ${testCaseId} ]`;
+         document.title = data.name;
```

#### 2. 新增“复制结果”功能

在步骤详情弹窗中，增加了一个“copy result”按钮，用户点击后可以将 `result` 的内容复制到剪贴板。

-   在 `showStepDetails` 函数中，添加了该按钮。
-   新增 `copyResult` 函数，通过 `navigator.clipboard.writeText()` 实现复制功能，并提供成功或失败的提示信息。

```diff
+                 <p>
+                     <strong>Result:</strong>
+                     <button class="btn" onclick="copyResult()">copy result</button>
+                 </p>
                  <pre id="modal-result">${JSON.stringify(data.result, null, 2)}</pre>
...
+     function copyResult() {
+         const resultText = document.getElementById('modal-result').innerText;
+         navigator.clipboard.writeText(resultText).then(() => {
+             alert('Result copied to clipboard!');
+         }, () => {
+             alert('Failed to copy result to clipboard.');
+         });
+     }
```

### `client/css/index.css`

#### 1. 固定日志区域高度并启用滚动

为了防止日志内容过长导致页面无限延伸，我们对日志面板的样式进行了调整：
-   将 `.logs-panel` 设置为 flex 布局，并为其定义了固定的高度（`calc(90vh - 100px)`），使其高度接近屏幕高度。
-   为日志列表 `#logsList` 添加了 `overflow-y: auto` 和 `flex-grow: 1` 样式，当日志内容超出固定高度时，会出现独立的垂直滚动条。

```diff
- .actions-panel, .logs-panel {
-     flex: 1;
-     border: 1px solid #ddd;
-     border-radius: 4px;
-     padding: 15px;
- }
+ .actions-panel {
+     flex: 1;
+     border: 1px solid #ddd;
+     border-radius: 4px;
+     padding: 15px;
+ }
+ 
+ .logs-panel {
+     flex: 1;
+     border: 1px solid #ddd;
+     border-radius: 4px;
+     padding: 15px;
+     display: flex;
+     flex-direction: column;
+     height: calc(90vh - 100px);
+ }
+ 
+ #logsList {
+     overflow-y: auto;
+     flex-grow: 1;
+ }
```

# 代码修改记录 (2025-08-08)

本次更新主要是对“重新运行”弹窗的布局进行了优化，以提升用户体验。

---

### `client/detail.html`

#### 1. 调整弹窗布局

在 `showStepDetails` 函数中，我们对弹窗的内部 HTML 结构进行了调整：
-   将“重新运行”按钮从弹窗底部移动到了顶部，并包裹在一个带有 `.modal-header` 类的新 `div` 中，使其在视觉上更突出。
-   将 `headers` 和 `param` 的 `textarea` 的 `rows` 属性从 `5` 增加到了 `8`，为用户提供了更大的编辑空间。

```diff
-                 <p><strong>Headers:</strong></p>
-                 <textarea id="modal-headers" rows="5">${JSON.stringify(data.headers, null, 2)}</textarea>
-                 <p><strong>Params:</strong></p>
-                 <textarea id="modal-params" rows="5">${JSON.stringify(data.param, null, 2)}</textarea>
-                 <div class="modal-footer">
-                     <button class="btn" onclick="rerunAction('${stepId}')">重新运行</button>
-                 </div>
+                 <div class="modal-header">
+                     <button class="btn" onclick="rerunAction('${stepId}')">重新运行</button>
+                 </div>
... (省略部分代码)
+                 <textarea id="modal-headers" rows="8">${JSON.stringify(data.headers, null, 2)}</textarea>
+                 <p><strong>Params:</strong></p>
+                 <textarea id="modal-params" rows="8">${JSON.stringify(data.param, null, 2)}</textarea>
```

### `client/css/index.css`

#### 1. 新增弹窗头部样式

为了配合 HTML 的结构调整，我们新增了 `.modal-header` 的样式，为顶部的按钮区域添加了下边框和间距，使其与内容区域在视觉上有所区分。

```diff
+ .modal-header {
+     padding-bottom: 10px;
+     margin-bottom: 10px;
+     border-bottom: 1px solid #e5e5e5;
+ }
```

---

### *上次更新（已合并）*

- **功能**: 严格按照 `gemini.md` 的要求，在弹窗中实现了“重新运行步骤”的完整功能。