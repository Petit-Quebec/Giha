import Character from '../../db/Character.js'

module.exports.help = {
  name: 'listCharacters',
  description: 'admin command for checking all Characters'
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
  let txt = await Character.listCharacters()
  await message.channel.send(txt)
}
