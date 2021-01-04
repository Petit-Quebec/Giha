// a class that defiens how the bot responds to responses to prompts
// ie. user hit's the sword emoji, bot should figure out an attack

import { Emoji } from 'discord.js'

/** Class representing an action the bot takes after a user response to a Prompt
 * @class
 */
let ResponseAction = class ResponseAction {
  /**
   * Create a ResponseAction
   * @param {string} triggerType - wether the expected response is to an emoji reaction or text
   * @param {string | Emoji} trigger - which emoji or text string triggers this action
   * @callback action - a callback which accepts the userId as an argument, called when response occurs
   */
  constructor(triggerType, trigger, action) {
    // check types, etc.
    if (triggerType != 'emoji')
      throw `ResponseAction Constructor Error: triggerType can be either 'emoji' or 'message', not '${triggerType}'`
    if (!(trigger instanceof Emoji))
      throw `ResponseAction Constructor Error: trigger must be an instance of Discord Emoji, not '${typeof trigger}'`
    if (typeof action != 'function')
      throw `ResponseAction Constructor Error: action must be a callback function, not ${typeof action}`

    if (triggerType == 'emoji') {
    } // make sure that the emoji string is a valid emoji

    this.triggerType = triggerType
    this.trigger = trigger
    this.action = action
  }
  /**
   * The response occurred, time to act
   * @param {Object} userId - the userId of the user who made the response
   */
  act(userId) {
    this.action(userId)
  }
}

export default ResponseAction
