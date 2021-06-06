import { getUserByDiscordId } from '../../Giha/userManager.js'
import { log, isUser } from '../../util/util.js'

const name = 'grantAdmin'

const help = {
  name: name,
  description: 'Grants a target user admin powers',
  format: `!${name} @user`,
  note: 'can only be ran by server lord',
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

const run = async (bot, message, args) => {
  let msg = await message.channel.send('granting admin...')

  // parse args and test them
  try {
    if (args.length != 1)
      throw `grantAdmin requires 1 argument (you provided ${args.length})`
    let discordId = args[0].slice(3, args[0].length - 1)
    let user = await getUserByDiscordId(discordId)
    if (!isUser(user)) {
      throw `issue with granting to ${args[0]}, please tag the user you wish to give Xp to.`
    }
    // do the actual operation
    let res = await user.grantRole('Admin')
    let txt = `successfully granted admin to ${res.handle}`
    msg.edit(txt)
    log(txt, true)
    // update reply and log it
  } catch (err) {
    // if there is a problem, log it and inform the user
    log(err, true)
    let txt = `use the format ${help.format}\n` + err
    msg.edit(txt)
  }
}

/*
export const run = async(bot, message, args) => {
  let user = message.author;

  log('args:')
  log(args);
  // check to see if discord ID is valid

  if(args.length == 0) {
  message.channel.send(`please specify who to target with @`);
  return;
  }

  let guilds = bot.guilds;
  guild = guilds.get(message.guild.id);
  log('guild:');
  log(guild);
  let discordId = args[0].slice(3,args[0].length-1);//message.author.id;
  let member = guild.member(discordId)
  if(!member)
  {
  message.channel.send(`${discordId} is not a valid discord ID from this guild. As a result, no player <@${discordId}> has been initialized`);
  }

  if (players.isInitialized(discordId)) {
  let result = await players.updatePlayerPermissionsById(discordId, {admin: true})
  if(result.modifiedCount == 1) {
    log('Admin Privelage granting successful!',true)
    message.channel.send('Admin Privelages granted to ' + member.nickname)
  }
  }
  else throw 'Cannot assign role, player not initialized.'
}
*/

export default {
  run,
  permissions, 
  help
}
