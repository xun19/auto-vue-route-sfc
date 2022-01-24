<p align="center">
  <img src="https://img.shields.io/badge/vue-dev tool---" alt="vue tool">
  <img src="https://img.shields.io/badge/create-route sfc---" alt="easy">
</p>

## 语言 / Language
- [中文](#user-content-chinese)
- [English](#user-content-english)

<a name="user-content-chinese"></a>

## 介绍

根据你所提供的router对象，自动地创建对应页面文件目录以及.vue组件文件（SFC）

## 使用场景
例如，根据一般的vue-router配置，假设我们在文件里输出了一个router:
```javascript
// ./src/router/index.js

import { createRouter, createWebHashHistory } from 'vue-router';
import Component1 from '../views/page1/Component1.vue'

const routes = [
  {
    path: '/page1',
    component: Component1,
  },
  {
    path: '/page2',
    component: () => import('../views/page2/Component2.vue'),
    children: [
      {
        path: '/page2-1',
        component: require('../views/page2-1/Component3.vue').default;,
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
```
执行auto-vue-route-sfc的命令后，你将在项目目录下看到自动生成的对应页面目录和文件：
```javascript
your-project/src
│
└─views
    ├─page1
    │      Component1.vue
    │
    └─page2
        │  Component2.vue
        │
        └─page2-1
                Component3.vue
```

## 功能
- 💡支持对vue-router3、vue-router4的使用
- 💡支持的模块加载语法：import、import()、require()
- 💡支持你对import()、require()进行自己的封装，比如：
<br/>
  ```javascript
    const YourImport = (src) => process.env.NODE_ENV === 'development' ?
                       require(src).default :
                       () => import(src) // 仅生产环境使用懒加载
    
    const routes = [
      {
        path: '/page1',
        component: YourImport('./Component.vue'), // 你封装的import方法
      }
    ]
    
    const router = new VueRouter({ routes })

    export default router
  ```
  <br/>
- ❌暂不支持ts

## 使用指南

### 准备
请确保你已经安装了vue-router，并且有一个输出了router对象（export default router）的文件

### 安装

```javascript
npm i -D auto-vue-route-sfc
```

### 创建配置文件
#### 基础
在项目根目录下创建一个配置文件auto-vue-route-sfc.config.js，内容示例如下：
```javascript
module.exports = {
    entry: './your/router-dir/index.js',
    routerDir: './your/router-dir'
}
```
其中：
- entry: 是你输出router对象（export default router）的文件
- routerDir: 是你的路由功能模块所在的目录

#### 额外功能：使用别名
支持路径别名的使用，可以在auto-vue-route-sfc.config.js中按如下配置：
```javascript
module.exports = {
    entry: './src/router/index.js',
    routerDir: './src/router',
    // 使用别名
    alias: {
        '@': './src',
        '$': './xxx',
        'srcxxx': './src/xxx'
    }
}
```
#### 不创建配置文件的情况
若项目根目录下没有发现auto-vue-route-sfc.config.js，则将被默认视为如下配置：
```javascript
{
    entry: './src/router/index.js',
    routerDir: './src/router',
    alias: {}
}
```

若你是使用vue-cli创建的自带vue-router的项目，则默认配置与你项目的目录路径是一致的，无需做额外的更改和配置。

### 运行命令
#### 方式一
打开终端，在根目录下运行
```javascript
npx auto-vue-route-sfc
```
#### 方式二
可以在项目package.json中配置script命令
```javascript
 // package.json
 "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "auto:sfc": "npx auto-vue-route-sfc" // 新增命令
  },
```
然后在终端运行
```javascript
npm run auto:sfc
```
如若顺利，你将看到你的页面目录、组件文件被自动地创建在项目下！

### 注意
- 💡 你可以随时增加新的路由配置，然后运行这个工具来生成对应的新目录和新页面文件。已经被你编写过的旧目录和旧页面文件是不会被覆盖的:)
- ❌但是对于更改或者删除旧路由，这个工具不会更改或删除旧目录、旧页面文件，因为它还不是一个页面目录的管理器:(


<a name="user-content-english"></a>

## Introduction
Create page directories and .vue files (vue single file component / SFC) based your export router.

## When can I use it ?
For example, according to the general vue-router configuration, suppose we export a router in the file:
```javascript
// ./src/router/index.js

import { createRouter, createWebHashHistory } from 'vue-router';
import Component1 from '../views/page1/Component1.vue'

const routes = [
  {
    path: '/page1',
    component: Component1,
  },
  {
    path: '/page2',
    component: () => import('../views/page2/Component2.vue'),
    children: [
      {
        path: '/page2-1',
        component: require('../views/page2-1/Component3.vue').default;,
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
```
After executing the auto-vue-route-sfc command, you will see the corresponding page directory and files automatically generated in the project directory:
```javascript
your-project/src
│
└─views
    ├─page1
    │      Component1.vue
    │
    └─page2
        │  Component2.vue
        │
        └─page2-1
                Component3.vue
```

## Features

- 💡 Support the use of vue-router3 and vue-router4

- 💡 Supported module loading syntax: import, import(), require()

- 💡 You can wrap import() and require() for complex logic, for example:
<br/>
  ```javascript
    const YourImport = (src) => process.env.NODE_ENV === 'development' ?
                       require(src).default :
                       () => import(src) // lazy load only in the production env
    
    const routes = [
      {
        path: '/page1',
        component: YourImport('./Component.vue'), // your import wrapper
      }
    ]
    
    const router = new VueRouter({ routes })

    export default router
  ```
<br/>
- ❌ TypeScript is not supported temporarily

## Usage

### Premises
Please make sure that you have installed vue-router and have a file that outputs the router object (export default router)

### Installation

```javascript
npm i -D auto-vue-route-sfc
```

### Create a configuration file

#### Basic Configuration

Create file named auto-vue-route-sfc.config.js in the root directory of your project, the content example is as follows:

```javascript
module. exports = {
  entry: './src/router/index.js',
  routerDir: './src/router'
}
```

Of which:

- Entry: The file that you output the router object.

- Routerdir: The directory where your routing function module is located.

#### Extra Configuration: Path Alias

Support the use of path aliases, which can be found in auto-vue-route-sfc.config.js is configured as follows:

```javascript
module. exports = {
  entry: './src/router/index.js',
  routerDir: './src/router',
  // use alias
  alias: {
    '@': './src',
    '$': './xxx',
    'srcxxx': './src/xxx'
  }
}
```
####  Default Configuration / Without a config.js
If auto-Vue-route-sfc.config.js is not found in the root directory of the project, it will be regarded as the following configuration by default:
```javascript
{
    entry: './src/router/index.js',
    routerDir: './src/router',
    alias: {}
}
```
If your project is created by vue-cli with vue-router, the settings are the same as those as default, and no additional changes and configurations are required.
### Make it work

#### Method 1

Open the terminal and run it under the root directory

```javascript
npx auto-vue-route-sfc
```

#### Method 2

You can use the project package.json script command

```javascript
// package.json
"scripts": {
  "serve": "vue-cli-service serve",
  "build": "vue-cli-service build",
  "lint": "vue-cli-service lint",
  "auto:sfc": "npx auto-vue-route-sfc" // add a new command
},
```

Then run at the terminal

```javascript
npm run auto:sfc
```

If it goes well, you will see that your page directory and component files will be created automatically !

### Attention

- 💡 You can add your new route configuration at any time, and then run this tool to generate the corresponding new directory and new page file.  Directories and page files that have been coded will not be overwritten:)

- ❌ However, for changing or deleting routes that existed, this tool will not change or delete those directories or page files that existed, because it is not yet a manager for route page directories:(