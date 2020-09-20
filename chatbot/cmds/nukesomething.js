const log = require('../../util/util.js').log;
const db = require('../../db/db.js')

module.exports.help = {
	name: 'nukesomething',
	description: 'a very specific purpose'
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
	db.deleteEntry({},'fasd').then(res => {
		log(res,true);
	})
}