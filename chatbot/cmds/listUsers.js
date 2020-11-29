import User from '../../db/User.js'

module.exports.help = {
  name: 'listUsers',
  description: 'admin command for checking all Users'
}

module.exports.permissions = {
  userPermissions: {
    admin: true,
    dm: false,
    player: false
  },
  locationPermissions: {
    activeGuild: false,
    passiveGuild: false,
    inactiveGuild: false,
    directMessage: false
  }
}

module.exports.run = async (_bot, message) => {
  let txt = await User.listUsers()
  await message.channel.send(txt)
}
