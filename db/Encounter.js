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
	constructor(hero, id) {
		this.hero = hero
		this.id = id
		this.enemy = Math.random() > 0.8 ? theTragus : bun
		this.enemyHealth = this.enemy.health
		this.enemySpeed = this.enemy.speed
		this.enemyDamage = this.enemy.damage
		this.encounterActive = true
		this.playerExp = 0
		this.log = []
	}

	attack(dmg) {
		if (!this.encounterActive)
			throw 'The time for fighting has passed! This encounter is no longer active'
		let killedEnemy = false
		let died = false
		let enemyDamage = 0
		this.enemyHealth = this.enemyHealth - dmg
		this.playerExp += dmg
		if (this.enemyHealth < 1) {
			killedEnemy = true
			this.encounterActive = false
		}
		if (!killedEnemy) {
			let strikeChance = 1 / this.enemySpeed
			let enemyRoll = Math.random()
			if (enemyRoll <= strikeChance) {
				console.log('IT STRIKE!!!')
				enemyDamage = this.enemyDamage
				this.hero.stamina -= this.enemyDamage
				if (this.hero.stamina < 1) {
					died = true
					this.encounterActive = false
				}
			}
		}
		let result = {
			killedEnemy: killedEnemy,
			died: died,
			enemyDamage: enemyDamage,
			enemyAttackName: this.enemy.attackName,
			playerExp: this.playerExp,
		}
		return result
	}

	isActive() {
		return this.encounterActive
	}
}

let Turn = class Turn {
	constructor(actor, actions, targets, actionValues, effects) {
		this.actor 
		this.actions = []
		this.targets = []
		this.actionValues = []
		this.effects = []
	}
}

module.exports = Encounter
