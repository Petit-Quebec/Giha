"use strict";

// all functions and logic for instances of characters and about singleton characters

const util = require('./util/util.js');
const log = util.log;
const db = require('./db/db.js');
const mongoose = db.mongoose;
const characterOptions = require('./characterOptions.js');

let characterSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	nameShort: String,
	playerId: mongoose.ObjectId,
	dateCreated: Date,
	experience: Number,
	charClass: String,
	charSubclass: String,
	currentActivity: Number
});

characterSchema.methods.fullName = function () {
	let fullName = this.firstName 
		? this.firstName + ' ' + this.lastName
		: 'a nameless man';
	return fullName;
}

characterSchema.methods.moneyString = function() {
	let moneyString = '';
		let money = 14922; //this.moneyCp;
		let gold = Math.floor(money/100);
		money -= gold*100;
		
		let silver = Math.floor(money/10);
		money -= silver*10;
		
		let copper = money;

		moneyString += gold + ' gp, '
		moneyString += silver + ' sp, '
		moneyString += copper + ' cp'

		return moneyString
}

characterSchema.methods.addExperience = function(amount) {
	this.experience += amount;
	return this.experience;
}

characterSchema.methods.addResonite = function(amount) {
	log('the addResonite function is unfinished',true);
	// get player( this.playerid)
	// player.addresonite		
}

characterSchema.methods.removeResonite = function(amount) {
	log('the removeResonite function is unfinished',true);
	// get player( this.playerid)
	// player.removeresonite	
}

characterSchema.methods.level = function(){
	return levelFromExperience(this.experience);
}


	/*
}
class Character {


	// nameFull = '';
	// playerId = '';
	// nameShort = null;
	// dateCreated = new Date();
	// experience = 0;
	// moneyCp = 0;
	// charClass = null;
	// charSubclass = null;
	// currentActivity = null;


	constructor(nameFull,playerId) {
		// check to make sure namefull is a string
		// check to make sure playerid is a string

		// all of these should be functions that read from the db

		this.nameFull = nameFull;
		this._playerId = playerId; // make this private
		this.nameShort = nameFull.charAt(0); 
		this.dateCreated = new Date(); // make this private
		this.experience = 0; // make this private
		this.moneyCp = 0; // make this private
		this.charClass = 'N/A'; // make this private
		this.charSubclass = 'N/A'; // make this private
		this.currentActivity = -1; // make this private
		this.lastBackup


	}

	// constructor(characterFromDB){

	// 	characters.push(this);
	// }
	
	// getters?
	get moneyString() {
		let moneyString = '';
		let money = 14922; //this.moneyCp;
		let gold = Math.floor(money/100);
		money -= gold*100;
		
		let silver = Math.floor(money/10);
		money -= silver*10;
		
		let copper = money;

		moneyString += gold + ' gp, '
		moneyString += silver + ' sp, '
		moneyString += copper + ' cp'

		return moneyString
	}

	// example static method
	// call with Character.levelFromexperience(experience)
	static levelFromExperience(experience) {
		return levelFromExperience(experience);
	}

	static fetchAllCharacters() {

	}

	static allCharacters() {
		return characters
	}

	static getByName(string) {

	}

	static backup(character) {
		log('backup character:')
		log('character class instance:')
		log(character);
		log('character object:')
		let charObj = char2Object(character);
		log(charObj)
		log('character_name_full: ' + charObj.character_name_full)
		log(typeof charObj.character_name_full)
		log('character_name_short: ' + charObj.character_name_short)
		log(typeof charObj.character_name_short)
		log('player_id: ' + charObj.player_id)
		log(typeof charObj.player_id)
		log('date_created: ' + charObj.date_created)
		log(typeof charObj.date_created)
		log('experience: ' + charObj.experience)
		log(typeof charObj.experience)
		log('moneyCp: ' + charObj.moneyCp)
		log(typeof charObj.moneyCp)
		log('class: ' + charObj.class)
		log(typeof charObj.class)
		log('subclass: ' + charObj.subclass)
		log(typeof charObj.subclass)
		log('current_activity: ' + charObj.current_activity)
		log(typeof charObj.current_activity)
		return addEntry(charObj,'characters');
	}

	// all other methods
	
	addExperience(amount) {
		this.experience += amount;
		return this.experience;
	}

	addResonite(amount){
		log('the addResonite function is unfinished',true);
		// get player( this.playerid)
		// player.addresonite		
	}
	
	removeResonite(amount){
		log('the removeResonite function is unfinished',true);
		// get player( this.playerid)
		// player.removeresonite	
	}

	level(){
		return levelFromExperience(this.experience);
	}

	set playerId(playerId){ //interrupt the setting of playerId
		if(this.playerId)
			throw 'Illegal operation, cannot chaneg playerId';
		else
			this._playerId = playerId;
	}
}

*/


let Character = mongoose.model('Character', characterSchema)


function levelFromExperience(experience){
	if (typeof experience != int)
		throw 'cannot find level from a non-integer amount of experience'
	else {
		 return characterOptions.levelThresholds.findIndex((element => element > experience)) + 1;
	}
}

//turns a character class entity into an object, for storing in the database
function char2Object(charClass) {
	let charObj = {
		character_name_full: charClass.nameFull,
		character_name_short: charClass.nameShort,
		player_id: charClass._playerId,
		date_created: charClass.dateCreated,
		experience: charClass.experience,
		moneyCp: charClass.moneyCp,
		class: charClass.charClass,
		subclass: charClass.charSubclass,
		current_activity: charClass.currentActivity,
		lastBackup: charClass.lastBackup
	}
	return charObj;
}
		
module.exports = Character
/*
so I am writing a discord bot which uses mongoDB as a database
I have a Player class for doing Player things (like add experience)
in my mongoDB I have a Player collection so I can keep all that information up to date
how do I decide what to store in memmory vs the database?
I want the database to be the source of truth in case the server crashes or something happens
but then I am worried that im missing out on a lot of time gains.

I guess part of this is figuring out if I want push or pull based?

I don't see a reason for there to be multiple servers (maybe multiple clients)

can I make the server memmory master and the DB slave while the server is online?
would that be stupid?

This is such a high level infrastructure/architectural decision that I am not comfortable just doing something that works
*/
