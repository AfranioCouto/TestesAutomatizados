const SessionService = require('../../../src/services/session-service')
const jwt = require('jsonwebtoken')

const signMock = () => ({ token: 1 })


describe('Session Service', () => {
    it('Deve retornar um TOKEN se uma sessão for criada', async () => {
        jest.spyOn(jwt, 'sign').mockImplementationOnce(signMock)
        
        const created = await SessionService.generateToken({
            email: 'any_email@mail.com'
        })

        expect(created).toHaveProperty('token')
    })
})