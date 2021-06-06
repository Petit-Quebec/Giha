import { log } from '../../util/util.js'
import { newHero } from '../../Giha/heroManager.js'

let name = 'rise'

const help = {
  name: name,
  description: 'a new Hero rises from the world of Redault!',
  format: `!${name} <heroName>`,
  note: 'be brave, child',
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

const run = async (_bot, message, args) => {
  let msg = await message.channel.send('performing function...')

  // parse args and test them
  try {
    if (args.length < 1)
      throw `rise requires a hero name (you provided ${args.length})`

    let heroName = args[0]
    let id = message.author.id

    let hero = newHero(id, heroName)

    // update reply and log it
    let txt = `${
      hero.name
    } rises! Huzzah! They are a powerful level ${hero.getLevel()} ${
      hero.class
    }!`
    msg.edit(txt)
    log(txt, true)
  } catch (err) {
    // if there is a problem, log it and inform the user
    log(err, true)
    let txt = `use the format ${help.format}\n` + err
    msg.edit(txt)
  }
}

export default {
  run,
  permissions, 
  help
}
