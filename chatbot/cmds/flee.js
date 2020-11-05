const log = require('../../util/util.js').log
const util = require('../../util/util.js')
const heroManager = require('../../Giha/heroManager.js')
const encounterManager = require('../../Giha/encounterManager.js')

let name = `flee`

module.exports.help = {
	name: name,
	description: 'lets you run away',
	format: `!flee`,
	note: 'uses first hero if none are specified',
}

module.exports.permissions = {
	userPermissions: {
		admin: true,
		dm: true,
		player: true,
	},
	locationPermissions: {
		activeGuild: true,
		passiveGuild: true,
		inactiveGuild: true,
		directMessage: true,
	},
}

module.exports.run = async(bot, message, args) => {
    let msg = await message.channel.send('trying to flee...')

    try {
        let id = message.author.id
        let hero = heroManager.getHeroById(id)
        let txt

        if (!hero)
            txt = "You need to have a hero to flee! Make one with !rise"
        else {
            let encounters = encounterManager.getEncountersByHero(hero)
            let activeEncounter = encounters.find((encounter) => encounter.isActive()) || false

            if (!activeEncounter)
                txt = "You must be in an active encounter to flee!"
            else {
                //Want to end current encounter
                activeEncounter.encounterActive = false
                txt = `${hero.name}$ succesfully escaped!`
            }
            msg.edit(txt, true)
            log(txt, true)
        }
    }
    catch {
        // if there is a problem, log it and inform the user
		log(err, true)
		let txt = `use the format ${exports.help.format}\n` + err
		msg.edit(txt)
    }
}