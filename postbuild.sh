# mkdir _bin/tmp/notifiers
# mkdir _bin/tmp/vendor
mkdir _bin/tmp/notifier
cp -R ./node_modules/puppeteer/.local-chromium/* _bin/tmp/puppeteer/.local-chromium
chmod 777 _bin/tmp/puppeteer/.local-chromium
cp ./node_modules/node-notifier/vendor/terminal-notifier.app/Contents/MacOS/terminal-notifier _bin/tmp/notifier/terminal-notifier
cp ./node_modules/node-notifier/vendor/terminal-notifier.app/Contents/Info.plist _bin/tmp/notifier/Info.plist
cp ./node_modules/node-notifier/vendor/terminal-notifier.app/Contents/Resources/en.lproj/MainMenu.nib _bin/tmp/notifier/MainMenu.nib

chmod 777 _bin/tmp/notifier/terminal-notifier
cp ./settings.json _bin/tmp/settings.json