const process = require('process')
const path = require('path')

const packageName = 'auto-vue-route-sfc'

const isPackageName = (dir) => !!/^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.exec(dir)

const importWrapperFuncName = '_import' // 自定义加载函数的名字，用于babel转换，可更改

const nodeVersion = Number(process.version.replace('v', '').split('.')[0])
const isLowNodejsVersion = nodeVersion < 14 // 大版本小于14的认为是低版本nodejs, 在该环境下的一些逻辑需要作特殊处理

const developerProjectDir = path.resolve(__dirname, '../..')

let configs = {
    entry: './src/router/index.js',
    routerDir: './src/router',
    alias: {}
}
try {
    const devConfigs = require(path.resolve(developerProjectDir, `./${packageName}.config.js`)) // .config.js的配置项
    configs = Object.assign(configs, devConfigs)
} catch(e) {}

const { alias } = configs
const aliaFlags = Object.keys(alias)
const isIllegalAlia = !!aliaFlags.find(aliaFlag => (aliaFlag.includes('.') || aliaFlag.includes('/')))
const hasAliaFlag = (dir) => aliaFlags.find(aliaFlag => aliaFlag === dir.replace(/'/g, '').split('/')[0])
const replaceAlias = (dirWithAlia) => {
    let dir = dirWithAlia
    let aliaFlag = hasAliaFlag(dir)
    if (aliaFlag) {
        const realDir = path.resolve(developerProjectDir, `${alias[aliaFlag]}/`)
        dir = dir.replace(aliaFlag, realDir) // 使用了hasAliaFlag进行过了判断，所以这里必然是替换第一个分隔的路径名
    }
    return dir
}

const getTmpDir = (dir) => {
    const arr = dir.split('/') // TODO: 考虑两种斜杠？
    const last = arr.length - 1
    arr[last] = `${arr[last]}-tmp`
    return arr.join('/')
}


module.exports = {
    packageName,
    importWrapperFuncName,
    isLowNodejsVersion,
    developerProjectDir,
    configs,
    alias,
    aliaFlags,
    isIllegalAlia,
    isPackageName,
    hasAliaFlag,
    replaceAlias,
    getTmpDir,
}
