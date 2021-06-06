import db from '../../db/db.js'
import { log } from '../../util/util.js'

const run = async (_bot, message) => {
  let msg = await message.channel.send('generating player info...')

  let playerArray = await db.getFullCollectionArray('players')

  await message.channel.send(playerInfo(playerArray))

  msg.delete()
}

function playerInfo(playerArray) {
  let infoString = `There are currently ${playerArray.length} active players`
  playerArray.forEach((player) => {
    log(player, true)
    infoString += `\n ${player.discordHandle}: \n  DiscordID: ${player.discordId}`
  })
  return infoString
}

const help = {
  name: 'players',
  description: 'prints out information about all registered players',
}

const permissions = {
  userPermissions: {
    admin: true,
    dm: true,
    player: false,
  },
  locationPermissions: {
    activeGuild: true,
    passiveGuild: false,
    inactiveGuild: false,
    directMessage: true,
  },
}

export default {
  run,
  permissions, 
  help
}
