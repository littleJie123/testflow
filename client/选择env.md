# 总体介绍
在detail.html中运行测试可以选择合适的环境（env）进行运行。
## 界面改动
在detail.html 运行测试的左边增加下拉菜单，允许用户选择环境。  
下拉菜单内容，从listEnv中读取。 
listEnv返回格式如下：  
``` json
{
  "result":{
    "list":[
      {"env":"local","host":"http://127.0.0.1/"},
      {"env":"test","host":"http://test/"}
    ]
  }
}
```

## 运行测试
在detail.html 中运行测试时，需要将选择的环境传递给后端。  
在原有的参数上加上env，env为下拉菜单中选中的值的env属性。


