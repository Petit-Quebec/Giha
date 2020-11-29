//characterManager.js
// unused by Giha
// all functions and logic pertaining to the set of characters

import { log } from '../util/util.js'
import Character from '../db/Character.js'
import User from '../db/User.js'
import userManager from '../Giha/userManager.js'
import db from '../db/db.js'

let characters = []

export const newPlayerCharacter = async (firstName, lastName, userId) => {
  let newChar = await Character.newCharacter({
    firstName: firstName,
    lastName: lastName,
    userId: userId
  })

  log('checking default character for user..', true)
  let user = await User.fromUserId(userId)
  let defaultCharacter
  try {
    defaultCharacter = await Character.fromCharacterId(user.defaultCharacter)
    if (!defaultCharacter) {
      throw 'default character is ' + defaultCharacter
    }
    if (defaultCharacter.isDead) throw 'default character is dead'
    if (defaultCharacter.isDeleted) throw 'default character is deleted'
  } catch (err) {
    log(err, true)
    log(
      `user has no default character! setting ${newChar.fullName} as default..`,
      true
    )
    user.setMain(newChar)
  }
  return newChar
}

// awards xp to a character or, if given a user, their default character, or a party
export const awardXp = async (target, experience) => {
  log(experience, true)
  let character
  if (target.constructor.collection.name == 'characters') {
    character = target
  } else if (target.constructor.collection.name == 'users') {
    log(`awarding xp to ${target.handle}`)
    character = await Character.fromCharacterId(target.defaultCharacter)
  } else if (target == 'party') {
    throw 'party xp awarding is not yet implemented'
  } else throw 'you can only award xp to users and characters!'
  try {
    return await character.addExperience(experience)
  } catch (err) {
    log('characterManager.awardXP Error: ', true)
    log(err, true)
    throw err
  }
}

export const initializeCharacter = async (nameFull, userId) => {
  log(`initializing character ${nameFull}`)
  let newChar = new Character(nameFull, userId)

  if (await isInitialized(nameFull)) {
    throw `GUILDBANKERROR: character already exists: ${nameFull}`
  } else if (userId && !userManager.isInitialized(userId)) {
    throw `No user with ID ${userId} exists`
  } else {
    try {
      await Character.backup(newChar)
      log(
        `new character "${newChar.nameFull}"" initialized successfully!`,
        true
      )
      characters.push(newChar)
    } catch (err) {
      log('something went wrong with character backup', true)
      log(`ERROR initializing character: ${nameFull}`, true)
      throw err
    }
  }
  return newChar
}

const isInitialized = async (nameFull) => {
  let characterSearch = await db.getElementIn(
    { character_name_full: nameFull },
    'characters'
  )

  log(`checking if character with nameFull ${nameFull} is initialized..`, true)
  log(characterSearch, true)
  log(characterSearch.length > 0)

  return characterSearch.length > 0
}
