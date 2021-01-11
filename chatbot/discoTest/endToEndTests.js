import testBotManager from './testBotManager.js'
import { types } from 'util'
import botManager from '../botManager.js'
import { logBar } from '../../util/util.js'
import loadTestSuites from './loadTestSuites.js'

let mockTestSuites
let testSuites
let testReport = []

const testMonitor = async () => {
  // bring the bots online
  // bring a test discord bot online
  let testBotOnline = testBotManager.run()
  // bring the regular discord bot online
  let chatBotOnline = botManager.run()
  // load tests
  mockTestSuites = loadMockTestSuites()
  testSuites = mockTestSuites.concat(loadTestSuites())

  // wait for the bots to be online
  let testBotRes = await testBotOnline
  let testBot = testBotRes.bot
  let testEmoji = testBotRes.testEmoji

  let chatBot = await chatBotOnline
  // if so, log and move on to testing

  logBar(2, true)
  console.log('testbot and normal bot both up and running!')
  console.log('loading tests...')
  for (
    let testSuiteIndex = 0;
    testSuiteIndex < testSuites.length;
    testSuiteIndex++
  ) {
    console.log(`TestSuite ${testSuiteIndex + 1}`)
    let tests = testSuites[testSuiteIndex].tests
    for (let testIndex = 0; testIndex < tests.length; testIndex++) {
      let test = tests[testIndex]
      console.log(testSuites[testSuiteIndex])
      console.log(
        `running test ${testIndex + 1}/${
          testSuites[testSuiteIndex].tests.length
        }:`
      )

      let testPromise
      try {
        testPromise = test(chatBot, testBot, testEmoji)
        if (!types.isPromise(testPromise))
          throw 'end to end tests must return promises'
        await testPromise
        testReport.push({
          testSuite: testSuiteIndex,
          testNum: testIndex,
          result: 'pass',
        })
      } catch (err) {
        console.log(err)
        testReport.push({
          testSuite: testSuiteIndex,
          testNum: testIndex,
          result: 'fail',
          error: err,
        })
      }
    }
  }
  logBar(2, true)
  console.log('end to end testing complete')
  // get ready to wrap up
  // display test results
  console.log('test results:')
  logResults()
  botManager.shutdown()
  testBotManager.shutdown()
  console.log('shutting down...')
  process.exit()
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
      resultBlurb += `Test Suite ${resultSuiteIndex}/${testSuites.length}\n`
      // if the suite passed add 1 to passing suites, if not, reset teh variable
      suitePass ? passingSuites++ : (suitePass = true)
    }
    resultBlurb += ` Test #${test.testNum} `
    if (test.result == 'fail') {
      resultBlurb += '\x1b[30m\x1b[41mFAIL\x1b[0m\n'
      resultBlurb += '\x1b[31m  ERROR:\x1b[0m\n'
      console.log(resultBlurb)
      console.log(test.error)
      resultBlurb = ''
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
  resultBlurb += '\x1b[1mTests: '
  passingTests < testReport.length
    ? (resultBlurb += '\x1b[31m')
    : (resultBlurb += '\x1b[32m')
  resultBlurb += `${passingTests} passed,\x1b[0m ${testReport.length} total`
  console.log(resultBlurb)
}

const loadMockTestSuites = () => {
  let testSuites = []
  let tests = []
  const mockSuccessfulTest1 = () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(1), 1000)
    })
  }
  tests.push(mockSuccessfulTest1)

  const mockSuccessfulTest2 = () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(2), 500)
    })
  }
  tests.push(mockSuccessfulTest2)
  let testSuite = {
    suiteName: 'Mock Test Suite',
    tests: tests,
  }
  testSuites.push(testSuite)
  return testSuites
}

// begin Tests
try {
  testMonitor()
} catch (err) {
  console.log('the whole tester sucks okay??')
  console.log(err)
  process.exit()
}
