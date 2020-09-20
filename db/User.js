"use strict";

// all functions and logic for instances of characters and about singleton characters

const util = require('../util/util.js');
const log = util.log;
const db = require('./db.js');
const mongoose = db.mongoose;
const Schema = mongoose.Schema;
 
/* Schema */
const schemaOptions = {
  toJSON: { virtuals: true }
};

const userSchema = new Schema({
  connections: {
    discord: {
    	discord_id: String,
    	discord_handle: String
    },
    google: String
  },
  created_at: Date,
  last_seen: Date,
  email: String,
  handle: String,
  is_active_player: Boolean,
  name: {
    first: String,
    last: String
  },
  current_system: String,
  scopes: []
}, schemaOptions);
 
/* Virtuals */

// Concat user's first + last name
userSchema.virtual('fullName').get( () => {
  return this.name.first + ' ' + this.name.last;
});
 
// Return true if user is admin
userSchema.virtual('isAdmin').get( () => {
  let isAdmin = false;
  // If user is Logan, admin is true
  // !TODO Don't do this LOL
  if ( this.connections.discord && this.connections.discord === '153983024411836416' ) {
    isAdmin = true;
  }
  // find admin scope
  let foundAdmin = this.scopes.find( scope => {
    return scope === 'admin'
  });
  // If admin found within scopes, admin is true
  if (foundAdmin) isAdmin = true;
  return isAdmin;
});
 
// Return true if user is Dm
userSchema.virtual('isDm').get( () => {
  let isDm = false;
  // If user is Logan, Dm is true
  // !TODO Don't do this LOL
  if ( this.connections.discord && this.connections.discord === '153983024411836416' ) {
    isDm = true;
  }
  // find Dm scope
  let foundDm = this.scopes.find( scope => {
    return scope === 'dm'
  });
  // If Dm found within scopes, Dm is true
  if (foundDm) isDm = true;
  return isDm;
});

userSchema.virtual('isPlayer').get( () => {
  return is_active_player;
})


// returns true or false based on basic validation critera. players need to provide their name, etc.
userSchema.virtual('isSetup').get( () => {
  return true;
});


/* Methods */
 
 
 
/* Compile Model */
let User = mongoose.model('User', userSchema);
 
/* Public */
 
/* Private */
function _loginUserSync(user) {
  user.last_seen = Date.now();
  user.save();
}
 
/* Exports */
module.exports = User









 
/*
 * Create or Find
 * @param {object} profile The profile object from Passport Oauth
 */
function findOrCreate(profile) {
  return new Promise( (resolve, reject) => {
    let user = undefined;
    let provider = profile.provider;
    let date = Date.now();
    let newUser = new User({
      created_at: date
    });
 
    // Oauth provider details
    switch(provider) {
      case 'discord':
        newUser.connections.discord = profile.id;
 
        newUser.email = profile.email;
        newUser.handle = profile.username;
        User.find( { "connections.discord": profile.id } , ( err, docs ) => {
          // If user doesn't exist
          if(!docs || docs.length == 0) {
            newUser
              .save()
              .then( () => {
                console.log('New user: ' + newUser.email);
              });
            user = newUser;
          }
          // Else if user does exist
          else {
            console.log('User logged in: ' + newUser.email);
            user = docs[0];
            _loginUserSync(user);
          }
        })
        .then( () => {
          resolve(user);
        })
        .catch( (err) => {
          reject(err);
        });
        break;
      case 'google':
        newUser.connections.google = profile.id;
        newUser.email = profile.emails[0].value;
        newUser.handle = profile.displayName;
        newUser.name.first = profile.name.givenName;
        newUser.name.last = profile.name.familyName;
        User.find( { "connections.google": profile.id } , ( err, docs ) => {
          // If user doesn't exist
          if(!docs || docs.length == 0) {
            newUser
              .save()
              .then( () => {
                console.log('New user: ' + newUser.email);
              });
            user = newUser;
          }
          // Else if user does exist
          else {
            // TODO if new provider but same email, add new connection info
            console.log('User logged in: ' + newUser.email);
            user = docs[0];
            _loginUserSync(user);
          }
        })
        .then( () => {
          resolve(user);
        })
        .catch( (err) => {
          reject(err);
        });
        break;
      default:
    }
 
  });
}
