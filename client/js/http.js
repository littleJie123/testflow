class Http {


  constructor() {
    this.id = 1;
    this.socket = null;
    this.idMap = {}
    this.onConnect = [];
    this.eventMap = {};
  }

  on(event, callback) {
    if (!this.eventMap[event]) {
      this.eventMap[event] = [];
    }
    this.eventMap[event].push(callback);
  }

  post(url, param) {
    let self = this;

    return new Promise((resolve, reject) => {
      function sendRequest() {
        self.idMap[self.id] = resolve;
        self.socket.send(JSON.stringify({
          id: self.id,
          url,
          param
        }))

        self.id++
      }
      if (this.socket == null || this.socket.readyState !== WebSocket.OPEN) {
        this.connect();
        this.onConnect.push(sendRequest);
      } else {
        sendRequest();
      }
    });

  }

  connect() {
    if (this.connecting) {
      return;
    }
    this.connecting = true; // 标记正在连接
    console.log('正在连接WebSocket服务器...');

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const socketUrl = `${protocol}//${host}`;
    const socket = new WebSocket(socketUrl);
    let self = this;
    socket.onopen = function (event) {
      console.log('已连接到WebSocket服务器');
      if (self.onConnect != null) {
        self.onConnect.forEach(callback => callback());
        self.onConnect = []; // 清空回调数组
        self.connecting = false; // 标记连接已建立
      }
    };

    socket.onmessage = function (event) {
      let data = JSON.parse(event.data);
      if (data.id) {
        let fun = self.idMap[data.id];
        if (fun) {
          fun(data.result);
          delete self.idMap[data.id];
        }
      }

      let array = self.eventMap[data.action];
      if (array) {
        array.forEach(callback => {
          callback(data.result);
        });
      }
    };

    socket.onclose = function (event) {
      console.log('与WebSocket服务器的连接已关闭');
    };
    this.socket = socket;
  }

  static ins;
  static get() {
    if (!Http.ins) {
      Http.ins = new Http();
    }
    return Http.ins;
  }
}
Http.get();
Http.get().on(
  'runStatus',
  function (data) {
    let div = document.getElementById(data.id);
    if (div) {
      div.className = 'test-case ' + data.status;
    }else{
      let toolbar = document.getElementById('statusDiv');
      if (toolbar) {
        let clazzName = toolbar.className;
        if(clazzName != null){
          clazzName = clazzName.split(' ')[0];
        }else{
          clazzName = ''
        }
        toolbar.className = clazzName + ' ' + data.status;
        toolbar.innerText = getStatusText(data.status);
      }
    }
  }
)
Http.get().on(
  'log',
  function (log) {
    const logsList = document.getElementById('logsList');
    if (logsList == null) {
      return;
    }
    logsList.innerHTML += `
    <div class="log-item ${log.type}" 
          style="padding-left: ${log.level * 20}px"
          onclick="toggleStack(this)">
        <div class="log-message">${log.message}</div>
        ${log.stack ? `<pre class="log-stack">${log.stack}</pre>` : ''}
    </div>
`
  }

)
// 获取状态文本
function getStatusText(status) {
  const statusMap = {
    init: '初始化',
    running: '运行中',
    processed: '成功',
    error: '失败'
  };
  return statusMap[status] || status;
}
Http.get().connect();


