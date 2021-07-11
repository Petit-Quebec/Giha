import Instance from '../../db/Instance.js'
import { log } from '../../util/util.js'

const mushrooms = [
  {
    mushroomIndex: 0,
    species: 'Mageroof',
    quality: 3,
    rarity: 5,
    emoji: 'Mageroof_0',
  },
  {
    mushroomIndex: 1,
    species: 'Mageroof',
    quality: 2,
    rarity: 4,
    emoji: 'Mageroof_1',
  },
  {
    mushroomIndex: 2,
    species: 'Mageroof',
    emoji: 'Mageroof_2',
    quality: 2,
    rarity: 3,
  },
  {
    mushroomIndex: 3,
    species: 'Mageroof',
    quality: -10,
    rarity: 3,
    emoji: 'Mageroof_3',
  },
  {
    mushroomIndex: 4,
    species: 'Mageroof',
    emoji: 'Mageroof_4',
    quality: 3,
    rarity: 1,
  },
  {
    mushroomIndex: 5,
    species: 'Mageroof',
    quality: -5,
    rarity: 3,
    emoji: 'Mageroof_5',
  },
  {
    mushroomIndex: 6,
    species: 'Mageroof',
    quality: 4,
    rarity: 2,
    emoji: 'Mageroof_6',
  },
  {
    mushroomIndex: 7,
    species: 'Mageroof',
    quality: -7,
    rarity: 4,
    emoji: 'Mageroof_7',
  },
  {
    mushroomIndex: 8,
    species: 'Mageroof',
    quality: 1,
    rarity: 1,
    emoji: 'Mageroof_8',
  },
  {
    mushroomIndex: 9,
    species: 'Mageroof',
    quality: 5,
    rarity: 4,
    emoji: 'Mageroof_9',
  },
]
const mushroomRoller = []
mushrooms.forEach((mushroom) => {
  for (
    let mushroomPushIndex = 0;
    mushroomPushIndex < mushroom.rarity;
    mushroomPushIndex++
  ) {
    mushroomRoller.push(mushroom.mushroomIndex)
  }
})

let ShroomHunt = class ShroomHunt {
  constructor(numShrooms) {
    if (numShrooms > 20)
      throw 'Only 20 mushrooms can be in the same place at the same time!' // discord limitation
    log('time for a new shroomhunt')
    // get numShrooms random mushrooms
    this.mushrooms = []
    for (
      let mushroomGenerationIndex = 0;
      mushroomGenerationIndex < numShrooms;
      mushroomGenerationIndex++
    ) {
      this.mushrooms.push(randShroom())
    }
    this.score = 0
    this.complete = false
    this.parentInstance
  }

  burrow() {
    this.complete = true
  }

  pick(mushroom) {
    if (!mushroom.picked) {
      this.score += mushroom.quality
      mushroom.picked = true
      return mushroom.quality
    } else {
      return
    }
  }

  setParentInstance(instance) {
    if (!(instance instanceof Instance))
      throw `shroomHunting Error: parentInstance must be set to an Instance, not ${typeof instance}`
    this.parentInstance = instance
  }
}

const randShroom = () => {
  // get a random entry from the mushroom roller table, which is weighted by mushroom rarity
  let mushroomResultIndex =
    mushroomRoller[Math.floor(Math.random() * mushroomRoller.length)]
  let mushroomTemplate = mushrooms[mushroomResultIndex]
  let mushroom = {
    mushroomIndex: mushroomTemplate.mushroomIndex,
    species: mushroomTemplate.species,
    quality: mushroomTemplate.quality,
    rarity: mushroomTemplate.rarity,
    emoji: mushroomTemplate.emoji,
    picked: false,
  }
  return mushroom
}

export default ShroomHunt
