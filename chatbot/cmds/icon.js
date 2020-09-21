// avatar.js
module.exports.run = async(bot, message, args) => {
	let msg = await message.channel.send("generating server icon...")

	if(!message.guild.iconURL) return msg.edit('This server has no icon');

	await message.channel.send({files: [
		{
			attachment: message.author.guild.iconURL,
			name: "icon.png"
		}
	]})

	msg.delete();
}

module.exports.help = {
	name: 'icon',
	description: 'generates a the server icon and sends it to the user'
}

module.exports.permissions = {
	userPermissions: {
		admin: true,
		dm: true,
		player: true
	},
	locationPermissions: {
		activeGuild: true,
		passiveGuild: false,
		inactiveGuild: false,
		directMessage: false
	}
}