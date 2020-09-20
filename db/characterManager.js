//characterManager.js
// all functions and logic pertaining to the set of characters

const util = require('../util/util.js');
const log = util.log;
const characterOptions = require('./../characterOptions.js');
const Character = require('../Character.js');
const userExists = require('./userManager.js').isInitialized;

const db = require('./db.js');

let characters = [];



async function initializeCharacter(nameFull,userId){
	log(`initializing character ${nameFull}`);
	let newChar = new Character(nameFull,userId);

	if(await isInitialized(nameFull)) {
		throw `GUILDBANKERROR: character already exists: ${nameFull}`;
	}
	else if(userId && !userExists(userId)) {
		throw `No user with ID ${userId} exists`;
	}
	else{
		try{
			let backupPromise = await Character.backup(newChar).then( (res, err) => {
				log(`new character "${newChar.nameFull}"" initialized successfully!`,true)
				characters.push(newChar);
			})
		}catch (err) {	
			log('something went wrong with character backup',true)
			log(`ERROR initializing character: ${nameFull}`,true)
			throw err;
		}
	}
				return newChar;
}

async function isInitialized(nameFull){
	let characterSearch = await db.getElementIn({character_name_full: nameFull} ,'characters') 

	log(`checking if character with nameFull ${nameFull} is initialized..`,true)
	log(characterSearch,true)
	log(characterSearch.length > 0)

	return characterSearch.length > 0
}

module.exports = {
	initializeCharacter,
	isInitialized
}