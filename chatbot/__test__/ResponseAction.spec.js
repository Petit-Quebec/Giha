import ResponseAction from '../ResponseAction.js'
import { Emoji } from 'discord.js'
describe('Giha class - ResponseAction', () => {
  let testTriggerType = 'emoji'
  let testEmoji = new Emoji('745071725826597562', {})
  let testCallback = jest.fn()
  it('should error when passed a bad triggerType', () => {
    let phonyTriggerType = 'stannis'
    expect(() => {
      new ResponseAction(phonyTriggerType, testEmoji, testCallback)
    }).toThrow(
      `ResponseAction Constructor Error: triggerType can be either 'emoji' or 'message', not '${phonyTriggerType}'`
    )
  })
  it('should error when passed a bad emoji', () => {
    let phonyTrigger =
      'Kono Yo no Kyūseishu Futarime no Rikudō Juubi Jinchuuriki Gedou Rinne Tensei Uchiha Madara with the Eternal Mangekyou Sharingan (which is capable of Enton Amaterasu, Izanagi, Izanami and the Tsyukuyomi Genjutsu), his two original Rinnegan (which grant him Chikushōdō, Shuradō, Tendō, Ningendō, Jigokudō, Gakidō, Gedō, Banshō Ten’in, Chibaku Tensei, Shinra Tensei, Tengai Shinsei and Banbutsu Sōzō) and a third Tomoe Rinnegan on his forehead, capable of using Katon, Fūton, Raiton, Doton, Suiton, Mokuton, Ranton, Inton, Yōton and even Onmyōton Jutsu, equipped with his Gunbai(capable of using Uchihagaeshi) and a Shakujō because he is a master in kenjutsu and taijutsu, a perfect Susano’o (that can use Yasaka no Magatama ), control of both the Juubi and the Gedou Mazou, with Hashirama Senju’s DNA and face implanted on his chest, his four Rinbo Hengoku Clones guarding him and nine Gudōdama floating behind him AFTER he absorbed Senjutsu from the First Hokage, entered Rikudō Senjutsu Mode, cast Mugen Tsukuyomi on everybody and used Shin: Jukai Kōtan so he can use their Chakra while they are under Genjutsu.'
    expect(() => {
      new ResponseAction(testTriggerType, phonyTrigger, testCallback)
    }).toThrow(
      `ResponseAction Constructor Error: emoji trigger must be an instance of a custom Discord Emoji, not '${typeof phonyTrigger}'`
    )
  })
  it('should error when passed a bad callback', () => {
    let phonyCallback =
      "Legendary Super Saiyan 4 Uchiha Madara with the Eternal Mangekyou Sharingan, Rinnegan, Mystic Eyes of Death Perception, and Geass doujutsus, equipped with his Shining Trapezohedron while casting Super Tengen Toppa Gurren Lagann as his Susanoo, controlling the Gold Experience Requiem stand, having become the original vampire after having absorbed Alucard as well as a God Hand, able to tap into the speedforce, wearing the Kamen Rider Black RX suit, with Kryptonian DNA implanted in him and having eaten Popeye's spinach while possessing quantum powers like Dr. Manhattan and having mastered Hokuto Shinken."
    expect(() => {
      new ResponseAction(testTriggerType, testEmoji, phonyCallback)
    }).toThrow(
      `ResponseAction Constructor Error: action must be a callback function, not ${typeof phonyCallback}`
    )
  })
  it('should correctly construct a new instance when given good arguments', () => {
    let testResponseAction = new ResponseAction(
      'emoji',
      testEmoji,
      testCallback
    )
    expect(testResponseAction).toHaveProperty('triggerType', testTriggerType)
    expect(testResponseAction).toHaveProperty('trigger', testEmoji)
    expect(testResponseAction).toHaveProperty('action', testCallback)
  })
  it('should invoke the callback when told to act', () => {
    let testResponseAction = new ResponseAction(
      'emoji',
      testEmoji,
      testCallback
    )
    testResponseAction.act()
    expect(testCallback).toHaveBeenCalled()
  })
})
