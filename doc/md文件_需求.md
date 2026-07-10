# 总体介绍
支持在具体的testCase显示md文件。

## 需求详解
1. 允许用户在测试用例的相同目录放一个同名的md文件。显示在detail.html中。
2. 允许用户在重写TestCase.buildActions，插入一个MdFileAction。该action的执行方法为空（执行不产生任何操作）。这个类有一个构造函数，为filePath：md文件所在的绝对路径。在detail.html中，该步骤有一个查看按钮，点击查看出现弹窗以html的形式显示md内容。同时上面有修改按钮。点击以后弹出修改md的源码，点击后直接保存。

## 代码修改点
- detail.html
- MdFileAction 实现。
- TestRunner.scan方法，需要扫描md文件。
- TestCase.getActions,如果相同目录有一个同名md文件，需要产生一个MdFileAction的实例，和buildAction的数组结合在一起，产生新的数组。
- npm start 命令需要将src目录下的md文件copy到dist文件。

## 注意
保存md文件的时候，需要dist目录和src目录都保存一份。因为程序会运行在js模式和ts模式。