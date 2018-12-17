const path = require('path')
const fs = require('fs')

module.exports = {
  getCurrentHour () {
    return new Date().getHours()
  },

  getCurrentDay () {
    return new Date().getDate()
  },

  loadSettings () {
    if (process.pkg) {
      global.settings = require(`${path.dirname(
        process.execPath
      )}/settings.json`)
    } else {
      global.settings = {
        host: process.env.HOST,
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        headless: false
      }
    }
  },

  loadSaveData () {
    let savePath = ''
    try {
      if (process.pkg) {
        savePath = `${path.dirname(process.execPath)}/save.json`
      } else {
        savePath = './save.json'
      }
      const save = require(savePath)
      global.lastCheckedInDay = save.lastCheckedInDay
      console.log(save.lastCheckedInDay, this.getCurrentDay())
      global.isCheckedIn = save.lastCheckedInDay === this.getCurrentDay()
    } catch (err) {
      console.log(err)
      const content = JSON.stringify({
        lastCheckedInDay: this.getCurrentDay()
      })
      global.lastCheckedInDay = -1
      global.isCheckedIn = false
      fs.writeFile(savePath, content, err => {
        if (err) console.log(`Error saving data file: ${err}`)
      })
    }
  },

  saveData () {
    let savePath = ''
    if (process.pkg) {
      savePath = `${path.dirname(process.execPath)}/save.json`
    } else {
      savePath = `./save.json`
    }
    const content = JSON.stringify({
      lastCheckedInDay: global.lastCheckedInDay
    })
    fs.writeFile(savePath, content, err => {
      if (err) console.log(`Error saving data file: ${err}`)
    })
  }
}
