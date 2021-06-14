import Discord from 'discord.js'
import ResponseAction from '../ResponseAction'

export default explorationScene = (prompt, sceneOptions) => {
  let instance = sceneOptions.instance
  const sceneInformation = {
    promptBehavior: 'noLimit', // behavior of the prompt, as specified in Prompt.js
    generateResponseAction: explorationResponseActions(prompt, instance), // a function that returns an array of ResponseActions and takes no arguments
    renderMsgContent: explorationEmbed(instance), // a function that renders the msg content and takes no arguments
    reactCollectorOptions: { time: 60000 }, // reaction collector options
    reactCollectorTimeoutCallback: () => {}, //what do you do when it all times out
  }
  return sceneInformation
}

const explorationResponseActions = (prompt, instance) => {
  return () => {
    const move = (direction) => {
      instance.move(direction)
      prompt.refresh()
      prompt.stripReactions()
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
