const log = require('../util/util.js').log;
const messageParser = require(`./messageParser.js`);

const reloadBotCommands = require('./commandLoader');

require('dotenv').config({path: '/../.env'})
const Discord = require('discord.js');

const CHATBOT_ENABLED = process.env.CHATBOT_ENABLED == 1;
const guildManager = require('./guildManager.js');
const token = process.env.DBOT_TOKEN;

const roleChange = require('./events/roleChange.js') // if more events are added this should be abstracted out
const nameChange = require('./events/nameChange.js')

let chatbotReady = false;

const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();
reloadBotCommands(bot);

// initialize commands


function run() {
  if(CHATBOT_ENABLED) {

		bot.on('ready', () => {
			log('\x1b[32m'+
				' ✓' +
				'\x1b[0m'+
				' Discord Bot logged in under ' +
				'\x1b[7m'+
				bot.user.tag+
				'\x1b[0m',
				true);
			chatbotReady = true;
			log('bot.commands:');
			log(bot.commands);
		});

		bot.on('message', async msg => {
			messageParser.message(bot,msg);
		})

		bot.on('guildMemberUpdate', (oldMember,newMember) => {
			memberUpdate(oldMember,newMember);
		})

		bot.on('error', err => {
			log('\x1b[31m',true)
			log(err.error, true)
			if(Object.entries(err.error)[0][1] == 'SELF_SIGNED_CERT_IN_CHAIN') {
				log('\nBot was blocked by a certificate issue, may be a firewall problem.' +
					'\n shutting bot down.', true)
				// bot.destroy().then(() => {
				// 	log(' Discord bot bot shut down successful.', true)
				// });
			}
			log('\x1b[0m',true)
		});

		bot.on('reconnecting', msg => {
			log('Discord Bot attempting to reconnect...',true)
		})

		bot.login(token)
		  .then(log('  Discord bot logging in...',true))
		  .catch(console.error);

  }
}

function isReady() {
  return chatbotReady;
}

function checkSetup() {
	chatbotReady = false;
	guildManager.checkGuilds(bot).then(chatbotReady = true);
}


function memberUpdate(oldMember,newMember){
	if(!oldMember.roles.equals(newMember.roles)) {
		// the member update was a change in rolls
		if(oldMember.roles.array().length < newMember.roles.array().length)
			roleChange.newRole(oldMember,newMember);
		else
			roleChange.removedRole(oldMember,newMember);
	}
	else if(oldMember.nickname != newMember.nickname){
		nameChange(oldMember, newMember);
	}
	// find difference in roles
	// if DnD player role was added, initialize player
	// if DnD player role was removed, mark player as inactive.

}


module.exports = {
	run,
	isReady,
	checkSetup
}
