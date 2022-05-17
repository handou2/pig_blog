

In the project directory, you can run:

### `npm run dev`

启动项目前别忘了安装依赖: `npm i`

### `Blog`


因为我们需要模块化添加样式,本项目采用 sass.

npm 命令:`npm i sass`.

下一步:安装我们的样式文件.

antd:`npm add antd` (别忘了在 src/App.css 文件顶部引入 `@import '~antd/dist/antd.css';`).

我们看到 antd 里面还有一些高级配置:自定义主题 本项目就不再配置,采用默认主题.

好的现在来看一下本项目的架构:.
```
├── README.md
├── next-env.d.ts
├── next.config.js
├── package.json
├── pages
│   ├── _app.tsx
│   ├── api
│   └── index.tsx
├── public
│   ├── favicon.ico
│   └── vercel.svg
├── styles
│   ├── Home.module.css
│   └── globals.css
├── tsconfig.json
└── yarn.lock  
```
next.config.js：next.js 相关配置  

tsconfig.json：typescript 相关配置  

.eslintrc.json：eslint 相关配置  

pages：存放页面文件，声明式路由，文件名即路由  

public：存放静态资源文件  

styles：存放公共样式文件  

安装 axios: `npm i axios.`  

关于路由：  
在 Next.js 中，当在 pages/ 目录下添加一个文件或者目录的时候，就会自动创建一个路由，文件即路由。

关于 toastify:

这里推荐一个消息弹出提示库,地址:https://github.com/fkhadra/react-toastify.  

为了方便使用我们这里需要对 toastify 进行一些封装:`npm install --save react-toastify`.  

本项目将封装成一个组件,并在 index.tsx 中引入.

网站的测试和部署:  
