import { log } from '../../util/util.js'
import { getTestInstanceMap } from '../../db/instanceMap.js'
import render from '../../imgGen/map/renderer.js'
import fs from 'fs'
import Discord from 'discord.js'

export const help = {
    name: 'map',
    description: 'generate map image',
    format: '!map',
    note: 'this is for testing only right now',
  }

  export const permissions = {
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

  export const run = async (_bot, message) => {
      let msg = await message.channel.send('generating map...')
    
      try {
        const testMap = getTestInstanceMap()
        const imgData = await render(testMap)
        fs.writeFile('./map.png', imgData, 'base64', (err) => {
            console.log(err)
        })
        const embed = new Discord.MessageEmbed()
        .attachFiles(['./map.png'])
        .setImage('attachment://map.png')
        message.channel.send(embed)
      }
      catch (err) {
        log(err,true)
        //let txt = `use the format ${exports.help.format}\n`+ err
        //msg.edit(txt)
      }
  }