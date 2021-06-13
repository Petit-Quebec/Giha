import Character from '../../db/Character.js'
import { log } from '../../util/util.js'

const help = {
  name: 'testCharacter',
  description: 'tests the character class',
}

const permissions = {
  userPermissions: {
    admin: true,
    dm: true,
    player: false,
  },
  locationPermissions: {
    activeGuild: true,
    passiveGuild: false,
    inactiveGuild: false,
    directMessage: true,
  },
}

const run = async (_bot, message) => {
  log(' | testing character initialization...', true)
  log(' | deleting old Sansbar Illyn..')

  let character
  try {
    character = await Character.find({
      firstName: 'Sansbar',
      lastName: 'Illyn',
    })
  } catch (err) {
    log(err, true)
    message.channel.send(' | ERROR deleting the old Sansbar:\n' + err)
  } finally {
    await createSansBar(message)
  }

  if (character.length > 0) {
    character[0].deleteOne()
    log(' | old Sansbar deleted', true)
  } else {
    log(' | no Sansbar exists yet', true)
  }
}

const createSansBar = async (message) => {
  log(' | making Sansbar anew', true)
  let res
  try {
    res = await Character.newCharacter({
      firstName: 'Sansbar',
      lastName: 'Illyn',
    })
  } catch (err) {
    log(err, true)
    message.channel.send('ERROR creating Sansbar:\n' + err)
  }

  message.channel.send('Successfully created Sansbar\n' + res)
}

export default {
  run,
  permissions,
  help,
}
