import promptTestSuite from '../cmds/__test__/promptTest.e2e.js'
import riseTestSuite from '../cmds/__test__/riseTest.e2e.js'
const loadTestSuites = () => {
  let testSuites = []
  testSuites.push(promptTestSuite)
  testSuites.push(riseTestSuite)
  return testSuites
}
export default loadTestSuites
