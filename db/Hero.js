let skillLevelExpThresholds = [10, 20, 30, 40, 50]

let Hero = class Hero {
	constructor(userDiscordId, heroName) {
		this.createdAt = new Date()
		this.userDiscordId = userDiscordId
		this.name = heroName.charAt(0).toUpperCase() + heroName.slice(1)
		this.stamina = 10
		this.exp = 0 // how much exp you have to spend on skills
		this.class = 'Spelunker'
		this.abilities = [
			{
				name: 'Pick',
				exp: 0,
				lvl: 1,
			},
			{
				name: 'Axe',
				exp: 0,
				lvl: 1,
				damage: 1,
			},
			{
				name: 'Hardy',
				exp: 0,
				lvl: 1,
				staminaMax: 10,
			},
		]
	}

	statsBlob() {
		let txt = '```ml\n'
		txt += `${this.name} is a proud ${this.class} `
		txt += `of level ${this.getLevel()}\n`
		txt += `Stamina: ${this.stamina}/${this.getMaxStamina()}\n`
		txt += `Abilities: \n`
		this.abilities.forEach((ability) => {
			txt += `|lv ${ability.lvl}  ${ability.name}\n`
			txt += `|  xp: ${ability.exp}/${
				skillLevelExpThresholds[ability.lvl - 1]
			}\n`
		})
		txt += `|exp to spend : ${this.exp}\n\n`
		txt += `made at ${this.createdAt.toDateString()}\n`
		txt += `owner id ${this.userDiscordId}\n`
		txt += '```'
		return txt
	}

	getMaxStamina() {
		let maxStamina
		this.abilities.forEach((ability) => {
			if (ability.name == 'Hardy') maxStamina = ability.staminaMax
		})
		return maxStamina
	}

	grantExp(exp) {
		this.exp += exp
		return this.exp
	}

	levelSkill(exp, skillName) {
		// this definitely doesntg work because now abilities are stored in an array instead of a weird dumb object
		// pretty sure this breaks if they level multiple times in one command
		if (this.exp < 1) throw `you have no exp to level a skill`
		if (exp < 1 || exp > this.exp) {
			throw `invalid exp entered, you must enter a value between 1 and ${this.exp}`
			return false
		}
		let res = {
			timesLeveled: 0,
			expToLevel: 0,
		}
		if (this.abilities[skillName]) {
			this.abilities[skillName].exp += exp
			this.exp -= exp
			let lvlThreshold =
				skillLevelExpThresholds[this.abilities[skillName].lvl - 1]
			if (this.abilities[skillName].exp > lvlThreshold) {
				// level up!
				this.abilities[skillName].exp -= lvlThreshold
				this.abilities[skillName].lvl += 1
				res.timesLeveled++
			}
			lvlThreshold =
				skillLevelExpThresholds[this.abilities[skillName].lvl - 1]
			res.expToLevel = lvlThreshold - this.abilities[skillName].exp
			return res
		} else throw `you have no skill named ${skillName}`
	}

	getLevel() {
		let lvl = 1
		this.abilities.forEach((ability) => {
			lvl += ability.lvl
			lvl--
		})
		return lvl
	}

	increaseStamina() {
		let maxStamina = this.getMaxStamina()
		if(this.stamina<maxStamina) {
			return this.stamina++
		}
		else {
			return this.stamina
		}
	}
}

module.exports = Hero
