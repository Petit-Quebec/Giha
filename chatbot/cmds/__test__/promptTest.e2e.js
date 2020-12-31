import { Emoji } from 'discord.js'
import Prompt from '../../Prompt'
import ResponseAction from '../../ResponseAction'

let callback = () => {
  return true
}

let test = (bot, testBot, testChannel) => {
  let channel = testBot
  let isReusable
  let responseActions
  let client
  let msgContent
  let msgOptions
  // make a new responseActrion
  new ResponseAction('emoji', Emoji, callback)
  new Prompt(
    channel,
    isReusable,
    responseActions,
    client,
    msgContent,
    msgOptions
  )
  // make a new prompt
  // then have the test bot react to it
  // then make sure that the propper function is called
  return new Promise((resolve, reject) => {
    resolve('desu')
  })
}
