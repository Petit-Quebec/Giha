const Character = require('../../Character.js').Character;
const log = require('../../util/util.js').log;

module.exports.help = {
	name: 'testCharacter',
	description: 'tests the character class'
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
	let sansBar = new Character('Sansbar Illyan', 0);
	let msg = await message.channel.send('made Sansbar')
	log('sansBar money:',true)
	log(sansBar.moneyString,true)
	log('allCharacters:',true)
	log(Character.allCharacters(),true)
	// let msg = await message.channel.send("generating player info...")

	// let playerArray = await db.getFullCollectionArray('players');

	// await message.channel.send(playerInfo(playerArray))

	// msg.delete();
}
