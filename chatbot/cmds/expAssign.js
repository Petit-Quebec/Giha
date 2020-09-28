const log = require('../../util/util.js').log
const util = require('../../util/util.js')
const heroManager = require('../../Giha/heroManager.js')
const characterManager = require('../../Giha/characterManager.js')

let name = `expAssign`

module.exports.help = {
	name: name,
	description: 'Assigns experience to skill of player\'s choosing',
	format: `!${name} <skillName> <expAmount>`,
	note: 'if xp is floating point, it will be rounded',
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
	let msg = await message.channel.send('performing function...')

	// parse args and test them
	try {
		if (args.length < 2)
			throw `expAssign requires a skill name and an exp amount (you provided ${args.length})`
		let expAmount = parseInt(args[1])
		if (isNaN(expAmount)){
			throw 'Exp amount must be an integer.'
		}
		let abilityName = args[0]
		let id = message.author.id
		let hero = heroManager.getHeroById(id)
		if (!hero)
			throw 'Fool! You am have no hero! (make a hero with !rise <heroName>)'
		let result = hero.levelAbility(expAmount, abilityName)
		let txt = `You leveled ${abilityName} ${result.timesLeveled} time${result.timesLeveled>1?'s':''}. You need ${result.expToLevel} more exp to level again.`
		msg.edit(txt)
		log(txt, true)
	} catch (err) {
		// if there is a problem, log it and inform the user
		log(err, true)
		let txt = `use the format ${exports.help.format}\n` + err
		msg.edit(txt)
	}
}
