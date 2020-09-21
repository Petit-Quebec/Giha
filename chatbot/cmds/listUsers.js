const User = require('../../db/User.js');
const log = require('../../util/util.js').log;

module.exports.help = {
	name: 'listUsers',
	description: 'admin command for checking all Users'
}

module.exports.permissions = {
	userPermissions: {
		admin: true,
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
	let txt = await User.listUsers();
	let msg = await message.channel.send(txt);
}