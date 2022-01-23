const template = require('@babel/template')
const generate = require("@babel/generator").default
const { 
    packageName,
    importWrapperFuncName,
    isLowNodejsVersion,
    replaceAlias,
    hasAliaFlag
} = require('./utils')

const plugin = () => {
    return {
        visitor: {
            Program(path) {
                const start = path.get('body')[0]
                const newNode = template.statement.ast(`const {${importWrapperFuncName}, vueRouterFake} = require('${packageName}')`)
                start.insertBefore(newNode)
            },
            ImportDeclaration(path) {
                const { node } = path
                const specifiers = node.specifiers
                const source = node.source.value
                let newNode = ''
                if (specifiers.length === 1) { // import default
                    const specifierName = node.specifiers[0].local.name
                    if (source === 'vue-router') {
                        newNode = template.statement.ast(`const ${specifierName} = vueRouterFake`)
                    } else {
                        newNode = template.statement.ast(`const ${specifierName} = ${importWrapperFuncName}(__dirname, '${source}')`)
                    }
                } else { // 存在解构
                    const specifierNames = node.specifiers.map(item => item.local.name)
                    if (source === 'vue-router') {
                        newNode = template.statement.ast(`const {${specifierNames}} = vueRouterFake`)
                    } else {
                        newNode = template.statement.ast(`const {${specifierNames}} = ${importWrapperFuncName}(__dirname, '${source}')`)
                    }
                }
                path.replaceWith(newNode)
            },
            CallExpression(path) {
                const { node } = path
                if (node.callee.name === 'require') {
                    const parent = path.findParent((path) => path.isVariableDeclarator())
                    if (!parent || node.arguments[0].value !== packageName) { // 防止将加载自身的 require(`${packageName}`) 语句转译
                        const argument = node.arguments[0]
                        const argumentCode = generate(argument).code
                        const newNode = template.statement.ast(`${importWrapperFuncName}(__dirname, ${argumentCode})`)

                        // 去掉所有require().default的'.default'，因为在importWrapperFunc方法里，若是存在default，将直接返回default。无需在外面多取一次
                        if (parent.node.init.property && parent.node.init.property.name === 'default') {
                            // NOTE: 要对节点(node)进行操作，其实是要对其对应的path进行操作。
                            // 获取子节点的path，需使用parent.get()方法，而不是parent.node.property式的访问
                            // 这里parent本身就是一个path，所以直接进行get操作。
                            // 若是parent.node，则是获取了parent的节点, parent.node.property是访问了parent节点的属性。
                            // 总之，要进行操作需要用其path，单纯访问属性用其node
                            parent.get('init').replaceWith(newNode)
                        } else {
                            path.replaceWith(newNode)
                        }
                    }
                }
                else if (node.callee.type === 'Import') {
                    const argument = node.arguments[0]
                    const argumentCode = generate(argument).code
                    let src = argumentCode.replace(/'/g, '') // 将字符串内的引号先剔除
                    // 在执行阶段前将带别名的import()内路径参数进行替换，否则形如“@/xxx”的写法 在高版本nodejs里 会被解释为模块,从而在返回的promise.catch报错信息中无法读到完整的路径
                    if (hasAliaFlag(src)) {
                        src = replaceAlias(src)
                        const protocol = isLowNodejsVersion ? '' : 'file://' // 高版本nodejs要求import()本地文件必须是file协议 TODO: file协议只对windows有用, 如何适配Mac
                        src = protocol + src
                        const newNode = template.statement.ast(`import('${src}')`)
                        path.replaceWith(newNode)
                    }
                }
            }
        }
    }
}

module.exports = plugin