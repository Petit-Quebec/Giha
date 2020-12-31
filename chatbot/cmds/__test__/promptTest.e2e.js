import { Emoji } from 'discord.js'
import Prompt from '../../Prompt'
import ResponseAction from '../../ResponseAction'
import testBot from '../../discoTest/testBot'
import chatBot from '../../botserver'

let callback = () => {
  return true
}

let test = () => {
  let channel = testBot.getTestChannel()
  let isReusable = true
  let responseActions
  let client = chatBot.bot
  let msgContent = 'this is a test message'
  let msgOptions = {}

  let testEmoji = testBot.getTestEmoji()
  // make a new responseActrion

  responseActions = new ResponseAction('emoji', testEmoji, callback)
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
