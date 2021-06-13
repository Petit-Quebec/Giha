import { log } from '../../util/util.js'
import {
  getEncountersByHero,
  newEncounter,
} from '../../Giha/encounterManager.js'

let name = 'battle'

const help = {
  name: name,
  description: 'glorious field of battle',
  format: '!battle <heroName>',
  note: 'blahblah',
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
  let msg = await message.channel.send('preparing for battle...')

  // parse args and test them
  try {
    // get the hero name
    if (args.length < 1)
      throw `battle requires at least 1 argument (you provided ${args.length})`
    let heroName = args[0]

    let txt = '```ml\n'
    let activeEncounter
    // lets see if this hero is already in a fight
    let encounters = getEncountersByHero(heroName)
    encounters.forEach((encounter) => {
      if (encounter.isActive()) {
        activeEncounter = encounter
      }
    })
    if (!activeEncounter) {
      activeEncounter = newEncounter(heroName)
      txt += `${heroName} encountered a wild ${activeEncounter.monster.name}!`
    } else {
      let monster = activeEncounter.monster.name
      let dmg = Math.ceil(Math.random() * 9)
      let res = activeEncounter.attack(dmg)
      txt += `${heroName} attacked the ${monster} for ${dmg}`
      if (res.killedEnemy)
        txt += `\nhuzzah! the fiendish ${monster} was slain! +420 EXP`
      if (res.enemyDamage > 0) {
        txt += `\n${monster} used ${res.enemyAttackName} for ${res.enemyDamage} damage!`
        if (res.died) txt += `\n${heroName} has died, rip`
        else
          txt += `\n${heroName} now has ${activeEncounter.playerHealth} fighting spirit remaining`
      }
    }
    txt += '```'
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
  help,
}
