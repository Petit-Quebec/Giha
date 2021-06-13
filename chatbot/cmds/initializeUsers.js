import { initializeUser } from '../../Giha/userManager.js'
import { log } from '../../util/util.js'

const help = {
  name: 'initializeUsers',
  description:
    'attempts to initialize all members of current guild with the correct role',
}

const permissions = {
  userPermissions: {
    admin: true,
    dm: false,
    player: false,
  },
  locationPermissions: {
    activeGuild: true,
    passiveGuild: false,
    inactiveGuild: false,
    directMessage: true,
  },
}

const run = async (bot, message) => {
  const guilds = bot.guilds
  const guild = guilds.get(message.guild.id)
  log('guild:')
  log(guild)
  let members = guild.members

  let report = ''

  let totalMembers = members.array().length
  let rolelessMembers = 0
  let roledMembers = 0
  let alreadyInitialized = 0
  let toBeInitialized = 0
  let successes = []
  let failures = []

  for (
    let memberIndex = 0;
    memberIndex < members.array().length;
    memberIndex++
  ) {
    const member = members.array()[memberIndex]
    let newPlayer = {
      discordHandle: member.nickname ? member.nickname : member.user.username,
      discordId: member.id,
    }

    if (member.roles.some((role) => role.name == 'DnD Player')) {
      log(`${newPlayer.discordHandle} has the DnD Player Role!`)
      roledMembers++

      try {
        await initializeUser(newPlayer)
        log(`initialized player ${newPlayer.discordHandle}`, true)
        toBeInitialized++
        successes.push(newPlayer.discordHandle)
      } catch (err) {
        log('err:', true)
        log(err, true)
        if (
          typeof err == 'string' &&
          err.search('LOOMERROR: player already initialized') != -1
        ) {
          alreadyInitialized++
          log('alreadyInitialized: ' + alreadyInitialized, true)
        } else {
          failures.push(newPlayer.discordHandle)
          log(failures, true)
        }
      }
    } else {
      rolelessMembers++
    }
  }

  report +=
    'totalMembers: ' +
    totalMembers +
    '\n' +
    'rolelessMembers: ' +
    rolelessMembers +
    '\n' +
    'roledMembers: ' +
    roledMembers +
    '\n' +
    'alreadyInitialized: ' +
    alreadyInitialized +
    '\n' +
    'toBeInitialized: ' +
    toBeInitialized +
    '\n' +
    'successes: ' +
    successes.length +
    '\n' +
    'failures: ' +
    failures.length +
    '\n'
  log(report, true)
  log('alreadyInitialized: ' + alreadyInitialized, true)
  await message.channel.send(report)
}

export default {
  run,
  permissions,
  help,
}
