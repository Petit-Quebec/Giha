import { log } from '../../util/util.js'
import reloadBotCommands from '../commandLoader.js'
import { deleteAllCommands } from '../commandLoader.js'

let name = 'reload'

const run = async (bot, message) => {
  let msg = await message.channel.send('reloading commands...')
  // parse args and test them
  try {
    deleteAllCommands(bot);
    // do the actual operation
    let numCmds = await reloadBotCommands(bot)
    // update reply and log it
    let txt = `successfully reloaded ${numCmds} commands`
    msg.edit(txt)
    log(txt, true)
  } catch (err) {
    // if there is a problem, log it and inform the user
    log(err, true)
    let txt = `use the format ${help.format}\n` + err
    msg.edit(txt)
  }
}

const help = {
  name: name,
  description: 'command used to reload bot Commands',
  format: `!${name}`,
  note: '',
}

const permissions = {
  userPermissions: {
    admin: false,
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

export default {
  run,
  permissions,
  help,
}
