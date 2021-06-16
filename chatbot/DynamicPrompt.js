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
      throw `DynamicPromptError: scene needs to be a string - the name of the scene, not ${typeof scene}`
    if (sceneOptions && typeof sceneOptions != 'object')
      throw `DynamicPromptError: if you want to pass scene Options in, they must be in an object, not ${typeof sceneOptions}`

      const promptControls = {
        rerender:() => {
          this.setMessageContent(this.renderMsgContent())
        },
        reactions: {
          strip: () => {
            this.stripReactions()
          },
          clear: () => {
            this.clearReactions()
          }
        },
        changeScene:(scene, sceneOptions) => {
          this.changeScene(scene, sceneOptions)
        }
      }
    const sceneInfo = getSceneInfo(scene, sceneOptions, promptControls)

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
    this.promptControls = promptControls
  }

  // promptCallback = (promptOptions) => {
  //   if (promptOptions.rerender) this.setMessageContent(this.renderMsgContent())
  //   if (promptOptions.reactions == 'strip') this.stripReactions()
  //   else if (promptOptions.reactions == 'clear') this.clearReactions()
  //   if (promptOptions.targetScene)
  //     this.changeScene(promptOptions.targetScene, promptOptions.sceneOptions)
  // }

  /**
   * changes scene, figures out response action
   * resets response actions
   * re-renders
   */
  changeScene(scene, sceneOptions) {
    this.setMessageContent('loading...')
    if (typeof scene != 'string')
      throw `DynamicPromptError: scene needs to be a string - the name of the scene, not ${typeof scene}`

    const sceneInfo = getSceneInfo(scene, sceneOptions, this.promptControls)
    this.scene = scene
    // update the prompt to behave properly
    this.renderMsgContent = sceneInfo.renderMsgContent
    this.setMessageContent(this.renderMsgContent())

    // this.setpromptBehavior(sceneInfo.promptBehavior) // To Do
    this.setResponseActions(sceneInfo.generateResponseAction())
    // this.setRactCollectorOptions(sceneInfo.reactCollectorOptions) // To Do
    // this.setReactCollectorTimeoutCallback(
    //   sceneInfo.reactCollectorTimeoutCallback
    // )                                                  // To Do
    this.resetReactions()
  }
}

const getSceneInfo = (scene, sceneOptions, promptControls) => {
  const sceneNames = Object.keys(scenes)
  // validate that the scene exists
  const sceneResult = sceneNames.find((element) => element == scene)
  if (sceneResult == -1)
    throw `DynamicPromptError: ${scene} was not found in the list of ${sceneNames.length} scenes`
  // see what it needs, make sure we got that

  // call it and get all the info from it
  return scenes[sceneResult](promptControls, sceneOptions)
}

export default DynamicPrompt
