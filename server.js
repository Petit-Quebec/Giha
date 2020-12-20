// start with npm run dev to run in development mode (refresh on save)
import dotenv from 'dotenv'
import { log, logBar } from './util/util.js'
import db from './db/db.js'
import chatbot from './chatbot/botserver.js'
import webserver from './webserver/webserver.js'
import readline from 'readline'
// import dbModify from './db/db_schema_modify.js'
dotenv.config()

const CHATBOT_ENABLED = process.env.CHATBOT_ENABLED == 1
const CONSOLE_CHAT_OVERRIDE = process.env.CONSOLE_CHAT_OVERRIDE == 1
const WEBSERVER_ENABLED = process.env.WEBSERVER_ENABLED == 1

let serverState = 0

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\x1b[35m  |>\x1b[0m ',
})

// serverState
// 0: booting services
// 1: service boot complete, checking setup

const bootMonitor = () => {
  const intervalObj = setInterval(() => {
    switch (serverState) {
      case 0:
        let serverOK =
          !WEBSERVER_ENABLED || (WEBSERVER_ENABLED && webserver.isReady())
        let chatbotOK =
          !CHATBOT_ENABLED || (CHATBOT_ENABLED && chatbot.isReady())
        let databaseOK = db.databaseReady()
        if (serverOK && chatbotOK && databaseOK) {
          log('\n Everything booted correctly!', true)
          logBar(1, true)
          serverState = 1
          if (CONSOLE_CHAT_OVERRIDE) {
            rl = runCLIBot()
            console.log(
              '\x1b[35m' +
                ' Chat Override Enabled: now parsing non-user-specific commands:' +
                '\x1b[0m'
            )
          }
          // Next Step
          if (CHATBOT_ENABLED) {
            serverState = 1
            chatbot.checkSetup()
          } else clearInterval(intervalObj)
        }
        break
      case 1:
        if (chatbot.isReady()) {
          logBar(1, true)
          clearInterval(intervalObj)
        }
        break
      default:
        break
    }
  }, 500)
}

const runCLIBot = () => {
  rl.on('line', (line) => {
    log(`Received: ${line}`, true)
    rl.prompt()
    if (line.substring(0, 6) == 'jester') {
      log('you found me!', true)
      // dbModify();
    }
  })

  log('\x1b[32m' + ' ✓' + '\x1b[0m' + ' CLI Bot Now Active' + '%s\x1b[0m')
  return rl
}

// do the things
log('\x1b[36m', '\n\n', true)
logBar(2, true)
log(' Starting Giha...\n', true)

bootMonitor()
// webserver.run();
chatbot.run()
logBar(1, true)
