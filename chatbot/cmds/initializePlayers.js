const players = require('../../db/userManager.js');
const log = require('../../util/util.js').log;

module.exports.help = {
	name: 'initializePlayers',
	description: 'attempts to initialize all members of current guild with the correct role'
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


	let guilds = bot.guilds;
	guild = guilds.get(message.guild.id);
	log('guild:');
	log(guild);
	let members = guild.members;

	let report = '';

	let totalMembers = members.array().length;
	let rolelessMembers = 0;
	let roledMembers = 0;
	let alreadyInitialized = 0;
	let toBeInitialized = 0;
	let successes = [];
	let failures = [];


	for( memberIndex = 0; memberIndex < members.array().length; memberIndex++) {
		member=members.array()[memberIndex];
		let newPlayer = {
			discordHandle: member.nickname ? member.nickname : member.user.username,
			discordId: member.id
		}

		if(member.roles.some(role => role.name == 'DnD Player')) {
			log(`${newPlayer.discordHandle} has the DnD Player Role!`)
			roledMembers++;
			
			await players.initializeUser(newPlayer).then(res =>{
				log(`initialized player ${newPlayer.discordHandle}`,true)
				toBeInitialized++;
				successes.push(newPlayer.discordHandle);
			}).catch(err => {
				log('err:',true)
				log(err,true);
				if(typeof err == 'String' && err.search(`LOOMERROR: player already initialized`) != -1){
					alreadyInitialized++;
					log('alreadyInitialized: ' + alreadyInitialized,true)
				}
				else{
					failures.push(newPlayer.discordHandle);
					log(failures,true)
				}
			});
		}
		else 
			rolelessMembers++;
		if(memberIndex == members.array().length) {

		}
	}

	report += 'totalMembers: ' + totalMembers + '\n'+
				'rolelessMembers: ' + rolelessMembers + '\n'+
				'roledMembers: ' + roledMembers + '\n'+
				'alreadyInitialized: ' + alreadyInitialized + '\n'+
				'toBeInitialized: ' + toBeInitialized + '\n'+
				'successes: ' + successes.length + '\n'+
				'failures: ' + failures.length + '\n';
	log(report,true)
	log('alreadyInitialized: ' + alreadyInitialized,true)
	let msg = await message.channel.send(report);
}