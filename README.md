# Requirements
- Nodejs

# How to run
- Create a `.env` file in root folder with following content:
```
HOST=<your_host> (eg https://odoo.company.com)
USERNAME=<your_email>
PASSWORD=<your_password>
```
- `npm start`
- Wait for the notification to display, then click on it to proceed

# How to run standalone version
- Create a `settings.json` in same folder as your executable file with content:
```
{
    "host": "<your_host>",
    "username": "<your_email>",
    "password": "<your_password>",
    "headless": true|false
}
```

# Troubleshooting
## MacOS
- Notifications display very quick and disappear if other notifications take place
[Enabling Alerts](https://github.com/mikaelbr/node-notifier/issues/172)

## Linux

## Windows