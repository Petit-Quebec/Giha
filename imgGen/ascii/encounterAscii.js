// function header with relevant information

import Encounter from '../../db/Encounters/Encounter.js'

const lineLength = 24
// add previous turns to encounter object in Encounter.js

// types of stuff that needs to be in the encounter blob
// relevant enemy image
// enemy status
// discord name
// hero name
// hero health
// hero image
// list of currently available hero abilites and actions
// log of what just happened over most recent x turns
// x = logLength
// environmental effects/factors

// example
/*
https://docs.google.com/document/d/1MOIjDwbHF4vcf4DzXslNn92sZrpaXrAToIF53vit5E0/edit?usp=sharing
*/

const encounterTextBlob = (encounter) => {
  // checks all information for correct type
  if (!(encounter instanceof Encounter)) {
    throw `Encounter text blob requires an encounter but was given ${typeof encounter}`
  }
  let hero = encounter.hero
  let enemy = encounter.enemy
  // code that builds the text blobs
  let text = ''

  text +=
    `encounter ID: ${encounter.id}\n` +
    '-------Combat Log-------\n' +
    generateEncounterLog(encounter.log) +
    '\n' +
    '------------------------\n' +
    `${hero.name}\n` +
    '       vs\n' +
    rightAlign(enemy.name, lineLength) +
    '\n' +
    '------------------------\n' +
    generateStatusLog(encounter) +
    '\n' +
    '------------------------\n' +
    `${hero.name}:\n` +
    ` stamina ${hero.stamina}/${hero.getMaxStamina()}\n` +
    generateStaminaBar(hero.stamina, hero.getMaxStamina()) +
    '\n' +
    ' !abilityname\n' +
    ' !use <itemname>\n' +
    ' !flee'

  text = '```ml\n' + text + '\n```'

  // return text blob
  return text
}

const generateEncounterLog = () => {
  return 'generateEncounterLog'
}

const rightAlign = (text, length) => {
  let txt = ''
  for (let x = 0; x < length - text.length; x++) {
    txt += ' '
  }
  txt += text
  return txt
}

const generateStatusLog = () => {
  return 'generateStatusLog'
}

const generateStaminaBar = (currentStam, maxStam) => {
  const maxBlocks = 10
  let curBlocks = Math.round((currentStam * maxBlocks) / maxStam)
  let text = ''
  for (let z = 0; z < lineLength - maxBlocks * 1.5 - 2; z++) {
    text += ' '
  }
  text += '['
  for (let x = 0; x < curBlocks; x++) {
    text += '◻️'
  }
  for (let y = 0; y < maxBlocks - curBlocks; y++) {
    text += '◼️'
  }
  text += ']'
  return text
}

export default encounterTextBlob
