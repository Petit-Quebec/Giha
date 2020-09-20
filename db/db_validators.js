let Schema = require('validate')

let classList = require('./../characterOptions.js').classList;
let subclassList = require('./../characterOptions.js').subclassList;
let playLocations = ['Warchief']

// uses npm validate package
/// https://www.npmjs.com/package/validate#property

const characters = new Schema({
   character_name_full: {
      type: String,
      required: true,
      length: { min: 3, max: 32}
   },
   character_name_short: {
      type: String,
      required: false,
      length: { min: 1, max: 9}
   },
   player_id: {
      type: String,
      required: true
   },
   date_created: {
      type: Date,
      required: true
   },
   experience: {
      type: Number,
      required: true,
      size: { min: 0}
   },
   moneyCp: {
      type: Number,
      required: true,
      size: { min: 0}
   },
   class: {
      type: String,
      required: false,
      enum: classList
   },
   subclass: {
      type: String,
      required: false,
      enum: subclassList
   },
   current_activity: {
      type: Number,
      required: false,
   }
});

const players = new Schema({
   irlName: {
      type: String,
      required: false
   },
   discordHangle: {
      type: String,
      required: false
   },
   discordId: {
      type: String,
      required: true
   },
   active: {
      type: Boolean,
      required: true
   },
   email: {
      type: String,
      match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
   }
})

const sessions = new Schema({
   name: {
      type: String,
      required: true
   },
   dungeon_master_id: {
      type: String,
      required: true
   },
   playLocation: {
      type: String,
      required: false,
      enum: playLocations
   },
   maxPlayers: {
      type: Number,
      required: true
   },
   enrolled_haracter_ids: {
      type: Array,
      each: { type: String },
      required: false
   },
   recap_writer_player_id: {
      type: String,
      required: false
   },
   adventure: {
      type: String,
      required: false
   },
   status: {
      type: Number,
      required: true
   }
})

module.exports ={
   characters,
   players,
   // monsters,
   sessions
}

// let characters = {
// 		collMod: 'characters',
// 		validator: {
// 			$jsonSchema: {
// 				bsonType: "object",
//          		required: [ "character_name", "player_id", /*"date_created",*/ "experience", "moneyCP", "class", "subclass"], 
//          		properties: { 
//                   character_name_full: { 
//                      bsonType: "string", 
//                      description: "required and must be a string"
//                   },
//                   character_name_short: { 
//                      bsonType: "string", 
//                      description: "optional and must be a string"
//                   }, 
//             		player_id: { 
//                		bsonType: "int", 
//                		description: "required and must be an integer"
//                	},/*
//                	date_created: {
//                		bsonType: "date",
//                		description: "required and must be a timestamp"
//                	},*/
//                   experience: {
//                      bsonType: "int",
//                      description: "required and must be an integer"
//                   },
//                   moneyCp: {
//                      bsonType: "int",
//                      description: "required and must be an integer"
//                   },
//                   class: {
//                      bsonType: "int",
//                      description: "required and must be an integer"
//                   },
//                   subclass: {
//                      bsonType: "int",
//                      description: "required and must be an integer"
//                   },
//                   current_activity: {
//                      bsonType: "int",
//                      description: "required and must be an integer"
//                   }
//          		}
//        		}
// 		},	
// 		validationLevel: "off", 
// 		validationAction: "error" 
// 	}

// let sessions = {
// 		collMod: 'sessions',
// 		validator: {
// 			$jsonSchema: {
// 				bsonType: "object",
//          		required: [ "DateTime"], 
//          		properties: { 
//             		name: { 
//                			bsonType: "date", 
//                			description: "required and must be a string"
//                		}, 
//                   dungeonMaster: { 
//                         bsonType: "string", 
//                         description: "optional and must be a string"
//                      }, 
//                   playLocation: { 
//                         bsonType: "string", 
//                         description: "optional and must be a string"
//                      }, 
//                   maxPlayers: { 
//                         bsonType: "string", 
//                         description: "optional and must be a string"
//                      }, 
//                   enrolledPlayers: { 
//                         bsonType: "string", 
//                         description: "optional and must be a string"
//                      }, 
//                   recapWriter: { 
//                         bsonType: "string", 
//                         description: "optional and must be a string"
//                      }, 
//                   adventure: { 
//                         bsonType: "string", 
//                         description: "optional and must be a string"
//                      }, 
//                   status: { 
//                         bsonType: "int", 
//                         description: "optional and must be an integer.\n 0 - building\n 1 - adventuring\n 2 - completed"
//                      }
//          		}
//        		}
// 		},	
// 		validationLevel: "off", 
// 		validationAction: "error" 
// 	}

// let players = {
// 		collMod: 'players',
// 		validator: {
// 			$jsonSchema: {
// 				bsonType: "object",
//          		required: [ "discordId" ], 
//          		properties: { 
//             		name: { 
//                			bsonType: "string", 
//                			description: "optional and must be a string"
//                		}, 
//             		discordId: { 
//                			bsonType: "string", 
//                			description: "required and must be a string"
//                		},
//                   active: {
//                         bsonType: "bool",
//                         description: "required and must be a boolean. indicates if the player is currently active"
//                   }
//          		}
//        		}
// 		},	
// 		validationLevel: "off", 
// 		validationAction: "error" 
// 	}

// let monsters = {
// 		collMod: 'monsters',
// 		validator: {
// 			$jsonSchema: {
// 				bsonType: "object",
//          		required: [ "name", "special" ], 
//          		properties: { 
//             		name: { 
//                			bsonType: "string", 
//                			description: "required and must be a string"
//                		}, 
//             		special: { 
//                			bsonType: "string", 
//                			description: "required and must be a string"
//                		}
//          		}
//        		}
// 		},	
// 		validationLevel: "off", 
// 		validationAction: "error" 
// 	}
