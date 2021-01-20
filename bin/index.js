#!/usr/bin/env node

// 使用 commander 库
const program = require('commander')

// 检查更新
const updateChk = require('../lib/update')
// 设置镜像链接配置
const setConfig = require('../lib/config')
// 下载更新镜像
const dlTemplate = require('../lib/download')
// 创建项目
const createProject = require('../lib/create')

// 从 package.json 文件中请求 version 字段的值，-v和--version是参数
program.version(require('../package.json').version, '-v, --version')

// upgrade 检测更新
program
  // 声明的命令
  .command('upgrade')
  // 描述信息，在帮助信息时显示
  .description("Check the jdy-cli version.")
  .action(() => {
    // 执行 lib/update.js 里面的操作
    updateChk()
  })

// setMirror 设置镜像链接
program
  .command('setMirror <template_mirror_url>')
  .description("Set the template mirror url.")
  .action((tplMirror) => {
    setConfig(tplMirror)
  })

// template 下载/更新模板
program
  .command('template')
  .description("Download template from mirror.")
  .action(() => {
    dlTemplate()
  })

// create 创建项目
program
  .name('jdy-cli')
  .usage('<commands> [options]')
  .command('create <project_name>')
  .description('Create a javascript plugin project.')
  .action(project => {
    createProject(project)
  })

// 解析命令行参数
program.parse(process.argv)
