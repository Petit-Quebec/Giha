const log = require('../../util/util.js').log
const util = require('../../util/util.js')
const encounterManager = require('../../Giha/encounterManager.js')
const heroManager = require('../../Giha/heroManager.js')
const encounterAscii = require('../../imgGen/ascii/encounterAscii')
const Encounter = require('../../db/Encounter.js')

let name = `battle`

module.exports.help = {
	name: name,
	description: 'glorious field of battle',
	format: `!battle`,
	note: 'blahblah',
}

module.exports.permissions = {
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

module.exports.run = async (bot, message, args) => {
	let msg = await message.channel.send('preparing for battle...')

	// parse args and test them
	try {
		let id = message.author.id
		let hero = heroManager.getHeroById(id)
		if (!hero)
			throw 'Fool! You am have no hero! (make a hero with !rise <heroName>)'
		// get discord Id
		// check if they have a hero
		// see if that hero is in an encounter
		let heroName = hero.name
		let txt = '```ml\n'
		let activeEncounter
		// lets see if this hero is already in a fight
		let encounters = encounterManager.getEncountersByHero(hero)
		encounters.forEach((encounter) => {
			if (encounter.isActive()) {
				activeEncounter = encounter
			}
		})
		if (!activeEncounter && hero.stamina < 1) {
			throw `at least 1 stamina is needed for battle, you currently have ${hero.stamina}`
		}
		if (!activeEncounter && hero.stamina > 0) {
			activeEncounter = encounterManager.newEncounter(hero)
			txt += `${heroName} encountered a wild ${activeEncounter.enemy.name}!`
		} else {
			let monster = activeEncounter.enemy.name
			let dmg = Math.ceil(Math.random() * 9)
			let res = activeEncounter.attack(dmg)
			txt += `${heroName} attacked the ${monster} for ${dmg}`
			if (res.killedEnemy) {
				hero.grantExp(res.playerExp)
				txt += `\nhuzzah! the fiendish ${monster} was slain! +${res.playerExp} exp!`
			}
			if (res.enemyDamage > 0) {
				txt += `\n${monster} used ${res.enemyAttackName} for ${res.enemyDamage} damage!`
				if (res.died) txt += `\n${heroName} has died, rip`
				else
					txt += `\n${heroName} now has ${hero.stamina} fighting spirit remaining`
			}
			txt += `\nyou have ${hero.stamina} fighting spirit remaining`
		}
		txt += '```'
		txt += `\n\n` + encounterAscii.encounterTextBlob(activeEncounter, 6)
		msg.edit(txt)
		log(txt, true)
	} catch (err) {
		// if there is a problem, log it and inform the user
		log(err, true)
		let txt = `use the format ${exports.help.format}\n` + err
		msg.edit(txt)
	}
}
