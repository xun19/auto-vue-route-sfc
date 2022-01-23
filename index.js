const path = require('path')

const { isPackageName, replaceAlias } = require('./utils')

const _import = (dirname, src) => {
    try {
        const s = isPackageName(src) ? src : path.resolve(dirname, replaceAlias(src))
        const module = require(s)
        return module.default || module
    } catch(e) {
        // 只针对找不到.vue文件的情形进行处理。若不是，则将报错传递出来
        // 正常情况的其它模块的require都已经被正确加载。无法加载的其它模块，将被正常报错处理，无法进行文件创建
        // TODO: 因此下面这一返回只会针对 找不到的.vue文件，而.vue文件用cjs方式加载会带.default，所以在下面这一步多封装一层 {default: ...} 是可以的
        // TODO: 干脆直接返回Component，让new Router不报错，能够直接按脚手架的代码来运行
        if (e.code === 'MODULE_NOT_FOUND' && path.extname(src) === '.vue') {
            return path.resolve(dirname, replaceAlias(src))
        } else {
            if (!e.message.includes("Unexpected token '<'")){ // 不是由于加载.vue文件出错
                throw e // TODO: 这样问题只能定位到route-tmp，没法回到原目录上去定位问题
            }
        }
    }
}

// TODO: 兼容vue-router3 的 new VueRouter()创建方式. 在config.js里让开发者说明
const vueRouterFake = new Proxy({}, {
    get(target, propertyKey) {
        if (propertyKey === 'createRouter') {
            return (opt) => opt.routes || [] 
        } else  {
            return () => null
        }
    }
})

module.exports = {
    _import,
    vueRouterFake
}
