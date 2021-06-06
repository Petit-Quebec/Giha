// newCharacter.js
import { log } from '../../util/util.js'
import { newPlayerCharacter } from '../../Giha/characterManager.js'
import User from '../../db/User.js'

const help = {
  name: 'newPlayerCharacter',
  description:
    'initializes new character\nsyntax:\n!newCharacter @<user> <fullName>',
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

const run = async (bot, message, args) => {
  let msg = await message.channel.send('generating character...')

  log('args:')
  log(args)

  let nameArray = args.slice(1)
  nameArray.forEach((word, index) => {
    nameArray[index] = word.replace(/^\w/, (c) => c.toUpperCase())
  })
  let fullName = nameArray.join(' ')
  let firstName = nameArray[0]
  let lastName = nameArray.slice(1).join('-')

  log(`Running new Character for ${fullName}...`)

  // check to see if discord ID is valid
  const guilds = bot.guilds
  const guild = guilds.get(message.guild.id)
  log('guild:')
  log(guild)
  let discordId = args[0].slice(3, args[0].length - 1) //message.author.id;
  log('discordId:')
  log(discordId)
  let member = guild.member(discordId)
  if (!member) {
    message.channel.send(
      `${args[0]} is not a valid discord handle from this Discord Server. As a result, no character "__${args[1]}__" has been initialized.`
    )
    return null
  }

  // find player by member.id
  let user = await User.fromDiscordId(member.id)
  try {
    let newCharPromise = newPlayerCharacter(firstName, lastName, user._id)
    log('cmd newPlayerCharacter newCharPromise')
    log(newCharPromise)
    let newChar = await newCharPromise
    msg.edit(`New character generated: *${newChar.fullName}*`)
  } catch (err) {
    msg.edit(`something went wrong ${err}`)
    log(err, true)
  }

  // await message.channel.send({files: [
  //   {
  //   attachment: message.author.displayAvatarURL,
  //   name: "avatar.png"
  //   }
  // ]})

  // msg.delete();
}

export default {
  run,
  permissions, 
  help
}
