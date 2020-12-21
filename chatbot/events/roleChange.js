import { log } from '../../util/util.js'
import { symDiff } from '../../util/util.js'
import { isUserInitialized, initializeUser } from '../../Giha/userManager.js'

export const newRole = (oldMember, newMember) => {
  let playerName =
    newMember.user.nickname == null
      ? newMember.user.username
      : newMember.user.nickname
  let id = newMember.id

  let diff = symDiff([oldMember.roles, newMember.roles])[0]

  log(`${diff.name} role was added to ${playerName}`, true)
  if (diff.name == 'DnD Player') newPlayerRole(playerName, id)
}

export const removedRole = (oldMember, newMember) => {
  let playerName =
    newMember.user.nickname == null
      ? newMember.user.username
      : newMember.user.nickname
  // let id = newMember.id

  let diff = symDiff([oldMember.roles, newMember.roles])[0] // only one roll can be removed at a time

  log(`${diff.name} role was removed from ${playerName}`, true)
  log(diff)
}

const newPlayerRole = async (playerName, discordId) => {
  let isInitialized = await isUserInitialized(discordId)
  if (isInitialized) {
    log('player role was added to an already initialized player', true)
    return
  }
  initializeUser({
    discordHandle: playerName,
    discordId: discordId,
  })
    .then(() => {
      log(`player ${playerName} initialized`, true)
    })
    .catch((err) => {
      log(`player ${playerName} initialization failed`, true)
      log(err, true)
    })
}
