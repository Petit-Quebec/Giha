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
let testChannel

const testState = {
  startup: 0,
  booting: 1,
  testing: 2,
  switching: 3,
  wrapUp: 4,
}
// test suite state monitor
//  startup | initializing bots
//  booting | both bots are coming online, only a matter of time
//  testing | tests are actively being ran
//switching | switching from one test to the next
// wrapUp | tests are complete, bots are spinning down
let testStatus
let chatBot
let testBot

let numTestSuites
let testIndex = 0
let testSuiteIndex = 0
let testReport = []

const loadMockTestSuites = () => {
  let testSuites = []
  let tests = []
  const mockSuccessfulTest = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(1), 1000)
    })
  }
  tests.push(mockSuccessfulTest)
  const mockFailTest = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(2), 2000)
    })
  }
  tests.push(mockFailTest)
  let testSuite = {
    suiteName: 'Mock Test Suite',
    tests: tests,
    numTests: tests.length,
  }
  testSuites.push(testSuite)
  return testSuites
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
          testChannel = testBot.getTestChannel()
          // if so, log and move on to testing
          logBar(2, true)
          console.log('testbot and normal bot both up and running!')
          console.log('testChannel:')
          console.log(testChannel)
          console.log('beginning tests...')
          testStatus = testState.switching
        }
        break
      case testState.testing:
        // the transition from testing to switching occurs in the promise callback
        break
      case testState.switching:
        console.log(
          `running test${testIndex + 1}/${testSuites[testSuiteIndex].numTests}:`
        )
        // run the next test
        let nextTest = testSuites[testSuiteIndex].tests[testIndex] // next test function
        let testPromise = nextTest(chatbot, testBot) // next test promise passing the bots (testbot also comes with a test channel)
        console.log(nextTest)
        // make sure it is a promise
        if (!types.isPromise(testPromise))
          throw 'end to end tests must return promises'
        // switch state to testing until this test wraps up
        testStatus = testState.testing
        // add a callback to the promise for all completed testing code
        testPromise
          .then((res) => {
            // test successful!
            // add to testing report
            testReport.push({
              testSuite: testSuiteIndex,
              testNum: testIndex,
              result: 'pass',
            })
            resolveTest()
          })
          .catch((err) => {
            // test failed
            // add to testing report
            testReport.push({
              testSuite: testSuiteIndex,
              testNum: testIndex,
              result: 'fail',
              error: err,
            })
            resolveTest()
          })
        break
      case testState.wrapUp:
        logBar(2, true)
        console.log('end to end testing complete')
        // get ready to wrap up
        // display test results
        console.log('test results:')
        logResults()
        chatbot.shutdown()
        testBot.shutdown()
        clearInterval(intervalObj)
        testStatus = null
        console.log('shutting down...')
        process.exit()
        break // technically this never is called
      default:
        break
    }
  })
}

const resolveTest = () => {
  // increment testIndex
  testIndex++
  // check if that was the last test
  if (testIndex >= testSuites[testSuiteIndex].numTests) {
    // test suite is complete!
    // on to the next test suite
    testSuiteIndex++
    console.log(
      `testSuiteIndex: ${testSuiteIndex} numTestSuites: ${numTestSuites}`
    )
    // check to see if that was the last suite
    if (testSuiteIndex >= numTestSuites) {
      // testing is complete
      testStatus = testState.wrapUp
    } else {
      // testing is incomplete, reset testIndex for next test suite
      testStatus = testState.switching
      testIndex = 0
    }
  } else {
    // switch state to switching so that the next test can run
    testStatus = testState.switching
  }
  return true
}

const logResults = () => {
  let passingSuites = -1 // it gets incremented once in the beginning okay?
  let suitePass = true
  let passingTests = 0
  let resultBlurb = ''
  let resultSuiteIndex = 0
  testReport.forEach((test) => {
    if (test.testSuite + 1 > resultSuiteIndex) {
      resultSuiteIndex++
      resultBlurb += `Test Suite ${resultSuiteIndex}/${numTestSuites}\n`
      // if the suite passed add 1 to passing suites, if not, reset teh variable
      suitePass ? passingSuites++ : (suitePass = true)
    }
    resultBlurb += ` Test #${test.testNum} `
    if (test.result == 'fail') {
      resultBlurb += '\x1b[30m\x1b[41mFAIL\x1b[0m\n'
      resultBlurb += '\x1b[31m  ERROR:\x1b[0m\n'
      resultBlurb += test.error + '\n'
      suitePass = false
    } else {
      resultBlurb += '\x1b[30m\x1b[42mPASS\x1b[0m\n'
      passingTests++
    }
  })
  suitePass ? passingSuites++ : (suitePass = true)

  resultBlurb += '===================\n'
  resultBlurb += '\x1b[1mTest Suites: '
  passingSuites < resultSuiteIndex
    ? (resultBlurb += '\x1b[31m')
    : (resultBlurb += '\x1b[32m')
  resultBlurb += `${passingSuites} passed\x1b[0m, ${resultSuiteIndex} total\n`
  resultBlurb += `\x1b[1mTests: `
  passingTests < testReport.length
    ? (resultBlurb += '\x1b[31m')
    : (resultBlurb += '\x1b[32m')
  resultBlurb += `${passingTests} passed,\x1b[0m ${testReport.length} total`
  console.log(resultBlurb)
}

// load tests
const testSuites = loadMockTestSuites()
numTestSuites = testSuites.length
// begin state machine
testMonitor()
