import { log, isUser } from '../../util/util.js'
import { getUserByDiscordId } from '../../Giha/userManager.js'
import { awardXp } from '../../Giha/characterManager.js'

let name = 'templateCmd'

const help = {
  name: name,
  description: 'templated command to be copied to new commands',
  format: `!${name} @user <numberAmount>`,
  note: 'if xp is floating point, it will be rounded',
}

const permissions = {
  userPermissions: {
    admin: false,
    dm: false,
    player: false,
  },
  locationPermissions: {
    activeGuild: false,
    passiveGuild: false,
    inactiveGuild: false,
    directMessage: false,
  },
}

const run = async (bot, message, args) => {
  let msg = await message.channel.send('performing function...')

  // parse args and test them
  try {
    if (args.length < 1)
      throw `awardXp requires at least 1 argument (you provided ${args.length})`
    let discordId = args[0].slice(3, args[0].length - 1)
    let target
    let xp
    target = await getUserByDiscordId(discordId)
    if (!isUser(target)) {
      throw `issue with awarding Xp to ${args[0]}, please tag the user you wish to give Xp to.`
    }
    xp = parseInt(args[1])
    if (isNaN(xp) || typeof xp != 'number')
      throw `issue with awarding xp amount '${args[1]}', numbers only please.`

    // do the actual operation
    let res = await awardXp(target, xp)

    // update reply and log it
    let txt = `successfully awarded ${xp} xp! ${res.firstName} only needs ${
      res.remainingExperience
    } to hit level ${res.level + 1}`
    msg.edit(txt)
    log(txt, true)
  } catch (err) {
    // if there is a problem, log it and inform the user
    log(err, true)
    let txt = `use the format ${help.format}\n` + err
    msg.edit(txt)
  }
}

export default {
  run,
  permissions, 
  help
}
