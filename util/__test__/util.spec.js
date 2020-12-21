import { enableLog, log } from '../util.js'
describe('util', () => {
  it('should not log to console without the console log on', () => {
    const logMsg = 'hello hello this is a test log'
    const consoleSpy = jest.spyOn(console, 'log')
    log(logMsg)
    expect(consoleSpy).not.toHaveBeenCalledWith(logMsg)
  })

  it('should log to console with the console log on', () => {
    enableLog()
    const logMsg = 'hello hello this is a test log'
    const consoleSpy = jest.spyOn(console, 'log')
    log(logMsg)
    expect(consoleSpy).toHaveBeenCalledWith(logMsg)
  })
})
