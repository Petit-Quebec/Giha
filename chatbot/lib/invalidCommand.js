const DELAY_MS = 5000

export default async (msg) => {
  let response = await msg.channel.send(
    `\`${msg.content}\` is not a valid command\nFor help type !help`
  )
  response.delete(DELAY_MS)
  return true
}
