# 一个接口测试编排工具

## 为何要写这个？
1. postman只能测试单个接口，想把业务中的接口串联起来测试比较困难
2. 测试完了，验证是否正确，postman之类的软件比较难比较,也很难操作数据库
3. 与jest相比，jest可以做单元测试，但是准备数据环节也比较麻烦



## 和postman相比的劣势
postman是通过界面来配置接口请求，testFlow是通过代码来配置接口请求，不过对于程序员来说这应该不成问题

## 例子
|步骤|详情|类别|
|--|--|--|
|1.注册用户 |注册一个新用户|接口测试|
|2.保存用户|保存信息到测试上下文，以便以后的接口使用|接口后处理|
|3.请求商品列表|将商品信息构成一个map，保存在测试上下文中|接口后处理|
|4.发送订单|使用商品列表，发送订单|接口测试|
|5.订单入库|订单入库|接口测试|
|5.1 更改订单日期|更改订单日期|接口测试|
|6结算订单|结算订单|接口测试|

如上所示，testFlow可以把接口串联起来，形成一个闭环进行测试

## testFlow的好处
1. 可以把接口串联起来测试
2. 可以通过插件注入自己的业务，例如查询数据库，执行测试后验证数据库数据是否正确
3. 可以通过配置模板生成测试参数
