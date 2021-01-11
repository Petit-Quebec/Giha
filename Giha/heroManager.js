import Hero from '../db/Hero.js'
let heroes = []

export const newHero = (discordId, heroName) => {
  heroes.forEach((hero) => {
    if (hero.name.equalsIgnoreCase(heroName))
      throw `Fool! There is already a hero named '${
        hero.name
      }'! They are a proud ${hero.class} of level ${hero.getLevel()}`
  })

  let hero = new Hero(discordId, heroName)
  heroes.push(hero)
  return hero
}

export const getHeroes = () => {
  return heroes
}

export const getHeroById = (id) =>
  heroes.find((hero) => hero.userDiscordId === id) || false

export const getHeroByName = (name) =>
  heroes.find((hero) => hero.name === name) || false

String.prototype.equalsIgnoreCase = function (compareString) {
  let thisUpper = this.toUpperCase()
  let compareUpper = compareString.toUpperCase()
  return thisUpper === compareUpper
}
