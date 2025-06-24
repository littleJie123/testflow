class Util{
  static getId(id){
    let ids = id.split("_");
    return ids[ids.length-1];
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

  static renderStatus(status){
    let div = document.getElementById("statusDiv");
    div.innerText ="状态："+ Util.getStatusText(status);
    div.className = 'test-case '+ status;
  }

  static initStatus(){
    let div = document.getElementById("statusDiv");
    div.innerText ="开始运行" ;
    div.className = 'test-case ';
  }
}