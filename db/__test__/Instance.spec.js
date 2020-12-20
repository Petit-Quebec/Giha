import Instance from '../Instance.js'
describe( 'Giha class - Instance', () =>
{
    it( 'should initialize an Instance when called', () =>
    {
        let testInstance = new Instance
        expect(testInstance).toBeInstanceOf(Instance)
    })
})