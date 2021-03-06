//Prompt.js describes the Prompt Class
// Prompts are questions to users, when the users take action, the prompt proceeds to do stuff based on logic.

class Prompt {
  constructor() {
    // message is the message that is sent
    // channel is where the message is to be sent
    // event specifies some conditions on how the message can be responded to
    // validators specify what valid user responses are for the given prompt
    // callback is what to do when the message is responded to in a valid way
  }

  static test() {
    new Prompt('How do you like me know?')
  }
}

module.exports = Prompt
