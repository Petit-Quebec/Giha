"use strict";

// all functions and logic for instances of characters and about singleton characters

const util = require('../util/util.js');
const log = util.log;
const db = require('./db.js');
const mongoose = db.mongoose;
const characterOptions = require('../characterOptions.js');
const greenCheck = '\x1b[32m ✓ \x1b[0m';

let characterSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	nickName: String,
	nameShort: String,
	userId: mongoose.ObjectId,
	experience: Number,
	charRace: String,
	charGender: String,
	charClass: String,
	charSubclass: String,
	currentActivity: String,
	moneyCp: Number,
	location: String,
	inventory: Object,
	hitDieCurrent: Number,
	hpMax: Number,
	hpCurrent: Number,
	skills: Object,
	reputations: Object,
	isDead: Boolean,
	isDeleted: Boolean,
	conditions: Object
},
{ 
	timestamps: true,
	versionKey: 'version'
});

// static constructor method, does validation of charObj,
//  if everything looks good then saves the character and passes it back
characterSchema.statics.newCharacter = function(charObj) {
	return new Promise((resolve,reject) => {
		log('attempting to create new Character...',true)
		let newCharCheck = checkNewCharacter(charObj);

		newCharCheck.then( (res) => {
			if(res) {
				log(` >> making new character: '${charObj.firstName}'`,true)
				let newCharObj = initializeFields(charObj)
				let newChar = new Character(newCharObj)
				newChar.save().then(() => {
					Character.find({
						firstName: charObj.firstName,
						lastName: charObj.lastName
					}).then( res => {
						log(`${greenCheck}new character '${res[0].firstName}' successfully made`,true)
						resolve(newChar);
					});
				}).catch(err => {
					if(err) { 
						log(err,true)
						reject(err)
					}
				})
			}
		}).catch( err => {
			log('Error from checkCharacter:',true)
			log(err,true)
			reject(err)
		})
	})
}

characterSchema.virtual('charString').get( function() {
	return `${this.firstName} the level ${this.level} ${this.charRace} ${this.charClass}`
})

characterSchema.virtual('fullName').get( function() {
	let fullName = this.firstName 
		? this.firstName + ' ' + this.lastName
		: 'a nameless person';
	return fullName;
})

characterSchema.virtual('level').get( function(){
	return levelFromExperience(this.experience);
})

characterSchema.virtual('remainingExperience').get( function(){
	return remainingExperience(this.experience);
})

characterSchema.virtual('moneyToString').get( function() {
	let moneyString = '';
	let money = this.moneyCp;
	log('moneyToString: money')
	log(money)
	let gold = Math.floor(money/100);
	money -= gold*100;
	
	let silver = Math.floor(money/10);
	money -= silver*10;
	
	let copper = money;

	moneyString += gold + ' Gp, '
	moneyString += silver + ' Sp, '
	moneyString += copper + ' Cp'

	return moneyString
})

/* Methods */

characterSchema.methods.addExperience = async function(amount) {
	if (typeof amount != 'number') throw `Character.addExperience ERROR: ${amount} is not a number`
	this.experience += amount;
	return this.save();
}

characterSchema.methods.addResonite = function(amount) {
	log('the addResonite function is unfinished',true);
	// get ( this.id)
	// .addresonite		
}

characterSchema.methods.removeResonite = function(amount) {
	log('the removeResonite function is unfinished',true);
	// get ( this.id)
	// .removeresonite	
}

/* Statics */
characterSchema.statics.listCharacters = function() {
	return new Promise((resolve,reject) => {
		Character.find().then(res => {
			let txt = `__**${res.length} character${res.length == 1 ? '' : 's'} currently initialized:**__\n`;
			res.forEach( character => {
				txt += character.fullName + '\n';
				log(character,true)
			})
			resolve(txt)
		}).catch( err => {
			log('error finding characters', true)
			reject(err);
		})
	})
}

// returns a promise for the characters belonging to a user
characterSchema.statics.fromUserId = function(userMongooseId) {
	log('userMongooseId')
	log(userMongooseId)
	return Character.find({Id: userMongooseId});
}

// returns a promise for the characters for a given character Id
characterSchema.statics.fromCharacterId = function(characterMongooseId) {
	return Character.findById(characterMongooseId);
}

let Character = mongoose.model('Character', characterSchema)

/* Private Methods */

async function checkNewCharacter(charObj){
	log('checking character...',true)
	if(!(charObj.firstName)) throw 'character must have a name'
	let fullName = charObj.firstName + (charObj.lastName ? " " + charObj.lastName : "");
	
	// check to make sure that the character has a unique name
	let charOK = true;

	if(charObj.firstName.length + charObj.lastName.length < 3) {
		throw `the name "${nameFull}" is too short. Character names must be at least 3 characters.`
		return null
	}
	else if(charObj.firstName.length + charObj.lastName.length >= 32) {
		throw `the name "${nameFull}" is too long. Character names cant be over 32 characters.`
		return null
	}
	else {
		log('name is okay',true)
	}

	let namePromise = Character.find({
		firstName: charObj.firstName,
		lastName: charObj.lastName
	}).then( res => {
		log(`Character name search for ${charObj.firstName} ${charObj.lastName}:`,true)
		log(res,true);

		log(res.length + ' character(s) found',true);
		if(res.length > 0) {
			log('rejecting...',true)
			charOK = false;
			throw 'Character with that name already exists';
		}
	}).catch( err => {
		if(err) {
			charOK = false;
			throw err; 
		}
	})

	if(charObj.nickName) {
		let nicknamePromise = await Character.find({
			nickName: charObj.nickName
		}).then( res => {
			log(`Character nickname search for ${charObj.nickName}:`,true)

			log(res, true);
			if(res.length > 0) {
				charOK = false
				throw 'Character with that nickname already exists';
			}
		}).catch( err => {
			if(err){
				charOK = false
				throw err
			}
		})
	}

	await namePromise;

	if(charOK) {
		log('Character passes all checks',true)
		return true;
	}
}

function levelFromExperience(experience){
	if (typeof experience != "number")
		throw 'cannot find level from a non-integer amount of experience'
	else {
		return characterOptions.levelThresholds.findIndex((element => element > experience));
	}
}

function remainingExperience(experience){
	if (typeof experience != "number")
		throw 'cannot find level from a non-integer amount of experience'
	else {
		let nextLvl = characterOptions.levelThresholds.findIndex((element => element > experience));
		let nextThreshold = characterOptions.levelThresholds[nextLvl];
		let remainingExperience = nextThreshold - experience;
		return remainingExperience;
	}
}

function initializeFields(charObj){
	log('initializeFields(charObj):')
	log(charObj)
	let newCharObj = {
		firstName: 	     typeof charObj.firstName       == 'undefined' ? 'DEFAULT' : charObj.firstName,
		lastName:        typeof charObj.lastName        == 'undefined' ? 'DEFAULT' : charObj.lastName,
		nickName:        typeof charObj.nickName        == 'undefined' ? 'DEFAULT' : charObj.nickName,
		nameShort:       typeof charObj.nameShort       == 'undefined' ? 'DEFAULT' : charObj.nameShort,
		experience:      typeof charObj.experience      == 'undefined' ? 0 : charObj.experience,
		charRace:        typeof charObj.charRace        == 'undefined' ? 'Waxoid' : charObj.charRace,
		charGender:      typeof charObj.charGender      == 'undefined' ? 'agender' : charObj.charGender,
		charClass:       typeof charObj.charClass       == 'undefined' ? 'Peasant' : charObj.charClass,
		charSubclass:    typeof charObj.charSubclass    == 'undefined' ? 'Filthy' : charObj.charSubclass,
		currentActivity: typeof charObj.currentActivity == 'undefined' ? 'Waiting' : charObj.currentActivity,
		moneyCp:         typeof charObj.moneyCp         == 'undefined' ? 1000 : charObj.moneyCp,
		location:        typeof charObj.location        == 'undefined' ? 'Foxbarrow Farms' : charObj.location,
		inventory:       typeof charObj.inventory       == 'undefined' ? {} : charObj.inventory,
		hitDieCurrent:   typeof charObj.hitDieCurrent   == 'undefined' ? 1 : charObj.hitDieCurrent,
		hpMax:           typeof charObj.hpMax           == 'undefined' ? 5 : charObj.hpMax,
		hpCurrent:       typeof charObj.hpCurrent       == 'undefined' ? 5 : charObj.hpCurrent,
		skills:          typeof charObj.skills          == 'undefined' ? {} : charObj.skills,
		reputations:     typeof charObj.reputations     == 'undefined' ? {} : charObj.reputations,
		conditions:		 typeof charObj.conditions		== 'undefined' ? {} : charObj.conditions,
		userId:          charObj.userId,
		isDead:  	false,
		isDeleted:	false
	}
	return newCharObj;
}
		
module.exports = Character

	/*
}
class Character {


	// nameFull = '';
	// Id = '';
	// nameShort = null;
	// dateCreated = new Date();
	// experience = 0;
	// moneyCp = 0;
	// charClass = null;
	// charSubclass = null;
	// currentActivity = null;


	constructor(nameFull,Id) {
		// check to make sure namefull is a string
		// check to make sure id is a string

		// all of these should be functions that read from the db

		this.nameFull = nameFull;
		this.Id = Id; // make this private
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
		log('_id: ' + charObj._id)
		log(typeof charObj._id)
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
		// get ( this.id)
		// .addresonite		
	}
	
	removeResonite(amount){
		log('the removeResonite function is unfinished',true);
		// get ( this.id)
		// .removeresonite	
	}

	level(){
		return levelFromExperience(this.experience);
	}

	set Id(Id){ //interrupt the setting of Id
		if(this.Id)
			throw 'Illegal operation, cannot chaneg Id';
		else
			this.Id = Id;
	}
}

*/

// //turns a character class entity into an object, for storing in the database
// function char2Object(charClass) {
// 	let charObj = {
// 		character_name_full: charClass.nameFull,
// 		character_name_short: charClass.nameShort,
// 		_id: charClass.Id,
// 		date_created: charClass.dateCreated,
// 		experience: charClass.experience,
// 		moneyCp: charClass.moneyCp,
// 		class: charClass.charClass,
// 		subclass: charClass.charSubclass,
// 		current_activity: charClass.currentActivity,
// 		lastBackup: charClass.lastBackup
// 	}
// 	return charObj;
// }