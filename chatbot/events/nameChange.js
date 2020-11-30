//nameChange.js

import { log } from '../../util/util.js'
import { updateUserNameById } from './../../Giha/userManager.js'

export default (oldMember, newMember) => {
  let oldName =
    oldMember.nickname == null ? oldMember.user.username : oldMember.nickname
  let newName =
    newMember.nickname == null ? newMember.user.username : newMember.nickname

  log(`${oldName} changed name to ${newName}`, true)

  updateUserNameById(newMember.user.id, newName)
}
