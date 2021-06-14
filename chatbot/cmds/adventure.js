import { log } from '../../util/util.js'
import { getHeroById } from '../../Giha/heroManager.js'
import { newInstance } from '../../Giha/instanceManager.js'
import { newPrompt } from '../../Giha/promptManager.js'
import ResponseAction from '../ResponseAction.js'
import Discord from 'discord.js'

let name = 'adventure'

const help = {
  name: name,
  description: 'creates a new adventure instance',
  format: `!${name} @user1 @user2 @user3 @user4`,
  note: 'tag 0-4 people to join the party (0 will be solo)',
}

const permissions = {
  userPermissions: {
    admin: true,
    dm: true,
    player: true,
  },
  locationPermissions: {
    activeGuild: false,
    passiveGuild: false,
    inactiveGuild: false,
    directMessage: false,
  },
}

const run = async (bot, message, args) => {
  let msg = await message.channel.send('performing function...')

  // parse args and test them
  try {
    //look at all arguments
    //parse into individual users
    //make sure all users have active heroes
    //throw errors if any of those dont work
    //make a new instance and add all party members to the instance
    //display the instance
    //call Instance.render to display map and stats blob
    //react to own message with up left right down arrow keys
    //add message to list of bot messages that are being watched for reactions
    //
    let party = []
    let userHero = getHeroById(message.author.id)
    log(userHero, true)
    if (!userHero) {
      throw `<@${message.author.id}> does not have a valid hero, please make a hero with !rise <name>`
    } else {
      party.push(userHero)
    }

    if (args.length > 4) throw 'too many users tagged'
    args.forEach((tag) => {
      let discordId = tag.slice(3, tag.length - 1)
      let hero = getHeroById(discordId)
      if (!hero)
        throw `<@${discordId}> does not have a valid hero, please make a hero with !rise <name>`
      else party.push(hero)
    })
    // for (let usersTagged = 0; usersTagged < args.length; usersTagged++) {}

    let instance = newInstance()
    party.forEach((hero) => {
      instance.addPartyMember(hero)
    })

    const move = (direction) => {
      instance.move(direction)
      prompt.message.edit(asciiMap())
      prompt.stripReactions()
    }

    const mapEmbed = () => {
      const coords = instance.partyCoordinates
      let asciiMap = instance.renderASCII()
      let embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setTitle('Instance')
        .addField({ name: 'Map', value: asciiMap })
        .addField({ name: 'coords', value: `x:${coords.x} y:${coords.y}` })
      return embed
    }

    const asciiMap = () => {
      return '```' + instance.renderASCII() + '```'
    }

    let prompt

    const up = new ResponseAction('unicodeEmoji', '⬆️', () => {
      move('up')
    })
    const down = new ResponseAction('unicodeEmoji', '⬇️', () => {
      move('down')
    })
    const right = new ResponseAction('unicodeEmoji', '➡️', () => {
      move('right')
    })
    const left = new ResponseAction('unicodeEmoji', '⬅️', () => {
      move('left')
    })

    const responseActions = [left, up, down, right]

    prompt = newPrompt(
      message.channel,
      'noLimit',
      responseActions,
      bot,
      asciiMap(),
      {},
      { time: 60000 },
      () => {
        // do something like saying the dungeon has timed out idk
      }
    )

    // update reply and log it
    // const txt = `created new instance with <@${message.author.id}> as the party leader`
    // msg.edit({ embed: mapEmbed() })
  } catch (err) {
    // if there is a problem, log it and inform the user
    log(err, true)
    const txt = `use the format ${help.format}\n` + err
    msg.edit(txt)
  }
}

export default {
  run,
  permissions,
  help,
}
