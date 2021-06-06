import { log } from '../../util/util.js'
import { getHeroById } from '../../Giha/heroManager.js'
import { getEncountersByHero } from '../../Giha/encounterManager.js'

let name = 'flee'

const help = {
  name: name,
  description: 'lets you run away',
  format: '!flee',
  note: 'uses first hero if none are specified',
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

const run = async (_bot, message) => {
  let msg = await message.channel.send('trying to flee...')

  try {
    let id = message.author.id
    let hero = getHeroById(id)
    let txt

    if (!hero) {
      txt = 'You need to have a hero to flee! Make one with !rise'
      msg.edit(txt, true)
      log(txt, true)
    } else {
      let encounters = getEncountersByHero(hero)
      let activeEncounter = encounters.find((encounter) => encounter.isActive())

      if (!activeEncounter) txt = 'You must be in an active encounter to flee!'
      else {
        //Want to end current encounter
        activeEncounter.encounterActive = false
        txt = `${hero.name} succesfully escaped!`
      }
      msg.edit(txt, true)
      log(txt, true)
    }
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
