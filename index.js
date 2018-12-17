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
  console.log('Last check in time not match')
  notifier({ ...settings, isCheckIn: true })
} else if (utils.getCurrentHour() >= 18 && utils.getCurrentHour() <= 20) {
  console.log('Show check out time')
  notifier({ ...settings, isCheckIn: false })
} else {
  console.log(`Already checked in, I'll remind you when it's time to check out`)
}

// initialize last timer
let lastTime = new Date().getTime()

// schedule for background job
function setScheduler () {
  const interval = 5 * 60 * 1000
  const rule = new schedule.RecurrenceRule()
  rule.minute = new schedule.Range(0, 59, 5) // trigger every 5 minutes

  schedule.scheduleJob(rule, function () {
    const currentTime = new Date().getTime()
    const currentHour = utils.getCurrentHour()
    const isInCheckoutTime = currentHour >= 18 && currentHour <= 20
    const isInterrupted = currentTime > lastTime + interval * 2
    console.log(
      `Schedule task firing currentTime(${currentTime})) isCheckedIn(${isCheckedIn}) isInCheckoutTime(${isInCheckoutTime})`
    )
    console.log('Current hour ' + currentHour)
    if (isInterrupted) {
      console.log('-- Resume from interrupt')

      if (global.lastCheckedInDay !== utils.getCurrentDay()) {
        console.log('Last check in time not match')
        notifier({ ...settings, isCheckIn: true })
      } else {
        console.log('---- Already checked in')
      }
    } else if (isInCheckoutTime) {
      console.log('-- Is in checkout time')

      if (global.isCheckedIn === true && isInCheckoutTime) {
        // trigger every 30 minutes
        console.log('Show check out time')
        notifier({ ...settings, isCheckIn: false })
      } else {
        console.log('---- Already checked out')
      }
    } else {
      console.log(`Condition not met, sleep for now`)
    }
    lastTime = currentTime
  })
}
setScheduler()
