import User from '../../db/User.js'

const help = {
  name: 'listUsers',
  description: 'admin command for checking all Users',
}

const permissions = {
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

const run = async (_bot, message) => {
  let txt = await User.listUsers()
  await message.channel.send(txt)
}

export default {
  run,
  permissions,
  help,
}
