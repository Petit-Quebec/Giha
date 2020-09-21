let Monster = class Monster {
	constructor(name, health, speed, damage, attackName) {
		this.name = name
		this.health = health
		this.speed = speed
		this.damage = damage
		this.attackName = attackName
	}
}
let theTragus = new Monster('Tragus Ultra', 34, 5, 30, 'Spacetime Enema')
let bun = new Monster('Diminunitive Bun', 3, 1, 2, 'Schnuzzle')

let Encounter = class Encounter {
	constructor(heroName) {
		this.hero = heroName
		this.monster = Math.random() > 0.8 ? theTragus : bun
		this.playerHealth = 40
		this.enemyHealth = this.monster.health
		this.enemySpeed = this.monster.speed
		this.enemyDamage = this.monster.damage
		this.encounterActive = true
	}

	attack(dmg) {
		if (!this.encounterActive)
			throw 'The time for fighting has passed! This encounter is no longer active'
		let killedEnemy = false
		let died = false
		let enemyAttack = 0
		this.enemyHealth = this.enemyHealth - dmg
		if (this.enemyHealth < 1) {
			killedEnemy = true
			this.encounterActive = false
		}
		if (!killedEnemy) {
			let strikeChance = 1 / this.enemySpeed
			let enemyRoll = Math.random()
			if (enemyRoll <= strikeChance) {
				enemyAttack = this.enemyDamage
				this.playerHealth -= this.enemyDamage
				if (this.playerHealth < 1) {
					died = true
				}
			}
		}
		let result = {
			killedEnemy: killedEnemy,
			died: died,
			enemyAttack: enemyAttack,
		}
		return result
	}

	isActive() {
		return this.encounterActive
	}
}

module.exports = Encounter
