// import { TextChannel, DMChannel, Client } from 'discord.js'
import Discord from 'discord.js'
import ResponseAction from './ResponseAction.js'
import dotenv from 'dotenv'
dotenv.config()
const ENV = process.env.ENV
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
    if (
      !(channel instanceof Discord.TextChannel) &&
      !(channel instanceof Discord.DMChannel)
    )
      throw 'Prompt Constructor Error: channel must be a Discord TextChannel or DMChannel'
    // check isReusable
    if (!(typeof isReusable == 'boolean'))
      throw `Prompt Constructor Error: isReusable must be of type Boolean, not ${typeof isReusable}`

    // check and set client
    if (!(client instanceof Discord.Client))
      throw 'Client must be a discord bot'
    if (Array.isArray(responseActions)) {
      // check and set responseActions
      // check every element to make sure it is a ResponseAction or Error
      responseActions.forEach((element) => {
        if (!(element instanceof ResponseAction))
          throw 'Prompt Constructor Error: All responseActions must be instances of ResponseAction'
      })
      this.responseActions = responseActions
    } else {
      // check the one thing to make sure it is a responseAction
      if (responseActions instanceof ResponseAction)
        this.responseActions = [responseActions]
      else
        throw 'Prompt Constructor Error: responseActions must be an instance of ResponseAction'
    }
    // set everything
    this.isDM = channel instanceof Discord.DMChannel
    this.isReusable = isReusable
    this.channel = channel
    this.client = client
    this.reactCollector
    this.reactFilter = this.createReactFilter()
    this.message
    this.reactionPromises
    this.messagePromise = new Promise((resolve, reject) => {
      // everything is set up, now send the message
      try {
        channel
          .send(
            client.user.username,
            // msgContent
            msgOptions
          )
          .then((res) => {
            //save the message as part of the prompt
            this.message = res
            this.reactionPromises = this.addReactionButtons()
            this.reactCollector = this.message.createReactionCollector(
              // dummy reaction filter because I don't trust discord's filtering
              () => {
                return true
              },
              { time: 15000 }
            )
            this.reactCollector.on('collect', (reaction) => {
              // console.log(`collected ${reaction.emoji.name}`)

              let userCache = reaction.users.cache.array()
              let user = userCache.pop()
              let reactionId = reaction._emoji.id
              //do our own, more reliable filtering
              if (this.reactFilter(reactionId, user)) {
                // console.log('reaction valid')
                this.trigger(user, reactionId)
              } else {
                // console.log('reaction invalid')
              }
            })
            this.reactCollector.on('end', (collected) =>
              console.log(`collected ${collected.size} items`)
            )

            // if this prompt has emoji responseActions, add those options for the user
            resolve(res)
          })
          .catch((err) => {
            throw err
          })
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * Delete the prompt
   * removes pointers to responseActions
   * returns the promise for deleting the message
   */
  delete() {
    // this.responseActions.forEach((responseAction) => {
    //   responseAction = null
    // })
    return this.message.delete()
  }

  /**
   * adds any reactions that are used by responseActions
   * returns an array of promises to add the reactions
   */
  async addReactionButtons() {
    let reactions = []
    for (let responseAction of this.responseActions) {
      if (responseAction.triggerType == 'emoji') {
        reactions.push(await this.message.react(responseAction.trigger))
      }
    }
    return reactions
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

  /**
   * removes all reactions from the message
   */
  cleanReactions() {
    return this.message.reactions.removeAll()
  }
  /**
   * removes all reactions and adds default reactions
   * returns the same promise as adding reactions
   */
  refreshReactions() {
    return new Promise((resolve, reject) => {
      this.cleanReactions()
        .then(() => {
          this.addReactionButtons()
            .then((res) => {
              resolve(res)
            })
            .catch((err) => {
              reject(err)
            })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  createReactFilter() {
    return (reactionId, user) =>
      this.responseActions.find((responseAction) => {
        return responseAction.trigger == reactionId
      }) &&
      user.id != this.client.user.id &&
      (!user.bot || ENV == 'DEV')
  }
}
/*
const createReactFilter = (client, responseActions) => {
  if (!client || client == undefined) throw 'client must be defined'
  let clientId = client.id
  let emojiList = []
  responseActions.forEach((responseAction) => {
    if (responseAction.triggerType == 'emoji')
      emojiList.push(responseAction.trigger)
  })
  return (reaction, user) => {
    if (env == 'DEV') {
      // // console.log('dev enabled')
      // console.log('user.id')
      // console.log(user.id)
      // console.log('user.username')
      // console.log(user.username)
      // console.log('client.id')
      // console.log(clientId)
      return user.id != clientId
      // emojiList.includes( reaction.emoji.id )
    } else return emojiList.includes(reaction.emoji.id) && !user.bot
  }
}*/

export default Prompt
