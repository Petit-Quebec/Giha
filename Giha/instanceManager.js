import Instance from '../db/Instance.js'
let instances = []

export const newInstance = () => {
  instances.forEach((instance) => {
    const collision = false
    if (collision)
      throw `Fool! you can't make an instance because of '${collision}'! with ${instance}`
  })

  let instance = new Instance()

  instances.push(instance)
  return instance
}

export const getinstances = () => {
  return instances
}

export const getinstanceById = (id) =>
  instances.find((instance) => instance.userDiscordId === id) || false

export const getinstanceByName = (name) =>
  instances.find((instance) => instance.name === name) || false
