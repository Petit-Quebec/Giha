const log = require('../util/util.js').log;
const validators = require('./db_validators.js');
const mongoose = require('mongoose');
const Schema = require('validate');


require('dotenv').config()

let databaseBooted = false;

const MONGO_UN = process.env.MONGO_UN;
const MONGO_PW = process.env.MONGO_PW;
const mongoUrl = 
	'mongodb+srv://' + 
	MONGO_UN + 
	':' + 
	MONGO_PW + 
	'@loom-nsyqv.azure.mongodb.net/loom?retryWrites=true&w=majority';

mongoose.connect(mongoUrl, {useNewUrlParser: true}).catch(err => {
	log("Error with mongoose connecting!",true);
	throw err;
});
let db = mongoose.connection;
db.on('error', err => {
	log(err,true);
	throw err
});
db.once('open', function() {
	log('\x1b[32m'+
	' ✓' +
	'\x1b[0m' +
	' Connected to the \x1b[32mmongooose\x1b[0m databse as ' +
	'\x1b[7m' +
	 MONGO_UN +
	'\x1b[0m',
	true);
	databaseBooted = true;
});
log('  MongoDB connection initializing...', true);


function getFullCollectionArray(collectionName) {
	log('grabbing collection: ' + collectionName, true);
	return new Promise((resolve, reject) => {
		db.collection(collectionName,{strict:true}, (err, col) => {
			if(err) return log(err, true);
			resolve(col.find().toArray());
		});
	});
}


// this request object is a list of key/value pairs to match
function getElementIn(request, collection) {
	log('looking for entry in '+collection);
	return new Promise((resolve,reject) => {
		db.collection(collection).find(request, (err, res) => {
			if(err) {
				return log(err, true);
			}
			resolve(res.toArray());
		})
	})
}

function getMonsterArray() {
	return getFullCollectionArray('monsters');
}

function addEntry(newObj,collection) {
	log('adding entry to '+ collection, true);
	log(newObj,true)
	return new Promise((resolve, reject) => {
		db.collection(collection,{strict:true}, (err, col) => {
			if(err) {
				log(`ERROR adding entry to ${collection}, collection error`, true)
				return log(err, true);
			}
			let check = validators[collection].validate(newObj);
			if(check.length == 0){
				col.insertOne(newObj, (err, result) => {
					if (err) {
						log(`ERROR adding entry to ${collection}`,true)
						reject(err)
					}
					if(result.modifiedCount == 1){
						resolve("Successfully added an entry to " + collection + "!");
					}
				});
			}
			else {
				log('Validation Error in addEntry',true)
				log(check,true);
				reject(check)				
			}
		});
	});
}


// coll is a string
// filter is an object with key values you want to filter by
// update is the update you want to apply

// example:
// db.editEntry('players', {discordId: id}, { $set: {discordHandle: name}})
// for more options than $set (there are a few), check out mongodb docs
function editEntry(coll, filter, update, options) {
	return new Promise((resolve,reject) => {
		getElementIn(filter, coll).then( res => {
			if(res.length == 1) {
				log(`updating entry in ${coll}`,true)
				db.collection(coll)
				.updateOne(filter,update,options,
					(err, result) => {
						if (err) return log(err, true);
						if (result.modifiedCount = 1) {
							log(`successfully modified ${result.modifiedCount} entries!`,
								true);
							resolve(result);
						}
						// log(result, true);
					})
			};
		}).catch(err => { throw 'expected to find 1 entries for given filter but found '+res.length;})
	})
}

function editEntries(coll, filter, update, options) {
	// log(`updating entry in ${coll}`,true)
	// return new Promise((resolve,reject) => {
	// 	db.collection(coll)
	// 	.updateOne(filter,update,options,
	// 		(err, result) => {
	// 			if (err) return log(err, true);
	// 			if (result.modifiedCount = 1)
	// 				log(`successfully modified ${result.modifiedCount} entries!`,
	// 					true)
	// 		})
	// })
}

function editMonster(filter, update, options) {
	log('updating monster', true);
	return new Promise((resolve,reject) => {
		db.collection('monsters')
		.updateOne(filter,update,options,
	  	(err, result) => {
	    	if (err) return log(err, true);
	    	if(result.modifiedCount > 0)
	    		log("Success! " +
	    			result.modifiedCount +
	    			" etnries were modified",
	    			true);
	    	else
	    		log("Everything went through but nothing was modified.", true)
	    	resolve(result)
	  	})
	})
}

function deleteEntry(filter, coll, options) {
	log('deleting from coll '+ coll, true);
	log('filter',true);
	log(filter,true);
	return new Promise((resolve, reject) => {
		db.collection(coll,{strict:true}, (err, col) => {
			if(err) return log(err, true);
			col.deleteOne(filter, (err, result) => {
				if (err) return log(err, true);
				log('deleted '+result.deletedCount+' entries', true)
				if(result.deletedCount == 1)
					resolve(result);
				else if (result.deletedCount == 0)
					resolve("No entry was deleted");
			});
		});
	});
}

function runCommand(command, options) {
	log('running command on remote Db:', true);
	log(command, true)
	return new Promise((resolve, reject) => {
		db.command(command, options, (err, result) => {
			if(err) reject(err);
			else resolve('great success!');
		});
	});
}

function getCollectionInformation(targetCollection) {
	log('Attempting to get information on the collection: '+targetCollection, true);
	return new Promise((resolve,reject) => {
		db.getCollectionInfos( {name: targetCollection}, (resolve, reject) => {
			if(err) return log(err, true);
			else reslove(result);
		});
	})	
}

function newColl(collname) {
	log('Attempting to make a new collection named '+ collname, true);
	return new Promise(( resolve,reject) => {
		db.createCollection(collname).then(result => {
			resolve(result)
	 		}, reason => {
	 		log(reason, true);
	 		}
		)
	})
}

function databaseReady() {
	return databaseBooted;
}

function validate(entry,colllection) {
	// checks if the given entry fulfills the validation requirements of the given collection

}

function validateCollection(coll) {
	// checks all entries in a collection against vallidation requirements of that collection
}

module.exports = {
	databaseReady,
	getMonsterArray,
	addEntry,
	editEntry,
	deleteEntry,
	runCommand,
	newColl,
	getFullCollectionArray,
	getElementIn,
	mongoose
}