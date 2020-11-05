const DEV_MODE = process.env.DEV_MODE == 1
const userManager = require('../Giha/userManager')
const log = require('../util/util.js').log
const INVALID_MSG_DELAY_MS = 5000
const reloadBotCommands = require('./commandLoader')
const util = require('../util/util.js')

let lastCommandMsg

/* This file handles parsing of discord Messages */

function message(bot, msg) {
	if (bot.constructor.name != 'Client') {
		throw `messageRouter.message Error: must pass a Discord Client to respond with`
	}
	if (msg.constructor.name != 'Message') {
		throw `messageRouter.message Error: must pass a Message to parse`
	}

	let prefix = '!'

	if (msg.author.bot) return
	// if (msg.channel.type === "dm") return;

	let messageArray = msg.content.split(/\s+/g)
	let command = messageArray[0]
	let args = messageArray.slice(1)
	if (!command.startsWith(prefix)) return

	let cmd = bot.commands.get(command.slice(prefix.length))

	log('recieved Discord message from ' + msg.author.username + ':', true)
	log(' | ' + msg.content, true)

	/* Dev Mode Feature */
	if (
		DEV_MODE &&
		command == '!!' &&
		lastCommandMsg &&
		lastCommandMsg.content != '!!'
	) {
		msg.channel.send(
			'running last command:\n`' + lastCommandMsg.content + '`'
		)
		let reloadPromise = reloadBotCommands(bot)
		reloadPromise
			.then((value) => {
				log(
					`reload completed ${value}, calling ${lastCommandMsg.content}`,
					true
				)
			})
			.then((res) => {
				message(bot, lastCommandMsg)
			})
	} else if (cmd) {
		log('a valid command!', true)
		// update last commmand message
		lastCommandMsg = msg
		log(`lastCommand set to ${msg.content}`, true)
		// check to see if location has permissions
		// get location
		let location = msg.channel.type
		// get permissions from command
		let cmdLocationPerm = cmd.permissions.locationPermissions
		if (location == 'dm') {
			// msg was recieved in a DM
			if (!cmdLocationPerm.directMessage)
				msg.channel.send('that command is not available in direct messages')
			return
		} else if (location == 'text') {
			// msg was recieved in a text channel in a guild
			// if its only suppsoed to be in DMs then resolve in DMs
			// unfinished
		}

		userManager.getUserByDiscordId(msg.author.id).then((user) => {
			if (msg.author.id == '153983024411836416') {
				log('yes master UwU', true)
				cmd.run(bot, msg, args).catch((err) => {
					log(
						`something went wrong with the ${cmd.help.name} command `,
						true
					)
					log(err, true)
				})
				return true
			}

			/*
			if (!user) {
				log('command sent by a non-user, ignoring them', true)
				msg.author.createDM().then((channel) => {
					channel.send(
						`You are not an initialized user, so you may not send commands`
					)
				})
				return false
			}
			
			let hasPermission = checkMsgPermissions(cmd, user)
			*/ let hasPermission = true
			if (hasPermission) {
				// if you get an error here, make sure the run function in the cmd file is async
				log(`${msg.content} was ran by ${util.name(msg.member || msg)}`, true)
				cmd.run(bot, msg, args).catch((err) => {
					log(
						`something went wrong with the ${cmd.help.name} command `,
						true
					)
					log(err, true)
				})
			} else {
				msg.author.createDM().then((channel) => {
					channel.send(
						`*${cmd.name}* is not a valid command for your permission level\n`
					)
					log(`${cmd.permissions.userPermissions}`, true)
				})
				log(
					`${msg.content} was attempted to be ran by ${util.name(
						msg.member
					)}, but they lack the correct permissions`,
					true
				)
			}
		})
	} else {
		// msg was not a valid command
		log(`'${msg.content}' is not a valid command`, true)
		invalidCommand(msg)
	}
}

function checkMsgPermissions(cmd, user) {
	log('messageParser.checkMsgPermissions user: ')
	log(user)
	log('messageParser.checkMsgPermissions cmd.permissions.userPermissions: ')
	log(cmd.permissions.userPermissions)
	log(
		'messageParser.checkMsgPermissions cmd.permissions.userPermissions.player: '
	)
	log(cmd.permissions.userPermissions.player)
	log('messageParser.checkMsgPermissions user.isPlayer: ')
	log(user.isPlayer)
	log('messageParser.checkMsgPermissions user.isDm: ')
	log(user.isDm)
	log('messageParser.checkMsgPermissions user.isAdmin: ')
	log(user.isAdmin)

	if (
		(cmd.permissions.userPermissions.player && user.isPlayer) ||
		(cmd.permissions.userPermissions.dm && user.isDm) ||
		(cmd.permissions.userPermissions.admin && user.isAdmin)
	) {
		return true
	}
}

async function invalidCommand(msg) {
	let response = await msg.channel.send(
		`\`${msg.content}\` is not a valid command\nFor help type !help`
	)
	response.delete(INVALID_MSG_DELAY_MS)
	return true
}

module.exports = {
	message,
}
