import { log } from '../../util/util.js'
import userManager from '../../Giha/userManager.js'
import aggregations from '../../Giha/aggregations.js'

export const help = {
  name: 'adminStats',
  description: 'admin command for checking all Characters'
}

export const permissions = {
  userPermissions: {
    admin: true,
    dm: true,
    player: true
  },
  locationPermissions: {
    activeGuild: false,
    passiveGuild: false,
    inactiveGuild: false,
    directMessage: false
  }
}

export const run = async (_bot, message) => {
  let msg = await message.channel.send('generating stats...')
  try {
    let user = await userManager.getUserByDiscordId(message.author.id)
    let txt = await aggregations.userStatsBlurb(user)
    if (txt) msg.edit(txt)
    else throw 'something went wrong!'
  } catch (err) {
    log('Error', true)
    log(err, true)
    msg.edit(err)
  }
}
