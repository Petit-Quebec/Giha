//nameChange.js

const log = require('../../util/util.js').log;
const userManager = require('./../../db/userManager.js');

function nameChange(oldMember, newMember) {
	let oldName = oldMember.nickname == null ? oldMember.user.username : oldMember.nickname;
	let newName = newMember.nickname == null ? newMember.user.username : newMember.nickname;

	log(`${oldName} changed name to ${newName}`,true)

	userManager.updatePlayerNameById(newMember.user.id,newName);

}

module.exports = nameChange