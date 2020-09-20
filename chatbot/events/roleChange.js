const log = require('../../util/util.js').log;
const symDiff = require('../../util/util.js').symDiff;
const userManager = require('../../db/userManager.js');

function newRole(oldMember,newMember) {
	let playerName = newMember.user.nickname == null ? newMember.user.username : newMember.user.nickname;
	let id = newMember.id;

	let diff = symDiff(oldMember.roles,newMember.roles)[0];

	log(`${diff.name} role was added to ${playerName}`,true)
	if(diff.name == 'DnD Player')
		newPlayerRole(playerName, id)


}

function removedRole(oldMember,newMember) {
	let playerName = newMember.user.nickname == null ? newMember.user.username : newMember.user.nickname;
	let id = newMember.id;

	let diff = symDiff(oldMember.roles,newMember.roles)[0]; // only one roll can be removed at a time

	log(`${diff.name} role was removed from ${playerName}`,true)
	log(diff)

}

async function newPlayerRole(playerName, discordId) {

	let isInitialized = await userManager.isInitialized(discordId);
	if(isInitialized) {
		log(`player role was added to an already initialized player`,true)
		return
	}
	userManager.initializePlayer({
		discordHandle: playerName,
		discordId: discordId
	}).then( () => {
		log(`player ${playerName} initialized`,true)
	}).catch( err => {
		log(`player ${playerName} initialization failed`, true)
		log(err,true)
	})
}

module.exports = {
	newRole,
	removedRole
}