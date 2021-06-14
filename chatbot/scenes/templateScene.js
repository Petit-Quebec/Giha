// This file has a set of hard/soft-coded logic that generates scenes
// it is split into four parts
//  1. the scene function, which compiles all the information and returns it
//  2. the renderer function, which builds a renderer and returns it
//  3. the responseActionGenerator function, which builds a response action generator and returns it
//  4. the timeoutCallback function, which builds the timeout logic - ie what happens when the scene times out
// the four of these together allow you to create dynamic templates for scenes

const templateScene = (promptCallback, sceneOptions) => {
  let instance = sceneOptions.instance
  const sceneInformation = {
    promptBehavior: 'noLimit', // behavior of the prompt, as specified in Prompt.js
    generateResponseAction: confirmationResponseActions(
      promptCallback,
      instance
    ), // a function that returns an array of ResponseActions and takes no arguments
    renderMsgContent: confirmationEmbed(instance), // a function that renders the msg content and takes no arguments
    reactCollectorOptions: { time: 6000000 }, // reaction collector options
    reactCollectorTimeoutCallback: () => {
      promptCallback({ reactions: 'clean' })
    }, //what do you do when it all times out
  }
  return sceneInformation
}

const confirmationResponseActions = () => {
  return () => {
    // response action with a check box that changes scene to instance
  }
}

const confirmationEmbed = (confirmationMessage) => {
  return () => {
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

export default templateScene
