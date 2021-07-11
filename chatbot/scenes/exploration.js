import Discord from 'discord.js'
import Instance from '../../db/Instance'
import { log } from '../../util/util'
import ResponseAction from '../ResponseAction'

const INSTANCE_STATE = {
  EXPLORATION: 'EXPLORATION',
  ENCOUNTER: 'ENCOUNTER',
  PROMPT: 'PROMPT',
}

const explorationScene = (promptControls, sceneOptions) => {
  let instance = sceneOptions.instance
  if (!instance || !(instance instanceof Instance))
    throw `SceneError: exploration scene needs an instance to connect to, not a ${typeof instance}`
  const sceneInformation = {
    promptBehavior: 'noLimit', // behavior of the prompt, as specified in Prompt.js
    generateResponseAction: explorationResponseActions(
      promptControls,
      instance
    ), // a function that returns an array of ResponseActions and takes no arguments
    renderMsgContent: explorationEmbed(instance), // a function that renders the msg content and takes no arguments
    reactCollectorOptions: { time: 60000 }, // reaction collector options
    reactCollectorTimeoutCallback: () => {
      promptControls.reactions.clear()
    }, //what do you do when it all times out
  }
  return sceneInformation
}

const explorationResponseActions = (promptControls, instance) => {
  return () => {
    const move = (direction) => {
      // let explorationEvent = 
      instance.move(direction)

      if (instance.state == INSTANCE_STATE.EXPLORATION) {
        promptControls.rerender()
        promptControls.reactions.strip()
      }
      else if(instance.state == INSTANCE_STATE.ENCOUNTER){
        let encounter = instance.getLocation().encounter
        log(`event: ${encounter}`, true)
        promptControls.changeScene(encounter, {shroomHunt: instance.activeEncounter})
      }
      else if (instance.state == INSTANCE_STATE.PROMPT){
        console.log('listen man idk')
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
