const log = require('../../util/util.js').log
const userManager = require('../../Giha/userManager.js')
const aggregations = require('../../Giha/aggregations.js')

module.exports.help = {
	name: 'adminStats',
	description: 'admin command for checking all Characters',
}

module.exports.permissions = {
	userPermissions: {
		admin: true,
		dm: true,
		player: true,
	},
	locationPermissions: {
		activeGuild: false,
		passiveGuild: false,
		inactiveGuild: false,
		directMessage: false,
	},
}

module.exports.run = async (bot, message, args) => {
	let msg = await message.channel.send('generating stats...')
	try {
		let user = await userManager.getUserByDiscordId(message.author.id)
		let txt = await aggregations.userStatsBlurb(user)
		if (txt) msg.edit(txt)
		else throw 'something went wrong!'
	} catch (err) {
		log('Error', true)
		log(err, true)
		msg.edit(err)
	}
}
