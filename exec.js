const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const { packageName, isLowNodejsVersion, developerProjectDir, getTmpDir } = require('./utils')

const configs = require(path.resolve(developerProjectDir, `./${packageName}.config.js`))

const routerDir = configs.routerDir || './src/router'
const tmpRouterDir = getTmpDir(routerDir)

let routes = require(`${path.resolve(developerProjectDir, tmpRouterDir, `./${configs.entry.replace(routerDir, '')}`)}`)
if (routes.default) {
    routes = routes.default
}

const getRequireStack = e => e.stack.split('\n')[2].replace('- ', '')

function createRouteDir(src, routePath) {
    console.log('\033[33m创建Route SFC: \033[39m' + src)

    const dir = path.dirname(src)
    mkdirp.sync(dir)
    const content =
`<template>
    <div>
        ${routePath.includes('/') ? '' : '/'}${routePath}<router-view/>
    </div>
</template>
`
    fs.writeFileSync(src, content)
}

function init(routes) {
    const routeList = []
    routeList.push(... routes)
    while (routeList[0]) {
        const { children } = routeList[0]
        if (children && children.length !== 0) {
            routeList.push(... children)
        }
        const { component, path: routePath } = routeList[0]
        // 两种情况下进行.vue文件的创建：1）失败的require()、import方式 2）失败的import()
        if (typeof component === 'function') { // 失败的import()
            component()
                .catch((e) => {
                    // ERR_MODULE_NOT_FOUND: 无法解析 ES 模块
                    // MODULE_NOT_FOUND: 尝试执行 require() 或 import 操作时无法解析模块文件
                    // 低版本nodejs的 错误码和import()的规则有些不一样
                    // TODO：带别名的因为也会报“模块未找到”错误，所以也会被再创建一遍 ❌
                    // TODO：细化：只针对拓展名为.vue的文件进行创建，对其余普通模块未找到的情况不作处理
                    if (e.code === 'ERR_MODULE_NOT_FOUND' || (isLowNodejsVersion && e.code === 'MODULE_NOT_FOUND')) {
                        const requireStackDir = path.dirname(getRequireStack(e))
                        let modulePath = e.message.match(/'(.)*'/)[0].replace(/'/g, '')
                        modulePath = modulePath.replace('file://', '') // 去除file://协议头
                        const src = path.resolve(requireStackDir, modulePath)
                        createRouteDir(src, routePath)
                    }

                    // 一般的错误反馈 且 报的不是“未知扩展名”（因为import()加载.vue文件，在没有编译的前提下也会报错，但此种报错可忽略，因为不是需要关注的重点）
                    else if (!isLowNodejsVersion && e.code !== 'ERR_UNKNOWN_FILE_EXTENSION') {
                        console.log(e)
                    }

                    // TODO：低版本nodejs 加载已有.vue文件报错 如何提示
                    else {
                        // ...
                    }
                })
        } else if (typeof component === 'string') { // 失败的require()、import方式。 自定义的_import方法已将route对应的component属性转为了一个路径字符串
            createRouteDir(component, routePath)
        }
        routeList.shift()
    }
    // 若存在fs.rm，优先使用fs.rm: “In future versions of Node.js, fs.rmdir(path, { recursive: true }) will be removed. Use fs.rm(path, { recursive: true }) instead”
    const rmdir = fs.rm || fs.rmdir
    rmdir(path.resolve(developerProjectDir, tmpRouterDir), {
        recursive: true,
        force: true
    } , () => {
        console.log('\033[33m\n创建完成\033[39m')
    })
}

init(routes)
