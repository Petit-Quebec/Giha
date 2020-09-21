const Character = require('../../db/Character.js')
const log = require('../../util/util.js').log

module.exports.help = {
	name: 'listCharacters',
	description: 'admin command for checking all Characters',
}

module.exports.permissions = {
	userPermissions: {
		admin: true,
		dm: false,
		player: false,
	},
	locationPermissions: {
		activeGuild: false,
		passiveGuild: false,
		inactiveGuild: false,
		directMessage: false,
	},
}

module.exports.run = async (bot, message, args) => {
	let txt = await Character.listCharacters()
	let msg = await message.channel.send(txt)
}
