const users = require('../../db/userManager.js');
const log = require('../../util/util.js').log;
const util = require('../../util/util.js');

module.exports.help = {
	name: 'initializePlayer',
	description: 'attempts to initialize a given member of current guild without doing a role check'
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

	log('args:')
	log(args);
	// check to see if discord ID is valid
	let guilds = bot.guilds;
	guild = guilds.get(message.guild.id);
	log('guild:');
	log(guild);
	let discordId = args[0].slice(3,args[0].length-1);//message.author.id;
	let member = guild.member(discordId)
	if(!member)
	{
		message.channel.send(`${discordId} is not a valid discord ID from this guild. As a result, no User <@${discordId}> has been initialized`);
	}

	// check to see if name is valid
	let newUser = {
		discordHandle: util.name(member),
		discordId: discordId
	}

	users.initializeUser(newUser).then(res =>{
		let msg = message.channel.send(`Successfully initialized User ${newUser.discordHandle}`);
		log(`initialized User ${newUser.discordHandle}`,true)
	}).catch(err => {
		let msg = message.channel.send(`ERROR: Issue initializing User!\n${err}`);
		log(err,true);
	});

}