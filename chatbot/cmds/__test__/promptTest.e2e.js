import Prompt from '../../Prompt.js'
import ResponseAction from '../../ResponseAction.js'
import testBot from '../../discoTest/testBot.js'
import chatBot from '../../botserver.js'

let callback = () => {
  callBackCalled = true
  return
}
let callBackCalled = false

let test = () => {
  return new Promise((resolve, reject) => {
    let channel = testBot.getTestChannel()
    let isReusable = true
    let responseActions
    let client = chatBot.bot
    let msgContent = 'this is a test message'
    let msgOptions = {}

    let testEmoji = testBot
      .getTestEmoji()
      .then((res) => {
        console.log(res)
        // make a new responseActrion

        responseActions = new ResponseAction('emoji', res, callback)
        // make a new prompt
        let testPrompt = new Prompt(
          channel,
          isReusable,
          responseActions,
          client,
          msgContent,
          msgOptions
        )
      })
      .catch((err) => {
        console.log(err)
        reject(err)
      })

    // testPrompt.message.
    // then have the test bot react to it
    // then make sure that the propper function is called
    reject()
  })
}

let PromptTestSuite = {
  suiteName: 'Prompt TestSuite',
  tests: [test],
  numTests: 1,
}

export default PromptTestSuite
