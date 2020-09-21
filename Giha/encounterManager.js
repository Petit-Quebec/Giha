const Encounter = require('../db/Encounter.js')
let encounters = []

function newEncounter(heroName) {
	let newEncounter = new Encounter(heroName)
	encounters.push(newEncounter)
	return newEncounter
}

function getEncounters() {
	return encounters
}

function getEncountersByHero(heroName) {
	console.log(encounters)
	let heroEncounters = []
	encounters.forEach((encounter) => {
		console.log(`heroName: ${heroName} , encounter hero:${encounter.hero}`)
		if (encounter.hero == heroName) {
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
