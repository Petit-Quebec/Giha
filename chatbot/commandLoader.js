const log = require('../util/util.js').log;
const util = require('../util/util.js');
const jsUtil = require('util');
const promisify = jsUtil.promisify;
const fs = require('fs');
fs.readdirAsync = promisify(fs.readdir);

const RELATIVE_CMD_PATH = `./cmds/`;
const ABSOLUTE_CMD_PATH = `./chatbot/cmds/`;

async function reloadBotCommands(bot) {
    if(bot.constructor.name != "Client") throw 'cannot reload bot commands without a bot.'
    try {
		bot.commands.forEach( cmd => {
			delete require.cache[require.resolve(RELATIVE_CMD_PATH + `${cmd.help.name}.js`)];
		})
	} catch(e) {
		log(e,true)
    }
	let numCmds;
	try {
		let files = await fs.readdirAsync(ABSOLUTE_CMD_PATH)
		let jsfiles = files.filter(f => f.split(".").pop() === "js");
		if(jsfiles.length <= 0) {
			log("No commands to load!", true);
			return 0;
		}
		let numCmds = jsfiles.length
		log(` > □ Loading ${numCmds} commands!`);

		jsfiles.forEach((f, i) => {
			let props = require(RELATIVE_CMD_PATH + `${f}`);
			log(`      command ${i+1}: ${f} loaded!`);
			bot.commands.set(props.help.name, props);
		});
		log(`   [commandLoader] ${numCmds} commands successfully loaded`,true)
		return numCmds;
	}catch(e) {
		log('Error, a real bad one',true)
		log(e,true)
	}
    return true;
}

module.exports = reloadBotCommands