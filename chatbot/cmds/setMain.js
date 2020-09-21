const log = require('../../util/util.js').log
const userManager = require('../../Giha/userManager.js')
const aggregations = require('../../Giha/aggregations.js')

module.exports.help = {
	name: 'setMain',
	description: 'command for designating a character as your main character',
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
	// get user object
	let user = await userManager.getUserByDiscordId(message.author.id)
	// get character from
	// let character = await characterManager.getCharacterBy
	let txt = await aggregations.userStatsBlurb(user)
	let msg = await message.channel.send(txt)
}
