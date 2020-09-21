const Character = require('../../db/Character.js');
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

	log(' | testing character initialization...',true)
	log(' | deleting old Sansbar Illyn..')
	Character.find({
		firstName: 'Sansbar',
		lastName: 'Illyn'
	}).then(res => {
		if(res.length > 0){
			res[0].deleteOne();
			log(' | old Sansbar deleted',true)
		}
		else {
			log(' | no Sansbar exists yet',true)
		}
	}).catch(err => {
		log(err,true)
		let msg = message.channel.send(' | ERROR deleting the old Sansbar:\n'+err)
	}).finally( () => {
		log(' | making Sansbar anew',true)
		let sansBar = Character.newCharacter({
			firstName: 'Sansbar',
			lastName: 'Illyn'
		});
		sansBar.then( res => {
			let msg = message.channel.send('Successfully created Sansbar\n' + res);
		}).catch( err => {
			log(err,true)
			let msg = message.channel.send('ERROR creating Sansbar:\n'+err)
		})
		
	})
}
