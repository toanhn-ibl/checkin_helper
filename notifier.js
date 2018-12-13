const NotificationCenter = require('node-notifier').NotificationCenter
const odoo = require('./odoo')
const utils = require('./utils')

var notifier = new NotificationCenter({
  withFallback: false, // Use Growl Fallback if <= 10.8
  customPath: void 0 // Relative/Absolute path to binary if you want to use your own fork of terminal-notifier
})

module.exports = function (args) {
  console.log('Showing attendance notification...')
  notifier.notify(
    {
      title: 'Attendance reminder',
      message: args.isCheckIn
        ? 'Good day! Want to check in?'
        : 'Are you leaving soon? Remember to check out!',
      sound: false, // Case Sensitive string for location of sound file, or use one of macOS' native sounds (see below)
      icon:
        'http://icons.iconarchive.com/icons/aha-soft/large-time/128/Alarm-clock-icon.png', // Absolute Path to Triggering Icon
      // contentImage: void 0, // Absolute Path to Attached Image (Content Image)
      // open: void 0, // URL to open on Click
      // wait: true, // Wait for User Action against Notification or times out. Same as timeout = 5 seconds

      // New in latest version. See `example/macInput.js` for usage
      timeout: 30 * 60, // Takes precedence over wait if both are defined.
      // closeLabel: void 0, // String. Label for cancel button
      // actions: [CHECKIN, CHECKOUT], // String | Array<String>. Action label or list of labels in case of dropdown
      // dropdownLabel: void 0, // String. Label to be used if multiple actions
      reply: true // Boolean. If notification should take input. Value passed as third argument in callback and event emitter.
    },
    async function (error, response, metadata) {
      if (response === 'activate') {
        await odoo(args)
        if (args.isCheckIn) {
          global.lastCheckedInDay = utils.getCurrentDay()
          utils.saveData()
        }
      } else {
        console.log('Strange metadata received from Notification center')
      }
    }
  )
}
