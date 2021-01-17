import Encounter from './Encounter.js'
import encounterTypes from './Encounter.js'
/**
 * @class
 * @requires ./Encounter
 */
class FightingEncounter extends Encounter {
  /**
   *
   * @param {Monster} enemy
   */
  constructor(enemy) {
    super(encounterTypes.FIGHTING)
    this.enemy = enemy
  }
}
// Fighting encounter class
// extends encounter

/*
  constructor(hero, id) {
    this.hero = hero
    this.id = id
    this.enemy = Math.random() > 0.8 ? monsters[0] : monsters[1]
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

// let Turn = class Turn {
//   constructor(actor, actions, targets, actionValues, effects) {
//     this.actor
//     this.actions = []
//     this.targets = []
//     this.actionValues = []
//     this.effects = []
//   }
// }
*/

export default FightingEncounter
