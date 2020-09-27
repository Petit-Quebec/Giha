const log = require('../../util/util.js').log
const util = require('../../util/util.js')
const heroManager = require('../../Giha/heroManager.js')

let name = `stats`

module.exports.help = {
	name: name,
	description: 'gives you the stats you so crave',
	format: `!${name} <heroName (optional)>`,
	note: 'uses first hero if none are specified',
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
		let id = message.author.id
		let hero = heroManager.getHeroById(id)

		// update reply and log it
		let txt = hero.statsBlob()
		msg.edit(txt)
		log(txt, true)
	} catch (err) {
		// if there is a problem, log it and inform the user
		log(err, true)
		let txt = `use the format ${exports.help.format}\n` + err
		msg.edit(txt)
	}
}
