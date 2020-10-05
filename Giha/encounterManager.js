const Encounter = require('../db/Encounter.js')
const Hero = require('../db/Hero.js')
let encounters = []

function newEncounter(hero) {
	if (!(hero instanceof Hero))
		throw `need a hero fight with, not this puny ${typeof hero}`
	let newEncounter = new Encounter(hero, encounters.length)
	encounters.push(newEncounter)
	return newEncounter
}

function getEncounters() {
	return encounters
}

function getEncountersByHero(hero) {
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

module.exports = {
	newEncounter,
	getEncounters,
	getEncountersByHero,
}
