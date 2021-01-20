const path = require('path')
// 请求 fs-extra 库
const fse = require('fs-extra')
const symbols = require('log-symbols')

// 拼接 config.json 完整路径
const cfgPath = path.resolve(__dirname, '../config.json')

async function setConfig (link) {
  const exists = await fse.pathExists(cfgPath)
  try {
    const index = link.lastIndexOf("/")
    if (!exists) {
      // 利用 fs-extra 封装的方法，保存成 json 配置文件
      await fse.outputJson(cfgPath, {
        mirror: link.substring(index + 1),
        url: link.substring(0, index)
      })
    } else {
      await setMirror(link, index)
    }
    console.log(symbols.success, 'Set the mirror successful.')
  } catch (err) {
    console.error(err)
    process.exit()
  }
}

async function setMirror (link, index) {
  const jsonConfig = await fse.readJson(cfgPath)
  jsonConfig.mirror = link.substring(index + 1)
  jsonConfig.url = link.substring(0, index)
  await fse.writeJson(cfgPath, jsonConfig)
}

module.exports = setConfig
