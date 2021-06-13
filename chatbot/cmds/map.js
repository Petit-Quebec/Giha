import { log } from '../../util/util.js'
import Discord from 'discord.js'
import { newInstance } from '../../Giha/instanceManager.js'

const help = {
  name: 'map',
  description: 'generate map image',
  format: '!map',
  note: 'this is for testing only right now',
}

const permissions = {
  userPermissions: {
    admin: true,
    dm: true,
    player: true,
  },
  locationPermissions: {
    activeGuild: true,
    passiveGuild: true,
    inactiveGuild: true,
    directMessage: true,
  },
}

const run = async (_bot, message) => {
  let msg = await message.channel.send('generating map...')

  try {
    let instance = newInstance()
    const imgData = await instance.renderMap()
    const embed = new Discord.MessageEmbed()
      .attachFiles([{ name: 'map.png', attachment: imgData }])
      .setImage('attachment://map.png')
    msg.delete()
    message.channel.send(embed)
  } catch (err) {
    log(err, true)
    let txt = `use the format ${help.format}\n` + err
    msg.edit(txt)
  }
}

export default {
  run,
  permissions,
  help,
}
