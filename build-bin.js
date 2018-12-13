const { exec } = require('pkg')
// var zipFolder = require('zip-folder')
const util = require('util')
const fs = require('fs')
const {copyDir, mkdir} = require('./file-helper')
var pjson = require('./package.json')

// const zipPromise = util.promisify(zipFolder)

async function doJob(params) {
  const outDir = './_bin'
  const tmpDir = './_bin/tmp'

  fs.mkdirSync(tmpDir)

  await exec([
    'index.js',
    '--target',
    'node10-linux-x64,node10-macos-x64,node10-win-x64',
    // '--scripts',
    // 'node_modules/puppeteer/lib/*.js',
    // '--scripts',
    // 'node_modules/puppeteer/lib/*.js',
    '--output',
    `${tmpDir}/checkin`
  ])

  mkdir(`${tmpDir}/puppeteer`)
  mkdir(`${tmpDir}/puppeteer/.local-chromium`)
  // await copyDir(
  //   './node_modules/puppeteer/.local-chromium',
  //   `${tmpDir}/puppeteer/.local-chromium`
  // )
  // const releaseFileName = `prebuilt_v${pjson.version}.zip`
  // await zipPromise(tmpDir, `${outDir}/${releaseFileName}`)
}

doJob()
