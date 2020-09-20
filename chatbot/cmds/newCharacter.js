// newCharacter.js
const log = require('../../util/util.js').log;
let characterManager = require('./../../db/characterManager.js');

module.exports.run = async(bot, message, args) => {
	let msg = await message.channel.send("generating character...")
	
	log('args:')
	log(args);

	let nameArray = args.slice(1);
	nameArray.forEach((word, index) => {
		nameArray[index] = word.replace(/^\w/, c => c.toUpperCase())
	})
	let nameFull = nameArray.join(' ');

	log(nameFull,true)

	log(`Running new Character for ${nameFull}...`)

	// check to see if discord ID is valid
	let guilds = bot.guilds;
	guild = guilds.get(message.guild.id);
	log('guild:');
	log(guild);
	let discordId = args[0].slice(3,args[0].length-1);//message.author.id;
	log('discordId:')
	log(discordId)
	let member = guild.member(discordId)
	if(!member)
	{
		message.channel.send(`${args[0]} is not a valid discord handle from this Discord Server. As a result, no character "__${args[1]}__" has been initialized.`);
		return null;
	}

	if(nameFull.length < 3) {
		msg.edit(`the name "*${nameFull}*" is too short. Character names must be at least 3 characters.`);
		return null
	}

	if(nameFull.length >= 32) {
		msg.edit(`the name "*${nameFull}*" is too long. Character names cant be over 32 characters.`);
		return null
	}

	try {
		let newChar = await characterManager.initializeCharacter(nameFull,member.id);
		msg.edit(`New character generated: *${newChar.nameFull}*`);
	}
	catch (err) {
		msg.edit(`something went wrong ${err}`);
		log(err,true);
	};

	// await message.channel.send({files: [
	// 	{
	// 		attachment: message.author.displayAvatarURL,
	// 		name: "avatar.png"
	// 	}
	// ]})

	// msg.delete();
}

module.exports.help = {
	name: 'newCharacter',
	description: 'initializes new character\nsyntax:\n!newCharacter @<user> <nameFull>'
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