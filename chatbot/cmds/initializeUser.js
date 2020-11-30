import { newUser } from '../../Giha/userManager.js'
import { log } from '../../util/util.js'

const name = 'initializeUser'

export const help = {
  name: name,
  description:
    'attempts to initialize a given member of current guild without doing a role check',
  format: `!${name} @user`
}

export const permissions = {
  userPermissions: {
    admin: true,
    dm: true,
    player: false
  },
  locationPermissions: {
    activeGuild: true,
    passiveGuild: false,
    inactiveGuild: false,
    directMessage: true
  }
}

export const run = async (bot, message, args) => {
  let msg = await message.channel.send('initializing user')

  // parse args and test them
  try {
    let guild = message.guild
    if (args.length < 1)
      throw `awardXp requires at least 1 argument (you provided ${args.length})`
    let discordId = args[0].slice(3, args[0].length - 1)
    let member = guild.member(discordId)
    if (!member) {
      message.channel.send(
        `${discordId} is not a valid discord ID from this guild. As a result, no User <@${discordId}> has been initialized`
      )
    }
    // let target
    // let xp
    // do the actual operation
    let newUserConnection = {
      discord: {
        discordHandle: message.author.username,
        discordId: discordId
      }
    }
    let res = await newUser(message.author.username, newUserConnection)

    // update reply and log it
    let txt = `successfully initialized user ${res.handle}`
    msg.edit(txt)
    log(txt, true)
  } catch (err) {
    // if there is a problem, log it and inform the user
    log(err, true)
    let txt = `use the format ${exports.help.format}\n` + err
    msg.edit(txt)
  }
}
