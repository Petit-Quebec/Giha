import { log } from '../../util/util.js'
import ShroomHunt from '../../Giha/Encounters/shroomHunting.js'
import ResponseAction from '../ResponseAction.js'
import Scene from '../Scene.js'

let name = 'huntShrooms'

const help = {
  name: name,
  description: 'command to kickoff mushroom minigame',
  format: `!${name}`,
  note: 'this is just a test, do not be alarmed',
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

const run = async (bot, message, args) => {
  if (args) {
    //this is unused
  }
  let msg = await message.channel.send('performing function...')
  try {
    // make new mushroom hunt
    let shroomHunt = new ShroomHunt(7)

    let shroomPrompt = new Scene(message.channel, bot, 'shroomHunt', {
      shroomHunt: shroomHunt,
    })
  } catch (err) {
    // if there is a problem, log it and inform the user
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
