// avatar.js
export const run = async (_bot, message) => {
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

export const help = {
  name: 'avatar',
}

export const permissions = {
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
