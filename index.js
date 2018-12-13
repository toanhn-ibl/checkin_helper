const path = require('path')
const notifier = require('./notifier')
const schedule = require('node-schedule')
const utils = require('./utils')

global.lastCheckedInDay = utils.getCurrentDay()
global.isCheckedIn = false

utils.loadSettings()
utils.loadSaveData()

// send check in notification
console.log('Suiting up, please wait...')
if (global.lastCheckedInDay !== utils.getCurrentDay()) {
  notifier({ ...settings, isCheckIn: true })
} else if (utils.getCurrentHour() >= 18 && utils.getCurrentHour() <= 20) {
  notifier({ ...settings, isCheckIn: false })
} else {
  console.log(`Already checked in, I'll remind you when it's time to check out`)
}

// initialize last timer
let lastTime = new Date().getTime()
let tick = 0

// schedule for background job
function setScheduler () {
  const interval = 5 * 60 * 1000
  const rule = new schedule.RecurrenceRule()
  rule.minute = new schedule.Range(0, 59, 5) // trigger every 5 minutes

  schedule.scheduleJob(rule, function () {
    const currentTime = new Date().getTime()
    if (currentTime > lastTime + interval * 2) {
      if (global.lastCheckedInDay !== utils.getCurrentDay()) {
        notifier({ ...settings, isCheckIn: true })
      } else {
        if (
          global.isCheckedIn === true &&
          utils.getCurrentHour() >= 18 &&
          utils.getCurrentHour() <= 20
        ) {
          // trigger every 30 minutes
          if (tick <= 0) {
            notifier({ ...settings, isCheckIn: false })
            tick = 6
          }
          tick--
        }
      }
    }
    lastTime = currentTime
  })
}
setScheduler()
