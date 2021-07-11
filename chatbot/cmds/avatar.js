// avatar.js
const run = async (_bot, message) => {
  let msg = await message.channel.send('generating avatar...')

  await message.channel.send({
    files: [
      {
        attachment: message.author.displayAvatarURL,
        name: 'avatar.png',
      },
    ],
  })

  msg.delete()
}

const help = {
  name: 'avatar',
}

const permissions = {
  userPermissions: {
    admin: true,
    dm: true,
    player: true,
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
  help,
}
