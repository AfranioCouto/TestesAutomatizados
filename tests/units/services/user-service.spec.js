const UserService = require('../../../src/services/user-service')
const User = require('../../../src/schemas/User')

const createdUserMock = () => ({ id: 1 })


describe('User Service', () => {
    it('Deve retornar um ID para usuários criados', async () => {
        jest.spyOn(User, 'create').mockImplementationOnce(createdUserMock)
        
        const created = await UserService.createUser({
            email: 'any_email@mail.com',
            name: 'Any Name',
            password: '123456'
        })

        expect(created).toHaveProperty('id')
    })
})