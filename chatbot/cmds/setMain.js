import { getUserByDiscordId } from '../../Giha/userManager.js'
import { userStatsBlurb } from '../../Giha/aggregations.js'

export const help = {
  name: 'setMain',
  description: 'command for designating a character as your main character',
}

export const permissions = {
  userPermissions: {
    admin: true,
    dm: true,
    player: true,
  },
  locationPermissions: {
    activeGuild: false,
    passiveGuild: false,
    inactiveGuild: false,
    directMessage: false,
  },
}

export const run = async (_bot, message) => {
  // get user object
  let user = await getUserByDiscordId(message.author.id)
  // get character from
  // let character = await characterManager.getCharacterBy
  let txt = await userStatsBlurb(user)
  await message.channel.send(txt)
}
