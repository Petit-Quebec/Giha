import dotenv from 'dotenv'
import { log } from '../util/util.js'
import { message } from './messageParser.js'
import reloadBotCommands from './commandLoader.js'
import Discord from 'discord.js'
import { checkGuilds } from './guildManager.js'
import { newRole, removedRole } from './events/roleChange.js' // if more events are added this should be abstracted out
import nameChange from './events/nameChange.js'
import timeManager from './timeManager.js'

dotenv.config({ path: '/../.env' })
const CHATBOT_ENABLED = process.env.CHATBOT_ENABLED == 1
const token = process.env.DBOT_TOKEN

let chatbotReady = false

const bot = new Discord.Client({ disableEveryone: true })
bot.commands = new Discord.Collection()
reloadBotCommands(bot)

// initialize commands

const run = () => {
  if (CHATBOT_ENABLED) {
    bot.on('ready', () => {
      log(
        '\x1b[32m' +
          ' ✓' +
          '\x1b[0m' +
          ' Discord Bot logged in under ' +
          '\x1b[7m' +
          bot.user.tag +
          '\x1b[0m',
        true
      )
      chatbotReady = true
      log('bot.commands:')
      bot.commands.forEach((command) => {
        log(command.help.name)
      })
      timeManager()
    })

    bot.on('message', async (msg) => {
      message(bot, msg)
    })

    bot.on('guildMemberUpdate', (oldMember, newMember) => {
      memberUpdate(oldMember, newMember)
    })

    bot.on('error', (err) => {
      log('\x1b[31m', true)
      log(err.error, true)
      if (Object.entries(err.error)[0][1] == 'SELF_SIGNED_CERT_IN_CHAIN') {
        log(
          '\nBot was blocked by a certificate issue, may be a firewall problem.' +
            '\n shutting bot down.',
          true
        )
        // bot.destroy().then(() => {
        //   log(' Discord bot bot shut down successful.', true)
        // });
      }
      log('\x1b[0m', true)
    })

    bot.on('reconnecting', () => {
      log('Discord Bot attempting to reconnect...', true)
    })

    bot
      .login(token)
      .then(log('  Discord bot logging in...', true))
      .catch(console.error)
  }
}

const isReady = () => {
  return chatbotReady
}

const checkSetup = () => {
  chatbotReady = false
  checkGuilds(bot).then((chatbotReady = true))
}

const memberUpdate = (oldMember, newMember) => {
  if (!oldMember.roles.equals(newMember.roles)) {
    // the member update was a change in rolls
    if (oldMember.roles.array().length < newMember.roles.array().length)
      newRole(oldMember, newMember)
    else removedRole(oldMember, newMember)
  } else if (oldMember.nickname != newMember.nickname) {
    nameChange(oldMember, newMember)
  }
  // find difference in roles
  // if DnD player role was added, initialize player
  // if DnD player role was removed, mark player as inactive.
}

export default {
  run,
  isReady,
  checkSetup,
}
