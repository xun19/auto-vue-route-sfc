<p align="center">
  <img src="https://img.shields.io/badge/vue-ring component---" alt="vue ring component">
  <img src="https://img.shields.io/badge/style-easy---" alt="easy">
</p>

## 语言 / Language
- [中文](#user-content-chinese)
- [English](#user-content-english)

<a name="user-content-chinese"></a>

## 介绍

根据提供的router对象，自动创建对应的页面目录以及.vue组件文件（SFC）

## 使用场景
在使用vue-router时，一个route需要绑定一个component，这个component往往对应一个.vue文件（即单文件组件/SFC）。

一般我们需要手动创建对应的目录以及.vue文件，但是在嵌套关系复杂、文件众多的情况下这种操作就会显得繁琐。

既然我们已经在router.routes中，定义了这些component的目录位置及命名，其实是可以直接利用这个信息去自动创建目录以及文件。auto-vue-route-sfc就是用于完成这个工作的。

## 支持
- 目前在vue-router4下使用，后续会兼容vue-router3
- 支持import、import()、require()方式的模块引入语法
- 支持你对import()、require()进行自己的逻辑包装

## 使用指引

### 前提
确保你有一个输出router对象的文件

### 安装

```javascript
npm i -D auto-vue-route-sfc
```

### 建立配置文件
在项目根目录下创建一个配置文件auto-vue-route-sfc.config.js，内容示例如下：
```javascript
module.exports = {
    entry: './src/router/index.js',
    routerDir: './src/router'
}
```
其中：
- entry: 是你输出router对象的文件
- routerDir: 是你的路由功能模块所在的目录

若你是使用vue-cli创建的自带vue-router的项目，则默认的设置就同示例中的一样，无需做额外的更改。

### 运行命令
#### 方式一
打开终端，在根目录下运行
```javascript
npx auto-vue-route-sfc
```
#### 方式二
或者也可以在项目package.json中配置script命令
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
若顺利，将看到你的页面目录以及组件文件将被自动创建😀

### 配置别名
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

<a name="user-content-english"></a>

## Introduction



According to the router object provided, automatically create the pages directory and Vue component file (SFC)



## Usage scenario

When using Vue router, a route needs to bind a component, which often corresponds to a .vue file (Single File Component / SFC).

Generally, we need to manually create the directory and .vue file, but in the case of complex nested relationship and many files, this operation will be cumbersome.

Now that we're already in router.routes defines the directory location and naming of these components. In fact, this information can be directly used to automatically create directories and files. This tool is used to complete this work.

##Support

- It is currently used under vue-router4 and will be compatible with vue-router3 in the future

- Module loading syntax: import, import(), require()

- Support your own logical packaging of import() and require()

## Use guidelines

### Premises
Make sure you have a file that outputs the router object

### Installation

```javascript
npm i -D auto-vue-route-sfc
```

### Create a configuration file

Create file named auto-vue-route-sfc.config.js in the root directory of your project, the content example is as follows:

```javascript
module. exports = {
  entry: './src/router/index. js',
  routerDir: './src/router'
}
```

Of which:

- Entry: The file that you output the router object.

- Routerdir: The directory where your routing function module is located.

If your project is created by vue-cli with vue-router, the default settings are the same as those in the example, and no additional changes are required.

### Make it work

#### Method I

Open the terminal and run it under the root directory

```javascript
npx auto-vue-route-sfc
```

#### Method II

Alternatively, you can use the project package Configuring script commands in JSON

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

If it goes well, you will see that your page directory and component files will be created automatically😀

### Configure alias

Support the use of path aliases, which can be found in auto-vue-route-sfc.config.js is configured as follows:

```javascript
module. exports = {
  entry: './src/router/index. js',
  routerDir: './src/router',
  // use alias
  alias: {
    '@': './src',
    '$': './xxx',
    'srcxxx': './src/xxx'
  }
}
```