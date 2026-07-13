# 项目简介
本项目是一个测试接口编排网站。
## 重要
每次修改代码后，将修改记录生成到根目录的update.md文件下。

## 客户端代码
存放在client 目录下，技术栈为纯js+dom编程

## 服务端代码
存放在src目录下，技术栈为ts + nodejs

### 数据结构
接口运行参数包

``` javascript
{
  url:'jjjjjj/jjjj', //请求url
  param:{aa:123}, //提交参数
  method:'post',
  headers:{bbbbb:12443},
  result:{result:'succ'} //运行结果
}
```

## 功能

### 显示接口运行参数
上端运行接口后，会通过websocket将“接口运行参数包” 发送到客户端。该功能已经实现，查看urlAction.ts的63行代码。  
在detail.html页面，点击步骤，出现弹窗，在弹窗中根据步骤id获得对应的接口运行参数，显示运行状态 。 
#### 显示日志
点击查看后，右边的日志将当前步骤的日志设到当前屏幕【可能日志太多被放到下面】。同时将
  
日志的数据包中增加id，表示为那个步骤产生的日志。  
日志包格式如下:
``` javascript
{
  "type":"error",
  level:3 ,//等级
  message:'出错了',
  id:'test1' //产生日志的步骤id
}
```  

### 重新运行步骤
在detail.html的“查看”弹窗中，增加一个“重新运行”按钮，点击以后将{param,url,method,headers} 提交到服务端的runHttp接口（调用Http.post方法）。  
同时将返回的数据重新渲染在弹窗的result区域，同时增加result区域的3次闪烁  
把headers和param的区域改成textarea，允许用户修改headers和param  


