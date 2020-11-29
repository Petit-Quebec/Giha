const BAR_WIDTH = 50

const BAR_PLUS = '\x1b[36m' + '+'.repeat(BAR_WIDTH) + '\x1b[0m'
const BAR_SINGLE = '\x1b[36m' + '-'.repeat(BAR_WIDTH) + '\x1b[0m'
const BAR_DOUBLE = '\x1b[36m' + '='.repeat(BAR_WIDTH) + '\x1b[0m'

export const greenCheck = '\x1b[32m✓\x1b[0m'

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const log = (str, logToCLI) => {
  // write to file
  // write to verbose log channel in admin server
  if (logToCLI) {
    console.log(str)
    // write to nonverbose log channel in admin server
  }
}

export const logBar = (style, logToCLI) => {
  let str
  switch (style) {
    case 0:
      str = BAR_PLUS
      break
    case 1:
      str = BAR_SINGLE
      break
    case 2:
      str = BAR_DOUBLE
      break
    default:
      str = BAR_PLUS
      break
  }

  // write to file
  // write to log channel in admin server
  if (logToCLI) console.log(str)
  return str
}

// returns the symmetric difference between a number of collections as an arry
export const symDiff = (args) => {
  const sets = [],
    result = []
  // make copy of arguments into an array
  const argsCopy = Array.prototype.slice.call(args, 0)
  // put each array into a set for easy lookup
  argsCopy.forEach(function (coll) {
    sets.push(new Set(coll.array()))
  })
  // now see which elements in each array are unique
  // e.g. not contained in the other sets
  argsCopy.forEach(function (array, arrayIndex) {
    // iterate each item in the array
    array.forEach(function (item) {
      let found = false
      // iterate each set (use a plain for loop so it's easier to break)
      for (let setIndex = 0; setIndex < sets.length; setIndex++) {
        // skip the set from our own array
        if (setIndex !== arrayIndex) {
          if (sets[setIndex].has(item)) {
            // if the set has this item
            found = true
            break
          }
        }
      }
      if (!found) {
        result.push(item)
      }
    })
  })
  return result
}

export const name = (member) => {
  return member.nickname ? member.nickname : member.author.username
}

export const isCharacter = (obj) => {
  try {
    return obj.constructor.collection.name == 'characters'
  } catch (err) {
    return false
  }
}

export const isUser = (obj) => {
  try {
    return obj.constructor.collection.name == 'users'
  } catch (err) {
    return false
  }
}

// const asciiTable = (array) => {
//   // returns a neat string ascii table of the given array
// }
