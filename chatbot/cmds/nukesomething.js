import { log } from '../../util/util.js'
import db from '../../db/db.js'

const help = {
  name: 'nukesomething',
  description: 'a very specific purpose',
}

const permissions = {
  userPermissions: {
    admin: false,
    dm: false,
    player: false,
  },
  locationPermissions: {
    activeGuild: false,
    passiveGuild: false,
    inactiveGuild: false,
    directMessage: false,
  },
}

const run = async () => {
  db.deleteEntry({}, 'fasd').then((res) => {
    log(res, true)
  })
}

export default {
  run,
  permissions, 
  help
}
