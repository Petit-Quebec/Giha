import Prompt from './Prompt.js'
import * as scenes from './scenes'

/** Class representing a prompt that can switch between scenes
 * @class
 * @requires ./ResponseAction
 * @requires ./Prompt
 */
const DynamicPrompt = class DynamicPrompt extends Prompt {
  constructor(channel, client, scene, sceneOptions) {
    if (typeof scene != 'string')
      throw `scene needs to be a string - the name of the scene, not ${typeof scene}`
    if (sceneOptions && typeof sceneOptions != 'object')
      throw `if you want to pass scene Options in, they must be in an object, not ${typeof sceneOptions}`

    let refreshCallback = (refreshOptions) => {
      if (refreshOptions.render) this.setMessageContent(this.renderMsgContent())
      if (refreshOptions.reactions) this.stripReactions()
    }

    const sceneInfo = getSceneInfo(scene, sceneOptions, refreshCallback)

    console.log(sceneInfo)
    // make the actual prompt
    super(
      channel,
      sceneInfo.promptBehavior, // from sceneInfo
      sceneInfo.generateResponseAction(), // from sceneInfo
      client,
      sceneInfo.renderMsgContent(), // from sceneInfo
      sceneInfo.reactCollectorOptions, // from sceneInfo
      sceneInfo.reactCollectorTimeoutCallback // from sceneInfo
    )

    this.renderMsgContent = sceneInfo.renderMsgContent
    this.scene = scene
  }

  /**
   * changes scene, figures out response action
   * resets response actions
   * re-renders
   */
  changeScene(scene) {
    if (typeof scene != 'string')
      throw `scene needs to be a string - the name of the scene, not ${typeof scene}`
    // getSceneInfo(scene, sceneOptions) of the new scene
    // this.scene = scene
    // update the prompt to behave properly
  }
}

const getSceneInfo = (scene, sceneOptions, refreshCallback) => {
  const sceneNames = Object.keys(scenes)
  // validate that the scene exists
  const sceneResult = sceneNames.find((element) => element == scene)
  if (sceneResult == -1)
    throw `${scene} was not found in the list of ${sceneNames.length} scenes`
  // see what it needs, make sure we got that

  // call it and get all the info from it
  return scenes[sceneResult](refreshCallback, sceneOptions)
}

export default DynamicPrompt
