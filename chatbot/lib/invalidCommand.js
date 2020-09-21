const util = require('../../util/util.js')
const DELAY_MS = 5000; 
async function invalidCommand(msg) {
    let response = await msg.channel.send(`\`${msg.content}\` is not a valid command\nFor help type !help`)
    response.delete(DELAY_MS);
    return true;
}

module.exports = invalidCommand;