#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const child_process = require('child_process')

const { packageName, configs, isIllegalAlia, developerProjectDir, getTmpDir } = require('../utils')

const execFilePath = path.resolve(__dirname, '../exec.js')

const fullRouterDir = path.resolve(developerProjectDir, configs.routerDir)


const main = () => {
    if (isIllegalAlia) {
        console.error('\033[31m别名包含不合法字符（. 或 /），请检查配置\033[39m')
    } else {
        fs.access(fullRouterDir, fs.constants.F_OK, (err) => {
            if (err) {
                console.error('\033[31m找不到router目录 ', fullRouterDir, '，请确认该目录是否存在\033[39m')
            } else {
                exec()
            }
        });
    }
}


const exec = () => {
    // TODO: 考虑多个不同目录（router目录之外）的文件之前有依赖关系，需要转化多个目录的情况？
    const createBabelCMD = () => {
        const routerDir = configs.routerDir || './src/router'
        const babelInputDir = path.resolve(developerProjectDir, routerDir)
        const babelOutDir = path.resolve(developerProjectDir, getTmpDir(routerDir))
        return `&& npx babel ${babelInputDir}  --out-dir ${babelOutDir} `
    }

    console.log('\033[33m开始创建 ...\033[39m')

    const cmd = `cd node_modules/${packageName} ${createBabelCMD()}&& esno ${execFilePath}`

    child_process.exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error('\033[31mEXEC ERROR:', error, '\033[39m')
            return
        }
        if (stderr) {
            console.error('\033[31mCHILD_PROCESS STDERR:', stderr, '\033[39m')
        }
        console.log(`${stdout}`)
    })
}

main()

// TODO: 1、在tmp内创建目录的问题 2、require.default问题 3、vue-router无法直接执行的问题
