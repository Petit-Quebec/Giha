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

		let hero

		if(args.length){
			hero = heroManager.getHeroByName(args[0])
		}
		else {
			let id = message.author.id
			hero = heroManager.getHeroById(id)
		}
		let txt
		// update reply and log it
		if(hero) {
			txt = hero.statsBlob()
		} else if (args.length) {
			txt = "There is no hero matching this name."
		}else { 
			txt = "This command requires a hero! Create a hero with !rise."
	 	}
		msg.edit(txt)
		log(txt, true)
	} catch (err) {
		// if there is a problem, log it and inform the user
		log(err, true)
		let txt = `use the format ${exports.help.format}\n` + err
		msg.edit(txt)
	}
}
