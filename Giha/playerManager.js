const util = require('../util/util.js');
const log = util.log;

const User = require('./db/User.js')
const db = require('./db.js');


// getUser

// findOrCreate

async function initializePlayer(newPlayer){

	if (!newPlayer.hasOwnProperty('discordId')) throw 'players require a valid discord Id';

	log(newPlayer,true)

	let player = {
		name: 'name' in newPlayer ? newPlayer.name : 'null',
		discordHandle: 'discordHandle' in newPlayer ? newPlayer.discordHandle : 'null',
		discordId: newPlayer.discordId,
		active: true
	}

	//check to see if player already exists
	if(await isInitialized( player.discordId)) {
		throw `LOOMERROR: player already initialized: ${player.discordHandle}`;
	}
	else{
		try{
			log( `\ntypeof ${typeof player.discordId}`,true)
			let res = await db.addEntry(player, 'players')//.catch(log('an error happened',true))
			log(res,true)
			if(await res)
				log(`successfully initialized player ${player.discordId}[${player.discordHandle}]`)
		}catch (err) {	
			log('ERROR initializing player:',true)
			log(player,true)
			throw err;
		}
	}
}

async function updatePlayerNameById(id, name){
	let playerSearch = await db.getElementIn({discordId: id} ,'players') 
	if(!playerSearch)
		throw `no player with id: ${id}`
	else {
		log(playerSearch, true);
		db.editEntry('players', {discordId: id}, { $set: {discordHandle: name}})
	}
}

// updates a player's permissions where the permissions Object is of format
// permissions: {
// 	admin: true,
// 	dm: false
// }
// either can be omitted, must be true or false
async function updatePlayerPermissionsById(id,permissions){
	let playerSearch = await db.getElementIn({discordId: id} ,'players') 
	if(playerSearch.length == 0)
		throw `no player with id: ${id}`
	else {
		oldPerms = playerSearch[0].permissions;
		let newPerms = {
			// if permissions has a boolean, use that, otherwise use prior value
			admin: typeof permissions.admin == 'boolean' ? permissions.admin : oldPerms.admin,
			dm: typeof permissions.dm == 'boolean' ? permissions.dm : oldPerms.dm
		}
		return db.editEntry('players', {discordId: id}, { $set: {permissions: newPerms}});
	}
}

async function isInitialized(id){
	let playerSearch = await db.getElementIn({discordId: id} ,'players') 

	log(`checking if player with id ${id} is initialized..`)
	log(playerSearch)
	log(playerSearch.length > 0)

	return playerSearch.length > 0
}

async function permissions(id){
	let playerSearch = await db.getElementIn({discordId: id} ,'players') 

	log(playerSearch)
	log(playerSearch.length > 0)

	return playerSearch[0].permissions;
}

module.exports = {
	initializePlayer,
	isInitialized,
	updatePlayerNameById,
	updatePlayerPermissionsById,
	permissions
}