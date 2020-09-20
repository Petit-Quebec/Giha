const log = require('../../util/util.js').log;

module.exports.help = {
	name: 'test',
	description: 'a test function used as a template'
}

module.exports.permissions = {
	userPermissions: {
		admin: false,
		dm: false,
		player: false
	},
	locationPermissions: {
		activeGuild: false,
		passiveGuild: false,
		inactiveGuild: false,
		directMessage: false
	}
}

module.exports.run = async(bot, message, args) => {
	let guilds = bot.guilds;
}