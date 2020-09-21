const log = require('../../util/util.js').log
const util = require('../../util/util.js')
const userManager = require('../../Giha/userManager.js')
const characterManager = require('../../Giha/characterManager.js')

module.exports.help = {
	name: 'awardXp',
	description: 'dm command for awarding xp to characters',
	format: '!awardXp @user <xpAmount>',
	note: 'if xp is floating point, it will be rounded',
}

module.exports.permissions = {
	userPermissions: {
		admin: true,
		dm: true,
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
	let msg = await message.channel.send('awarding xp...')
	try {
		if (args.length < 1)
			throw `awardXp requires at least 1 argument (you provided ${args.length})`
		let discordId = args[0].slice(3, args[0].length - 1)
		let target
		let xp
		target = await userManager.getUserByDiscordId(discordId)
		if (!util.isUser(target)) {
			throw `issue with awarding Xp to ${args[0]}, please tag the user you wish to give Xp to.`
		}
		xp = parseInt(args[1])
		if (isNaN(xp) || typeof xp != 'number')
			throw `issue with awarding xp amount '${args[1]}', numbers only please.`

		let res = await characterManager.awardXp(target, xp)
		let txt = `successfully awarded ${xp} xp! ${res.firstName} only needs ${
			res.remainingExperience
		} to hit level ${res.level + 1}`
		msg.edit(txt)
		log(txt, true)
	} catch (err) {
		log(err, true)
		let txt = `use the format ${exports.help.format}\n` + err
		msg.edit(txt)
	}
}
