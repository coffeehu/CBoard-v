# CBoard-v

CBoard-v 是个人项目，目的是使用 Vue 2.0 重写 CBoard 的前端部分。

CBoard 是一个他人开源的 BI 工具，用于生成可视化报表。[（项目原地址）](https://github.com/TuiQiao/CBoard)  

因为 CBoard 的前端是由 AngularJs（1.4.x）构建的，考虑到目前的前端生态，为了方便以后的二次开发和维护，因此决定用 Vue 重写。

### [在线演示](http://www.hcbook.cc/cboard/)
账号：admin  
密码：root123

## 技术栈
Vue + Vue Router + Vuex + Element-UI

## 新的特性
根据业务的需要，新增了一些特性；  
如可以定制更复杂的布局、调整背景色：  
![image](./doc/gridster.png)

## 部署
### （前提）Step 0：部署 CBoard 后台
请根据 CBoard 的官方文档部署好完整的项目，确保能访问。
[github](https://github.com/TuiQiao/CBoard)
[安装与配置](https://peter_zhang921.gitee.io/cboard_docsify/#/zh-cn/manual/install)

### Step 1: 编译打包 CBoard-v
clone 本项目，  
npm install,  
npm run build  

生成文件index.html 和目录static

### Step 2: 
将目录 static 加入cboard根目录下，  
将 index.html 改名为 starter.html 替换cboard根目录下原来的文件。

### 开发调试