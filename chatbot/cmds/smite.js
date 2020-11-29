import {
  isUserInitialized,
  updateUserPermissionsById
} from '../../Giha/userManager.js'
import { log } from '../../util/util.js'

export const help = {
  name: 'smite',
  description: 'revokes admin and dm powers from a player'
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

export const run = async (bot, message, args) => {
  // let user = message.author

  log('args:')
  log(args)
  // check to see if discord ID is valid

  if (args.length == 0) {
    message.channel.send('please specify who to target with @')
    return
  }

  const guilds = bot.guilds
  const guild = guilds.get(message.guild.id)
  log('guild:')
  log(guild)
  let discordId = args[0].slice(3, args[0].length - 1) //message.author.id;
  let member = guild.member(discordId)
  if (!member) {
    message.channel.send(
      `${discordId} is not a valid discord ID from this guild. As a result, no player <@${discordId}> has been initialized`
    )
  }

  if (await isUserInitialized(discordId)) {
    let result = await updateUserPermissionsById(discordId, {
      admin: false,
      dm: false
    })
    if (result.modifiedCount == 1) {
      log('Smite successful!', true)
      message.channel.send('Smited!')
    }
  } else {
    message.channel.send("you can't smite an uninitialized player")
    log('Cannot assign role, player not initialized.')
  }
}
