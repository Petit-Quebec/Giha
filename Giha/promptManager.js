import Prompt from '../db/Prompt.js'
let activePrompts = []

const newPrompt = (
  channel,
  isReusable,
  responseActions,
  client,
  msgContent,
  msgOptions
) => {
  let prompt = new Prompt(
    channel,
    promptBehavior,
    responseActions,
    client,
    msgContent,
    msgOptions,
    reactCollectorOptions,
    reactCollectorTimeoutCallback
  )
  activePrompts.push(prompt)
  return prompt
}

const getPromptByMessage = (message) => {
  activePrompts.forEach((activePrompt) => {
    if (activePrompt.message === message) return activePrompt
  })
  return -1
}

const deletePrompt = (prompt) => {
  // remove from active Prompts
  activePrompts.splice(
    activePrompts.find((activePrompt) => {
      return activePrompt === prompt
    }),
    1
  )
  // have prompt clean itself up
  prompt.delete()
}

export { newPrompt, getPromptByMessage, deletePrompt }
