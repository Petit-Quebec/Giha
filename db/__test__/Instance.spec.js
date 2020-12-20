import Instance from '../Instance.js'
import Hero from '../Hero.js'
describe( 'Giha class - Instance', () =>
{
    it( 'should initialize an Instance when called', () =>
    {
        let testInstance = new Instance
        expect(testInstance).toBeInstanceOf(Instance)
        expect(testInstance).toHaveProperty('party',[])
        expect(testInstance).toHaveProperty('map')
        expect(testInstance).toHaveProperty('partyCoordinates')
    } )
    
    it( 'should accept a Hero as a new party member', () =>
    {
        let testHero = new Hero( null, 'Dennis Deluxe' )
        let testInstance = new Instance
        let pLength = testInstance.addPartyMember(testHero)
        expect( testInstance ).toHaveProperty( 'party', [ testHero ] )
        expect(pLength).toBe(1)
    })
    it( 'should reject non-heros as a new party member', () =>
    {
        let testInstance = new Instance
        
        expect( () => { testInstance.addPartyMember( 'Naruto' ) }).toThrow('addPartyMember needs an object of instance Hero')
    })
})