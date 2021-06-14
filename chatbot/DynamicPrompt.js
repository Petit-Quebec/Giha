import * as scenes from './scenes'

/** Class representing a prompt that can switch between scenes
 * @class
 * @requires ./ResponseAction
 * @requires ./Prompt
 */
export default DynamicPrompt = class DynamicPrompt extends Prompt {
  constructor(channel, client, scene, sceneOptions) {
    if (typeof scene != 'string')
      throw `scene needs to be a string - the name of the scene, not ${typeof scene}`
    if (sceneOptions && typeof sceneOptions != 'object')
      throw `if you want to pass scene Options in, they must be in an object, not ${typeof sceneOptions}`
    const sceneInfo = getSceneInfo(scene, sceneOptions)
    this.renderMsgContent = sceneInfo.renderMsgContent
    this.scene = scene

    // make the actual prompt
    super(
      channel,
      sceneInfo.promptBehavior, // from sceneInfo
      sceneInfo.responseActionGenerator(), // from sceneInfo
      client,
      this.renderMsgContent(), // from sceneInfo
      sceneInfo.reactCollectorOptions, // from sceneInfo
      sceneInfo.reactCollectorTimeoutCallback // from sceneInfo
    )
  }
  /**
   * re-renders
   */
  refresh() {
    this.setMessageContent(this.renderMsgContent())
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

  getSceneInfo(scene, sceneOptions) {
    const sceneNames = Object.keys(scenes)
    // validate that the scene exists
    if (sceneNames.find(scene) == -1)
      throw `${scene} was not found in the list of ${sceneNames.length} scenes`
    // see what it needs, make sure we got that

    // call it and get all the info from it
    return scenes[scene](this, sceneOptions)
  }
}
