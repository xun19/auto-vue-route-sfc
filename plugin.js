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
                const newNode = template.statement.ast(`const ${importWrapperFuncName} = require('${packageName}')`)
                start.insertBefore(newNode)
            },
            ImportDeclaration(path) {
                const { node } = path
                const specifiers = node.specifiers
                const source = node.source.value
                let newNode = ''
                if (specifiers.length === 1) { // import default
                    const specifierName = node.specifiers[0].local.name
                    newNode = template.statement.ast(`const ${specifierName} = ${importWrapperFuncName}(__dirname, '${source}')`)
                } else { // 存在解构
                    const specifierNames = node.specifiers.map(item => item.local.name)
                    newNode = template.statement.ast(`const {${specifierNames}} = ${importWrapperFuncName}(__dirname, '${source}')`)
                }
                path.replaceWith(newNode)
            },
            CallExpression(path) {
                const { node } = path
                if (node.callee.name === 'require') {
                    const parent = path.findParent((path) => path.isVariableDeclarator())
                    if (!parent || parent.node.id.name !== importWrapperFuncName) {
                        const argument = node.arguments[0]
                        const argumentCode = generate(argument).code
                        const newNode = template.statement.ast(`${importWrapperFuncName}(__dirname, ${argumentCode})`)
                        path.replaceWith(newNode)
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