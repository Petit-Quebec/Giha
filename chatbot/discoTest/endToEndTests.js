import testBot from './testBot.js'
import { types } from 'util'
import chatbot from './../botserver.js'
import { logBar } from '../../util/util.js'
/*
var normalizedPath = require('path').join(__dirname, 'routes')

require('fs')
  .readdirSync(normalizedPath)
  .forEach(function (file) {
    require('./routes/' + file)
  })
  */
const testState = {
  startup: 0,
  booting: 1,
  testing: 2,
  switching: 3,
  shutdown: 4,
}
// test suite state monitor
//  startup | initializing bots
//  booting | both bots are coming online, only a matter of time
//  testing | tests are actively being ran
//switching | switching from one test to the next
// shutdown | tests are complete, bots are spinning down
let testStatus

let numTests
let testIndex = 0
let testReport = ''

const loadTests = () => {
  let tests = []
  const mockTest1 = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(1), 1000)
    })
  }
  tests.push(mockTest1)
  const mockTest2 = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(2), 2000)
    })
  }
  tests.push(mockTest2)
  return tests
}

const testMonitor = () => {
  testStatus = testState.startup

  const intervalObj = setInterval(() => {
    switch (testStatus) {
      case testState.startup:
        // bring the bots online
        // bring a test discord bot online
        testBot.run()
        // bring the regular discord bot online
        chatbot.run()
        // bots are now booting
        testStatus = testState.booting
        break
      case testState.booting:
        // check to see if bots are ready
        if (chatbot.isReady() && testBot.isReady()) {
          // if so, log and move on to testing
          logBar(2, true)
          console.log('testbot and normal bot both up and running!')
          console.log('beginning tests...')
          testStatus = testState.switching
        }
        break
      case testState.testing:
        // the transition from testing to switching occurs in the promise callback
        break
      case testState.switching:
        console.log(`running test${testIndex + 1}/${numTests}:`)
        // run the next test
        let nextTest = tests[testIndex] // next test function
        let testPromise = nextTest() // next test promise
        console.log(nextTest)
        // make sure it is a promise
        if (!types.isPromise(testPromise))
          throw 'end to end tests must return promises'
        // switch state to testing until this test wraps up
        testStatus = testState.testing
        // add a callback to the promise for all completed testing code
        testPromise.then((res) => {
          // add to testing report
          testReport += res
          // increment testIndex
          testIndex++
          // check if that was the last test
          if (testIndex >= numTests) {
            // testing is complete!
            logBar(2, true)
            console.log('end to end testing complete')
            // get ready to wrap up
            // display test results
            console.log('test results:\n\n')
            testStatus = testState.shutdown
          } else {
            // switch state to switching so that the next test can run
            testStatus = testState.switching
          }
        })
        break
      case testState.shutdown:
        console.log('shutting down...')
        chatbot.shutdown()
        testBot.shutdown()
        clearInterval(intervalObj)
        testStatus = null
        process.exit()
        break
      default:
        break
    }
  })
}

// load tests
const tests = loadTests()
numTests = tests.length
// begin state machine
testMonitor()
