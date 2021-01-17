let Monster = class Monster {
  constructor(name, health, speed, damage, attackName) {
    this.name = name
    this.health = health
    this.speed = speed
    this.damage = damage
    this.attackName = attackName
  }
}

let monsters = []

let theTragus = new Monster('Tragus Ultra', 34, 5, 30, 'Spacetime Enema')
let bun = new Monster('Diminunitive Bun', 3, 1, 2, 'Schnuzzle')

monsters.push(theTragus, bun)

export default monsters
