import { log } from '../util/util.js'
const fs = require('fs');

const RELATIVE_CMD_PATH = `./cmds/`;
const ABSOLUTE_CMD_PATH = `./chatbot/cmds/`;

export default async (bot) => {
  if (bot.constructor.name != 'Client')
    throw 'cannot reload bot commands without a bot.'
  try {
    let files = fs.readdirSync(ABSOLUTE_CMD_PATH)
    let jsfiles = files.filter(f => f.split(".").pop() === "js")
    const numCmds = jsfiles.length
    log(` > □ Loading ${numCmds} commands!`)

    jsfiles.forEach((f, i) => {
			let props = require(RELATIVE_CMD_PATH + `${f}`).default
			log(`      command ${i+1}: ${f} loaded!`)
			bot.commands.set(props.help.name, props)
		})
    log(`   [commandLoader] ${numCmds} commands successfully loaded`, true)
    return numCmds
  } catch (e) {
    log('Error, a real bad one', true)
    log(e, true)
  }
  return true
}

export const deleteAllCommands = (bot) => {
  bot.commands.forEach((cmd) => {
    delete require.cache[require.resolve(RELATIVE_CMD_PATH + `${cmd.help.name}.js`)]
    bot.commands.delete(cmd.help.name)
  })
}
