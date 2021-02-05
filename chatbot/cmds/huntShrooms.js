import { log } from '../../util/util.js'
import ShroomHunt from '../../Giha/Encounters/shroomHunting.js'
import ResponseAction from '../ResponseAction.js'
import Prompt from '../Prompt.js'

let name = 'huntShrooms'

const help = {
  name: name,
  description: 'command to kickoff mushroom minigame',
  format: `!${name}`,
  note: 'this is just a test, do not be alarmed',
}

const permissions = {
  userPermissions: {
    admin: true,
    dm: true,
    player: true,
  },
  locationPermissions: {
    activeGuild: true,
    passiveGuild: true,
    inactiveGuild: true,
    directMessage: true,
  },
}

const run = async (bot, message, args) => {
  if (args) {
    //this is unused
  }
  let msg = await message.channel.send('performing function...')
  try {
    // make new mushroom hunt
    let shroomHunt = new ShroomHunt(7)
    let responseActions = []
    let shroomPrompt
    for (
      let mushroomIndex = 0;
      mushroomIndex < shroomHunt.mushrooms.length;
      mushroomIndex++
    ) {
      let mushroom = shroomHunt.mushrooms[mushroomIndex]
      // make a new responseAction
      // get the emoji
      let shroomEmoji = bot.emojis.cache.find(
        (emoji) => emoji.name === mushroom.emoji
      )
      let mushroomCallback = (user) => {
        if (user) {
          //this is unused
        }
        shroomHunt.pick(mushroom)
        console.log(
          `hero picked ${mushroom.mushroomIndex} a ${mushroom.species} of quality ${mushroom.quality}, the score is now ${shroomHunt.score}`
        )
        shroomPrompt.message.edit(
          `Pick the mushrooms!\nscore: ${shroomHunt.score}`
        )
      }

      let responseAction = new ResponseAction(
        'emoji',
        shroomEmoji,
        mushroomCallback
      )

      responseActions.push(responseAction)
    }

    shroomPrompt = new Prompt(
      message.channel,
      true,
      responseActions,
      bot,
      'YOU UNCOVER MAGEROOF, PICK SOME BEFORE THEY BURROW!!!',
      { time: 15000 }
    )

    // make numShrooms reaction objects
    // make prompt
    let txt = ':D'
    msg.edit(txt)
    log(txt, true)
  } catch (err) {
    // if there is a problem, log it and inform the user
    log(err, true)
    let txt = `use the format ${help.format}\n` + err
    msg.edit(txt)
  }
}

export { help, permissions, run }
