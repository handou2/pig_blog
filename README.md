
Next.js全栈项目

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

.stylelintrc.json:样式相关规则配置  
```
 "rules": {
        "selector-class-pattern": "^[a-z][a-zA-Z0-9]+$"
    }
```

pages：存放页面文件，声明式路由，文件名即路由  

public：存放静态资源文件  

styles：存放公共样式文件  

安装 axios: `npm i axios.`  

关于路由：  
在 Next.js 中，当在 pages/ 目录下添加一个文件或者目录的时候，就会自动创建一个路由，文件即路由。  
比如:   
Index 路由 
```
pages/index.js → /
pages/blog/index.js → /blog
```  
嵌套路由 
```
pages/blog/first-post.js → /blog/first-post
pages/dashboard/settings/username.js → /dashboard/settings/username
```  
动态路由 
```
pages/blog/[slug].js → /blog/:slug (/blog/hello-world)
pages/[username]/settings.js → /:username/settings (/foo/settings)
pages/post/[...all].js → /post/* (/post/2020/id/title)
```  
pages/post/[…all].js 叫作 catch-all 路由， /post/* 下的所有页面路径都会被响应。  

关于 toastify:

这里推荐一个消息弹出提示库,地址:https://github.com/fkhadra/react-toastify.  

为了方便使用,我们这里需要对 toastify 进行一些封装:`npm install --save react-toastify`.  

本项目将封装成一个组件,并在 index.tsx 中引入.


使用绝对引入的方式来 import 代码:在 tsconfig.json 中新增 baseUrl  

```
{
  "compilerOptions": {
    "baseUrl": "."
  }
}

```
实现对组件的复用更加简单:定义一个 Layout 模板，对导航和页脚组件进行复用，在中间区域插入动态渲染的内容 
新建 components/layout/index.tsx： 
```
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
```  

修改 pages/_app.tsx： 

```
import Layout from '../components/layout';
import 'styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
```  

登录注册这里我们采用两种方式:   

手机验证码登录(一个测试号码:19182037344(容联云通讯),验证码可在终端查看)以及三方登录(github账号登录)  

网站的测试和部署:  

在线浏览：https://pig-blog.vercel.app/
