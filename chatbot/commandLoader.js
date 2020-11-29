import { log } from '../util/util.js'
import jsUtil from 'util'
import fs from 'fs'
import cmds from './cmds/index.js'

const promisify = jsUtil.promisify
fs.readdirAsync = promisify(fs.readdir)

const RELATIVE_CMD_PATH = './cmds/'
const ABSOLUTE_CMD_PATH = './chatbot/cmds/'

export default async (bot) => {
  if (bot.constructor.name != 'Client')
    throw 'cannot reload bot commands without a bot.'
  try {
    const keys = Object.keys(cmds)
    const numCmds = keys.length
    log(` > □ Loading ${numCmds} commands!`)

    keys.forEach((key, i) => {
      let props = cmds[key]
      log(`    command ${i + 1}: ${key} loaded!`)
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
