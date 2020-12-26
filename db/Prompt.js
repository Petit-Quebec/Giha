import { TextChannel, DMChannel, Client } from 'discord.js'
import { message } from '../chatbot/messageParser.js'
import ResponseAction from './ResponseAction.js'
// a class that lets the bot manage asking questions and receiving information
// ie. send a message, react to itself, deal with responses
// ie. send a message, wait for a list of specific replies

/** Class representing an automated prompt to users
 * @class
 * @requires ./ResponseAction
 */
let Prompt = class Prompt {
  /**
   *
   * @param {Object} channel - the (Discord) Channel to send the prompt in
   * @param {boolean} isReusable - if this prompt goes away once it is used or if it keeps listening
   * @param {ResponseAction|[ResponseAction]} responseActions - what actions can happen as responses to this prompt
   * @param {Object} client - which (Discord) client to use for messaging
   * @param {string} msgContent - what content the prompt message should display
   * @param {Object} [msgOptions] - what message options (if any) the prompt should have (includes embeds)
   * Information on building messages is available here https://discord.js.org/#/docs/main/stable/class/TextChannel?scrollTo=send
   */
  constructor(
    channel,
    isReusable,
    responseActions,
    client,
    msgContent,
    msgOptions
  ) {
    // make sure message is a discord message
    if (!channel instanceof TextChannel && !channel instanceof DMChannel)
      throw 'Prompt Constructor Error: channel must be a Discord TextChannel or DMChannel'
    // check isReusable
    if (!typeof isReusable == 'Boolean')
      throw `Prompt Constructor Error: isReusable must be of type Boolean, not ${typeof isReusable}`

    // check and set client
    if (!client instanceof Client) throw 'Client must be a discord bot'
    if (Array.isArray(responseActions)) {
      // check and set responseActions
      // check every element to make sure it is a ResponseAction or Error
      responseActions.forEach((element) => {
        if (!element instanceof ResponseAction)
          throw `Prompt Constructor Error: All responseActions must be instances of ResponseAction`
      })
      this.responseActions = responseActions
    } else {
      // check the one thing to make sure it is a responseAction
      if (responseActions instanceof ResponseAction)
        this.responseActions = [responseActions]
      else
        throw `Prompt Constructor Error: responseActions must be an instance of ResponseAction`
    }
    // set everything
    this.isDM = channel instanceof DMChannel
    this.isReusable = isReusable
    this.channel = channel
    this.client = client
    this.message
    // everything is set up, now send the message
    channel
      .send(msgContent, msgOptions)
      .then((res) => {
        //save the message as part of the prompt
        this.message = res
        // if this prompt has emoji responseActions, add those options for the user
        this.responseActions.forEach((responseAction) => {
          if (responseAction.triggerType == 'emoji')
            res.react(responseAction.trigger)
        })
      })
      .catch((err) => {
        throw err
      })
  }

  /**
   * Trigger ay relevant responseAction
   * @param {string} userId - the userId string
   * @param {string} emoji - the emojiId string
   * returns true if there was a match,
   * otherwise returns false
   */
  trigger(userId, emojiId) {
    // check to see if this trigger matches any that we expect
    this.responseActions.forEach((responseAction) => {
      if (
        responseAction.triggerType == 'emoji' &&
        responseAction.trigger == emojiId
      )
        responseAction.act(userId)
      return true
    })
    return false
  }
}

export default Conversation
