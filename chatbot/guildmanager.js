// guildmanager.js
// manages which guilds this bot is present on
const log = require('../util/util.js').log;
const db = require('../db/db.js')

// guilds can either be
//  - not initialized
//  - initialized as
//		0: an admin guild
//  	1: a player guild

// =====================================
//        Private Functions
// =====================================

function getConnectedGuilds(client){
	return client.guilds;
}

function getInitializedGuilds(){
	return db.getFullCollectionArray('guilds');
}

function getActiveGuilds(){
	return null;
}

function getPassiveGuilds(){
	return null;
}

function getInactiveGuilds(){
	return null;
}

// ======================================
//          Public Functions
// ======================================

function checkGuilds(client){
	return new Promise((resolve,reject) => {
		// pull all connected guilds from bot
		let connectedGuilds = getConnectedGuilds(client).array();
		// pull all initialized guilds from DB (promise)
		let initializedGuilds;
		// wait for DB response
		getInitializedGuilds().then( results => {
			initializedGuilds = results;
			if(initializedGuilds.length == 0) {
				log('NO GUILDS INITIALIZED, SET UP A GUILD',true);
			}
			else {
				log('Initialized Guids:');
				log(initializedGuilds);
				log('Connected Guilds:');
				log(connectedGuilds);
				parseGuilds(connectedGuilds, initializedGuilds);
			}
			resolve(true);
		}).catch(reason => log(reason, true));
	}).catch(reason => log(reason,true));
}

// most of this is not tested
function parseGuilds(connectedGuilds, initializedGuilds){
	if(initializedGuilds.length == 0) throw 'parseGuilds was called with no active guilds'
	let activeGuilds = [];
	let inactiveGuilds = [];
	let passiveGuilds = [];
	// log list of Active (initialized and connected) guilds (if len>0)
	// log list of Inactive (initialized but non-connected) guilds (if len>0)
	initializedGuilds.forEach( initializedGuild => {
		let found = false;
		for (let connectedGuildIndex = 0; connectedGuildIndex < connectedGuilds.length; connectedGuildIndex++){
			connectedGuild = connectedGuilds[connectedGuildIndex];
			if (initializedGuild.id == connectedGuild.id){
				log('Guild "' + initializedGuild.name + '" is active with type '+ initializedGuild.type)
				activeGuilds.push(initializedGuild);
				found = true;
				break;
			}
		}
		if (!found){
			log('Guild "' + initializedGuild.name +'" is inactive');
			inactiveGuilds.push(initializedGuild);
		}
	});
	// log list of Passive (connected and not initialized) guilds (if len>0)
	connectedGuilds.forEach( connectedGuild => {
		let found = false;
		for (let initializedGuildIndex = 0; initializedGuildIndex < initializedGuilds.length; initializedGuildIndex++){
			initializedGuild = initializedGuilds[initializedGuildIndex];
			if (initializedGuild.id == connectedGuild.id){
				found = true;
				break;
			}
		}

		if(!found){
			log('Guild "' + connectedGuild.name +'" is passive');
			passiveGuilds.push({id: connectedGuild.id, name: connectedGuild.name, type: 'N/A'});
		}
	})
	log(activeGuilds.length + ' Active Guild(s):', true);
	activeGuilds.forEach(logGuild);
	log(inactiveGuilds.length + ' Inactive Guild(s):', true);
	inactiveGuilds.forEach(logGuild);
	log(passiveGuilds.length + ' Passive Guild(s):', true);
	passiveGuilds.forEach(logGuild);

}

function logGuild(guild) {
	log(' [\x1b[35m'+guild.type+'\x1b[0m] '+ 
		guild.name +'\n' + 
		' id: '+ guild.id, true)
}

function initializeGuild(guild, isAdmin){
	db.getElementIn({id: guild.id},'guilds').then(res => {
		if(res.length > 0){
			log('\x1b[31mWARNING:\x1b[0m Guild ' + guild.name + 
				' was called for initialzation but already exists.\n'+
				'  Initialization cancelled.'
				, true)
		}
		else {
			let type = (isAdmin ? 'admin' : 'tavern')
			log('Initializing Guild ' + guild.name + ' with type '+ type ,true);
			let newGuild = {
				id: guild.id,
				name: guild.name,
				type: type
			}
			db.addEntry(newGuild, 'guilds')
		}
	})

}

module.exports = {
	checkGuilds
}