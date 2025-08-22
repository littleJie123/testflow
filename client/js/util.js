class Util {
  static getId(id) {
    let ids = id.split("_");
    return ids[ids.length - 1];
  }

  static getStatusText(status) {
    const statusMap = {
      init: '初始化',
      running: '运行中',
      processed: '成功',
      error: '失败'
    };
    return statusMap[status] || status;
  }

  static renderStatus(status) {
    let div = document.getElementById("statusDiv");
    div.innerText = "状态：" + Util.getStatusText(status);
    div.className = 'test-case ' + status;
  }

  static initStatus() {
    let div = document.getElementById("statusDiv");
    div.innerText = "开始运行";
    div.className = 'test-case ';
  }

  static highlightJson(json) {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, null, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      }
      else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      }
      else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }
}