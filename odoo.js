const puppeteer = require('puppeteer')

const executablePath = process.pkg
  ? puppeteer
    .executablePath()
    .replace(
      `${__dirname}/node_modules`,
      process.execPath.replace('/checkin-macos', '')
    )
  : puppeteer.executablePath()

const savePath = process.pkg
  ? process.execPath.replace('/checkin-macos', 'lastProof.png')
  : `${__dirname}/lastProof.png`

module.exports = async args => {
  const { isCheckIn, username, password, headless } = args
  const browser = await puppeteer.launch({ headless, executablePath })
  const page = await browser.newPage()

  // login
  await page.goto(`${settings.host}/web/login`)
  await page.evaluate(`$('#login').val('${username}');`)
  await page.evaluate(`$('#password').val('${password}');`)
  await page.evaluate(`$('form').submit()`)
  await page.waitFor(4000) // time out

  // navigate to attendance page
  await page.goto(`${settings.host}/web#action=533&menu_id=365`)

  // proceed to check in / check out
  await page
    .mainFrame()
    .waitForSelector('.o_hr_attendance_sign_in_out_icon', {
      visible: true
    })
    .then(async elem => {
      const title = await elem.getProperty('title')
      const {
        _remoteObject: { value }
      } = title
      if (value === 'Sign in') {
        if (isCheckIn) {
          await elem.click()
          console.log('User has logged in')
          global.isCheckedIn = true
        } else {
          console.log('Already signed out...')
          global.isCheckedIn = false
        }
      } else if (value === 'Sign out') {
        if (isCheckIn) {
          console.log('Already signed in...')
          global.isCheckedIn = true
        } else {
          await elem.click()
          console.log('Do check out')
          global.isCheckedIn = false
          console.log('User has logged out')
        }
      }
    })

  await page.screenshot({ path: savePath })

  await browser.close()
}
