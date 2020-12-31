import PromptTestSuite from '../cmds/__test__/promptTest.e2e.js'
const loadTestSuites = () => {
  let testSuites = []
  testSuites.push(PromptTestSuite)
  return testSuites
}
export default loadTestSuites
