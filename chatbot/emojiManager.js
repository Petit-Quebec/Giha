let client
const setClient = (bot) => {
  client = bot
}

const getEmojiByName = (emojiName) => {
  let searchRes = client.emojis.cache.find((emoji) => emoji.name === emojiName)
  if (!searchRes) throw `no emoji named ${emojiName}`
  return searchRes
}
export default { getEmojiByName, setClient }
