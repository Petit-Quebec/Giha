import Character from '../db/Character.js'
import { log } from '../util/util.js'

export const userStatsBlurb = async (user) => {
  log('user')
  log(user)
  log('user.id')
  log(user.id)
  let txt = ''
  let handle = user.handle
  let resonite = 0
  let character = await Character.fromCharacterId(user.defaultCharacter) // querey all characters by user's mongooseID
  if (!character) {
    throw 'userStatsBlurbError: default character is ' + character
  }
  let characters = await Character.fromUserId(user._id) // primary character
  let numCharacters = characters.length
  // let adventures = 0 // querey all adventures including user's mongooseID
  // get character
  txt += `__**stats for ${handle}**__\n`
  txt += '```ml\n'
  txt += `${resonite} Resonite\n`
  txt += `${numCharacters} Characters\n`
  txt += `default character: ${character.fullName}\n`
  txt += `> lvl ${character.level} ${character.charRace} ${character.charSubclass} ${character.charClass}\n`
  txt += `> ${character.remainingExperience} xp until lvl ${
    character.level + 1
  }\n`
  txt += `> HP: ${character.hpCurrent}/${character.hpMax}\n`
  txt += `> Hit Dice: ${character.hitDieCurrent}/${character.level}\n`
  txt += `> ${character.moneyToString}\n`
  txt += `> Currently ${character.currentActivity} in ${character.location}\n`
  txt += '> Conditions:\n'
  txt += `> ${character.conditions}\n`
  txt += 'Adventures: - planned\n'
  txt += '> Next Adventure: adventure.name\n'
  txt += '> {adventure.date}, {adventure.time}, {adventure.location}\n'
  txt += '```'
  // stats for: player name
  // 45623 Resonite
  // Characters: n active/m total
  // default character: char name
  // > lvl 4 Gnomish Ice Wizard
  // > (300 xp till lvl 5)
  // > HP: 43/56
  // > Hit Dice: 3/4
  // > Currently fishing in Foxbarrow (Autumnshade Pinensula)
  // > 231 gp 9 sp 3 cp
  // > Conditions:
  // >  - Swamp Sickness
  // >  - Broken Toenail
  // Adventures: 3 planned
  // > Next Adventure: Bullywug Breakout
  // > 4/13/2020, 6pm, @Warchief
  return txt
}
