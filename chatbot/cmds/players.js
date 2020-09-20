const db = require('../../db/db.js');
const log = require('../../util/util.js').log;

module.exports.help = {
	name: 'players',
	description: 'prints out information about all registered players'
}

module.exports.permissions = {
	userPermissions: {
		admin: true,
		dm: true,
		player: false
	},
	locationPermissions: {
		activeGuild: true,
		passiveGuild: false,
		inactiveGuild: false,
		directMessage: true
	}
}

module.exports.run = async(bot, message, args) => {
	let msg = await message.channel.send("generating player info...")

	let playerArray = await db.getFullCollectionArray('players');

	await message.channel.send(playerInfo(playerArray))

	msg.delete();
}

function playerInfo(playerArray) {
	let infoString = `There are currently ${playerArray.length} active players`;
	playerArray.forEach(player => {
		log(player,true)
		infoString += `\n ${player.discordHandle}: \n  DiscordID: ${player.discordId}`
	})
	return infoString;
}