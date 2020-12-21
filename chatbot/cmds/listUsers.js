import User from '../../db/User.js'

export const help = {
  name: 'listUsers',
  description: 'admin command for checking all Users',
}

export const permissions = {
  userPermissions: {
    admin: true,
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

export const run = async (_bot, message) => {
  let txt = await User.listUsers()
  await message.channel.send(txt)
}
