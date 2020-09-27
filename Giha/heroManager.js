const Hero = require('../db/Hero.js')
let heroes = []

function newHero(discordId, heroName) {
	heroes.forEach((hero) => {
		if (hero.name.equalsIgnoreCase(heroName))
			throw `Fool! There is already a hero named '${
				hero.name
			}'! They are a proud ${hero.class} of level ${hero.getLevel()}`
	})

	let hero = new Hero(discordId, heroName)
	heroes.push(hero)
	return hero
}

function getHeroes() {
	return heroes
}

function getHeroById(id) {
	let heroFound = false
	let heroChar
	heroes.forEach((hero) => {
		if (hero.userDiscordId == id) {
			heroFound = true
			heroChar = hero
		}
	})
	if (heroFound) return heroChar
	else return false
}

String.prototype.equalsIgnoreCase = function (compareString) {
	return this.toUpperCase() === compareString.toUpperCase()
}

module.exports = {
	newHero,
	getHeroes,
	getHeroById,
}
