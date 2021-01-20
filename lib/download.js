const path = require('path')
// 请求 ora 库，用于实现等待动画
const ora = require('ora')
// 请求 chalk 库，用于实现控制台字符样式
const chalk = require('chalk')
// 请求 fs-extra 库，用于文件操作
const fse = require('fs-extra')
// 请求 inquirer 库，用于控制台交互
const inquirer = require('inquirer')

// 请求 download 库，用于下载模板
const download = require('download')

// 请求 config.js 文件
const setConfig = require('./config')

// 拼接 config.json 完整路径
const cfgPath = path.resolve(__dirname, '../config.json')
// 拼接 template 模板文件夹完整路径
const tplPath = path.resolve(__dirname, '../template')

async function loadTemplate () {
  // 清空模板文件夹的相关内容，用法见 fs-extra 的 README.md
  try {
    await fse.remove(tplPath)
  } catch (err) {
    console.error(err)
    process.exit()
  }

  const exists = await fse.pathExists(cfgPath)
  let mirrorUrl = null
  if (!exists) {
    // 如果不存在配置文件，则需要用户先配置下载镜像模板仓库链接
    mirrorUrl = await initMirrorUrl()
  } else {
    // 读取配置，用于获取镜像链接
    const jsonConfig = await fse.readJson(cfgPath)
    mirrorUrl = jsonConfig.url.replace(/\/$/, '') + '/' + jsonConfig.mirror
  }

  // Spinner 初始设置
  const dlSpinner = ora(chalk.cyan('Downloading template...'))

  // 开始执行等待动画
  dlSpinner.start()
  try {
    // 下载模板后解压
    await download(mirrorUrl, path.resolve(__dirname, '../template'), { extract: true });
  } catch (err) {
    // 下载失败时提示
    dlSpinner.text = chalk.red(`
    Download template failed, please check if your mirror link is correct. \n
    You can also reset the mirror link width command: setMirror <template_mirror_url>. \n
    ${err}`)
    // 终止等待动画并显示 X 标志
    dlSpinner.fail()
    process.exit()
  }

  // 镜像模板仓库链接写入配置文件
  !exists && setConfig(mirrorUrl)
  // 下载成功时提示
  dlSpinner.text = 'Download template successful.'
  // 终止等待动画并显示 ✔ 标志
  dlSpinner.succeed()
}

// 如果不存在配置文件，则需要用户先配置下载镜像模板的仓库链接
async function initMirrorUrl () {
  let mirrorUrl = null
  await inquirer
    .prompt([
      {
        type: 'input', // 类型，其他类型看官方文档
        name: 'url',  // 名称，用来索引当前 name 的值
        message: 'Please input your project template url:'
      },
    ])
    .then((answers) => {
      mirrorUrl = answers.url || mirrorUrl
    })

  return mirrorUrl
}

module.exports = loadTemplate
