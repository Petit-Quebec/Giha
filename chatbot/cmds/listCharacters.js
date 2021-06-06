import Character from '../../db/Character.js'

const help = {
  name: 'listCharacters',
  description: 'admin command for checking all Characters',
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
  let txt = await Character.listCharacters()
  await message.channel.send(txt)
}

export default {
  run,
  permissions, 
  help
}
