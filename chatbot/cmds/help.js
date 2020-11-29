import { log } from '../../util/util.js'
import util from '../../util/util.js'
import userManager from '../../Giha/userManager.js'

let name = 'help'

export const help = {
  name: name,
  description:
    'help command, informs user of their role and available commands',
  format: `!${name}`,
  note: 'still only works for registered players and above'
}

export const permissions = {
  userPermissions: {
    admin: true,
    dm: true,
    player: true
  },
  locationPermissions: {
    activeGuild: true,
    passiveGuild: true,
    inactiveGuild: true,
    directMessage: true
  }
}

export const run = async (bot, message) => {
  let txt =
    '```ml\nHelp for GuildHall bot\n' +
    '-------------------------------\n' +
    'User Info:\n'
  let msg = await message.channel.send(txt + '\n```')

  // parse args and test them
  try {
    let user = await userManager.getUserByDiscordId(message.author.id)
    if (!util.isUser(user)) {
      log('help.run Error | user:', true)
      log(user, true)
      throw 'issue with help, no user found.'
    }

    txt += ` discordId: ${user.connections.discord.discordId}\n`
    txt += ` Permission Scopes: \n  ${user.scopes.toString()}\n`

    txt += 'Available Commands:\n'
    bot.commands.forEach((cmd) => {
      txt += ` !${cmd.help.name}\n`
    })

    msg.edit(txt + '\n```')
    log(txt, true)
  } catch (err) {
    // if there is a problem, log it and inform the user
    log(err, true)
    let txt = `use the format ${exports.help.format}\n` + err
    msg.edit(txt)
  }
}
