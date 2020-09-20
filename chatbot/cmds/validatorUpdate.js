const db = require('../../db/db.js');
const log = require('../../util/util.js').log;
const schemaModify = require('../../db/db_schema_modify.js');

module.exports.help = {
	name: 'validatorUpdate',
	description: 'Forces database schema validator update'
}

module.exports.permissions = {
	userPermissions: {
		admin: true,
		dm: false,
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
	log('validatorUpdate has been depreciated',true)
	// let msg = await message.channel.send("attempting to modify schema...")
	// schemaModify(args[0]).then( () => {
	// 	msg.edit(`Modified ${args[0]} successfully!`);
	// }).catch(err => {
	// 	log(err, true)
	// 	msg.edit(`issue modifying ${args[0]}: ${err}`);
	// })
	
}