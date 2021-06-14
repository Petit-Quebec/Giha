import Discord from 'discord.js'
import Instance, { INSTANCE_STATE } from '../../db/Instance'
import { log } from '../../util/util'
import ResponseAction from '../ResponseAction'

const explorationScene = (promptCallback, sceneOptions) => {
  let instance = sceneOptions.instance
  if (!instance || !(instance instanceof Instance))
    throw `SceneError: exploration scene needs an instance to connect to, not a ${typeof instance}`
  const sceneInformation = {
    promptBehavior: 'noLimit', // behavior of the prompt, as specified in Prompt.js
    generateResponseAction: explorationResponseActions(
      promptCallback,
      instance
    ), // a function that returns an array of ResponseActions and takes no arguments
    renderMsgContent: explorationEmbed(instance), // a function that renders the msg content and takes no arguments
    reactCollectorOptions: { time: 60000 }, // reaction collector options
    reactCollectorTimeoutCallback: () => {
      promptCallback({ reactions: 'clean' })
    }, //what do you do when it all times out
  }
  return sceneInformation
}

const explorationResponseActions = (promptCallback, instance) => {
  return () => {
    const move = (direction) => {
      let explorationEvent = instance.move(direction)
      if (explorationEvent && instance.state != INSTANCE_STATE.EXPLORATION) {
        log(`event: ${explorationEvent}`, true)
        promptCallback({
          targetScene: explorationEvent,
          sceneOptions: {
            shroomHunt: instance.activeEncounter,
          },
        })
      } else {
        promptCallback({
          rerender: true,
          reactions: 'strip',
        })
      }
    }

    const up = new ResponseAction('unicodeEmoji', '⬆️', () => {
      move('up')
    })
    const down = new ResponseAction('unicodeEmoji', '⬇️', () => {
      move('down')
    })
    const right = new ResponseAction('unicodeEmoji', '➡️', () => {
      move('right')
    })
    const left = new ResponseAction('unicodeEmoji', '⬅️', () => {
      move('left')
    })

    return [left, up, down, right]
  }
}

const explorationEmbed = (instance) => {
  return () => {
    const coords = instance.partyCoordinates
    let embed = new Discord.MessageEmbed()
      .setColor('#000000')
      .setTitle('Instance')
      .addFields(
        { name: 'Map', value: '```' + instance.renderASCII() + '```' },
        { name: 'coords', value: `x:${coords.x} y:${coords.y}` }
      )
    return embed
  }
}

export default explorationScene
