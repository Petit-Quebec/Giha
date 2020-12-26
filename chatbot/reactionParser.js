import { getUserByDiscordId } from '../Giha/userManager.js'
import { log } from '../util/util.js'
import reloadBotCommands from './commandLoader.js'
import { name } from '../util/util.js'

const INVALID_MSG_DELAY_MS = 5000
let lastCommandMsg

/* This file handles parsing of discord Messages */

export const parseReaction = (bot, messageReaction, user) => {
  if (bot.constructor.name != 'Client') {
    throw 'reactionParser Error: must pass a Discord Client to respond with'
  }
  if (messageReaction.constructor.name != 'MessageReaction') {
    throw 'reactionParser Error: must pass a reaction to parse'
  }
  if (user.constructor.name != 'User') {
    throw `reactionParser Error: must pass a user, not a ${user.constructor.name}`
  }
  let emoji = messageReaction.emoji
  let count = messageReaction.count
  let botReact = messageReaction.me
  let msg = messageReaction.message
  let reactionUserManager = messageReaction.users
}
