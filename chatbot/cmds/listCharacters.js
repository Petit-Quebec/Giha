import Character from '../../db/Character.js'

export const help = {
  name: 'listCharacters',
  description: 'admin command for checking all Characters'
}

export const permissions = {
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

export const run = async (_bot, message) => {
  let txt = await Character.listCharacters()
  await message.channel.send(txt)
}
