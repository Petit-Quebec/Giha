import Discord from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

const token = process.env.TEST_DBOT_TOKEN

const bot = new Discord.Client({})
let testBotReady = false

const run = () => {
  bot.on('ready', () => {
    console.log(
      '\x1b[32m' +
        ' ✓' +
        '\x1b[0m' +
        ' Test Bot logged in under ' +
        '\x1b[7m' +
        bot.user.tag +
        '\x1b[0m'
    )
    testBotReady = true
    bot.on('message', async (msg) => {
      parseTestMessage(msg)
    })
  })

  bot
    .login(token)
    .then(console.log('  Test bot logging in...'))
    .catch(console.error)
}

const isReady = () => {
  return testBotReady
}

const parseTestMessage = (message) => {
  console.log(message.content)
  return false
}

const shutdown = () => {
  return bot.destroy()
}

export default { run, isReady, shutdown }
