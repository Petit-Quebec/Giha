// import { TextChannel, DMChannel, Client } from 'discord.js'
import Discord from 'discord.js'
import ResponseAction from './ResponseAction.js'
import dotenv from 'dotenv'
dotenv.config()
const ENV = process.env.ENV
// a class that lets the bot manage asking questions and receiving information
// ie. send a message, react to itself, deal with responses
// ie. send a message, wait for a list of specific replies

const promptBehaviors = {
  oneClick: 'oneClick', // first user that clicks  activates callback, can be cleared by refreshReactions
  oneClickPerUser: 'oneClickPerUser', // first time a user clicks, callback activates, can be cleared by refreshReactions
  noLimit: 'noLimit', // not recommended, buggy and results in callback being called multiple times and idk why
}

/** Class representing an automated prompt to users
 * @class
 * @requires ./ResponseAction
 */
let Prompt = class Prompt {
  /**
   *
   * @param {Object} channel - the (Discord) Channel to send the prompt in
   * @param {string} behavior - how this prompt should behave, more information is in Prompt.js
   * @param {ResponseAction|[ResponseAction]} responseActions - what actions can happen as responses to this prompt
   * @param {Object} client - which (Discord) client to use for messaging
   * @param {string} msgContent - what content the prompt message should display
   * @param {Object} [msgOptions] - what message options (if any) the prompt should have (includes embeds)
   * @param {Object} [reactCollectorOptions] - what reactCollector options (if any) the prompt should have (includes things like expiry time for watching reactions[defaults to 60 seconds)
   * @param {Object} [reactCollectorTimeoutCallback] - function to call when the react collector expires - will clear reactions by default
   * Information on building messages is available here https://discord.js.org/#/docs/main/stable/class/TextChannel?scrollTo=send
   */
  constructor(
    channel,
    promptBehavior,
    responseActions,
    client,
    msgContent,
    msgOptions,
    reactCollectorOptions,
    reactCollectorTimeoutCallback
  ) {
    // make sure message is a discord message
    if (
      !(channel instanceof Discord.TextChannel) &&
      !(channel instanceof Discord.DMChannel)
    )
      throw 'Prompt Constructor Error: channel must be a Discord TextChannel or DMChannel'
    // check isReusable
    let behavior = promptBehaviors[promptBehavior]
    if (!behavior) throw `${promptBehavior} is not a valid prompt behavior`

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
    this.channel = channel
    this.behavior = behavior
    this.client = client
    this.reactCollector
    this.reactFilter = this.createReactFilter()
    this.message
    this.reactionPromises
    this.reactHistory = []
    this.messagePromise = new Promise((resolve, reject) => {
      // everything is set up, now send the message
      try {
        channel
          .send(msgContent, msgOptions)
          .then((res) => {
            //save the message as part of the prompt
            this.message = res
            this.reactionPromises = this.addReactionButtons()
            this.reactCollector = this.message.createReactionCollector(
              // dummy reaction filter because I don't trust discord's filtering
              () => {
                return true
              },
              reactCollectorOptions ? reactCollectorOptions : { time: 60000 }
            )
            this.reactCollector.on('collect', (reaction) => {
              // console.log(`collected ${reaction.emoji.name}`)

              let userCache = reaction.users.cache.array()
              let user = userCache.pop()
              let reactionIdentifier
              if (reaction._emoji.id == null)
                reactionIdentifier = reaction._emoji.name
              else reactionIdentifier = reaction._emoji.id
              //do our own, more reliable filtering
              if (this.reactFilter(reactionIdentifier, user)) {
                console.log('reaction valid')
                this.reactHistory.push({
                  user: user,
                  reactionIdentifier: reactionIdentifier,
                })
                this.trigger(user, reactionIdentifier)
              } else {
                // console.log('reaction invalid')
              }
            })
            this.reactCollector.on('end', (collected) => {
              console.log(`collected ${collected.size} items`)
              if (reactCollectorTimeoutCallback) reactCollectorTimeoutCallback()
              else {
                this.cleanReactions()
              }
            })

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
        reactions.push(this.message.react(responseAction.trigger))
      } else if (responseAction.triggerType == 'unicodeEmoji') {
        reactions.push(this.message.react(responseAction.trigger))
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
  trigger(userId, emoji) {
    // check to see if this trigger matches any that we expect
    for (let responseAction of this.responseActions) {
      if (
        responseAction.triggerType == 'emoji' &&
        responseAction.trigger == emoji
      ) {
        responseAction.act(userId)
        return true
      } else if (
        responseAction.triggerType == 'unicodeEmoji' &&
        responseAction.trigger == emoji
      ) {
        responseAction.act(userId)
        return true
      }
    }
    return false
  }

  /**
   * removes all reactions from the message
   */
  cleanReactions() {
    return this.message.reactions.removeAll()
  }
  /**
   * removes all reactions that werent from the bot
   */
  stripReactions() {
    return new Promise((resolve, reject) => {
      const userReactions = this.message.reactions.cache.filter((reaction) =>
        reaction.users.cache.has(this.client.user.id)
      )

      let reactionRemovePromises = []
      for (const reaction of userReactions.values()) {
        // log(reaction.user.cache)
        reaction.users.cache.forEach((user) => {
          // console.log(user)
          if (user.id != this.client.user.id) {
            reaction.users
              .remove(user.id)
              .then((res) => {
                reactionRemovePromises.push(res)
                resolve(res)
              })
              .catch((err) => {
                reject(err)
                console.log('failed to remove reactions', true)
              })
          }
        })
      }
    })
  }

  createReactFilter() {
    let filter = (reactionId, user) => {
      // emoji check
      let emojiCheck = this.responseActions.find((responseAction) => {
        // is the emoji a valid one
        return responseAction.trigger == reactionId
      })

      let userCheck = user.id != this.client.user.id // was the reaction done by something other than the bot

      let botCheck = !user.bot || ENV == 'DEV' // the test bot is okay if we are in dev mode //behavioral check
      // behavior check
      let behaviorCheck
      switch (this.behavior) {
        case 'oneClick':
          behaviorCheck = this.reactHistory.length == 0
          break
        case 'oneClickPerUser':
          behaviorCheck =
            undefined ==
            this.reactHistory.find((reactLog) => {
              return (
                reactLog.user === user && reactLog.reactionId === reactionId
              )
            })
          break
        case 'noLimit':
          behaviorCheck = true
          break
        default:
          console.log(`${this.behavior} is not a valid behavior setting`)
          break
      }

      // console.log(emojiCheck)
      // console.log(behaviorCheck)
      // console.log(userCheck)
      // console.log(botCheck)
      return emojiCheck && behaviorCheck && userCheck && botCheck
    }
    return filter
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
