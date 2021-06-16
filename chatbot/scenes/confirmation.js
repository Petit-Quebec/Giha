// This file has a set of hard/soft-coded logic that generates scenes
// it is split into four parts
//  1. the scene function, which compiles all the information and returns it
//  2. the renderer function, which builds a renderer and returns it
//  3. the responseActionGenerator function, which builds a response action generator and returns it
//  4. the timeoutCallback function, which builds the timeout logic - ie what happens when the scene times out
// the four of these together allow you to create dynamic templates for scenes

import ResponseAction from '../ResponseAction'

const confirmationScene = (promptCallback, sceneOptions) => {
  let targetScene = sceneOptions.targetScene
  let targetSceneOptions = sceneOptions.targetSceneOptions
  let confirmationMessage = sceneOptions.confirmationMessage

  const sceneInformation = {
    promptBehavior: 'noLimit', // behavior of the prompt, as specified in Prompt.js
    generateResponseAction: confirmationResponseActions(
      targetScene,
      targetSceneOptions
    ), // a function that returns an array of ResponseActions and takes no arguments
    renderMsgContent: confirmationEmbed(confirmationMessage), // a function that renders the msg content and takes no arguments
    reactCollectorOptions: { time: 6000000 }, // reaction collector options
    reactCollectorTimeoutCallback: () => {
      promptCallback({ reactions: 'clean' })
    }, //what do you do when it all times out
  }
  return sceneInformation
}

const confirmationResponseActions = (targetScene, targetSceneOptions) => {
  return () => {
    // response action with a check box that changes scene to instance
    let confirmationCallback = () => {
      promptCallback({
        targetScene: targetScene,
        sceneOptions: targetSceneOptions,
      })
    }
    let responseAction = new ResponseAction(
      'unicodeEmoji',
      '✅',
      confirmationCallback
    )
    return responseAction
  }
}

const confirmationEmbed = (confirmationMessage) => {
  return () => {
    let embed = new Discord.MessageEmbed()
      .setColor('#00FF00')
      .addFields({ name: 'Confirmation', value: confirmationMessage })
    return embed
  }
}

export default confirmationScene
