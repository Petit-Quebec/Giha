import Encounter from '../db/Encounters/Encounter.js'
import Hero from '../db/Hero.js'

let encounters = []

export const newEncounter = () => {
  // if (!(hero instanceof Hero))
  //   throw `need a hero fight with, not this puny ${typeof hero}`
  let newEncounter = new Encounter(encounterType)
  encounters.push(newEncounter)
  return newEncounter
}

export const getEncounters = () => {
  return encounters
}

export const getEncountersByHero = (hero) => {
  if (!(hero instanceof Hero))
    throw `I'll find you a hero, but you are on your own if you seek a ${typeof hero}`
  // console.log(encounters)
  let heroEncounters = []
  encounters.forEach((encounter) => {
    // console.log(`heroName: ${heroName} , encounter hero:${encounter.hero}`)
    if (encounter.hero == hero) {
      heroEncounters.push(encounter)
    }
  })
  return heroEncounters
}

export const randomEncounter = (locationType) => {
  return 'shroomHunt'//`mushroom picking in the + ${locationType}`
}
