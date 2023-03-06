const { faker } = require('@faker-js/faker')
const SessionController = require("../../../src/controllers/session-ctrl")
const SessionService = require('../../../src/services/session-service')
const UserService = require('../../../src/services/user-service')

const {
    requestMock, 
    requestMockWithoutEmail, 
    requestMockWithoutPassword, 
    requestMockByParam,
    responseMock
} = require('../../mocks/controllers-mocks')

const userDataMock = requestMock.body

const UserServiceMock = class UserServiceMock {
    static async userExistsAndCheckPassword() {
        return true
    }
}

const SessionServiceMock = class SessionServiceMock {
    static async generateToken() {
        return { token: 1 }
    }
}


describe('Session Controller', () => {
    it('Deve retornar um TOKEN se uma sessão for criada', async () => {
        jest.spyOn(UserService, 'userExistsAndCheckPassword').mockImplementationOnce(UserServiceMock.userExistsAndCheckPassword)
        jest.spyOn(SessionService, 'generateToken').mockImplementationOnce(SessionServiceMock.generateToken)

        const res = await SessionController.create(requestMock, responseMock)
        expect(res.data).toHaveProperty('token')
    })

    it('Deve retornar status 400 se a senha não for passada como parametro', async () => {
        const res = await SessionController.create(requestMockWithoutPassword, responseMock)
       
        expect(res.status).toBe(400)
    })

    it('Deve retornar status 400 se o email não for passado como parametro', async () => {
        const res = await SessionController.create(requestMockWithoutEmail, responseMock)
       
        expect(res.status).toBe(400)
    })

    it('Deve retornar status 404 se o Usuário não for encontrado', async () => {
        jest.spyOn(UserService, 'userExistsAndCheckPassword').mockImplementationOnce(() => {
            return false
        })
        
        const res = await SessionController.create(requestMockByParam({
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }), responseMock)

        expect(res.status).toBe(404)
        expect(res.data).toBe('Usuário não encontrado')
    })

    it('Deve retornar status 400 se as senhas não batem', async () => {
        jest.spyOn(UserService, 'userExistsAndCheckPassword').mockImplementationOnce(() => {
            throw { status: 400, message: 'As senhas não batem' }
        })
        
        const res = await SessionController.create(requestMockByParam({
            name: userDataMock.name,
            email: userDataMock.email,
            password: faker.internet.password()
        }), responseMock)

        expect(res.status).toBe(400)
        expect(res.data).toBe('As senhas não batem')
    })

    it('Deve retornar 500 se houver um erro na geração do token e a sessão não for criada', async () => {
        jest.spyOn(UserService, 'userExistsAndCheckPassword').mockImplementationOnce(UserServiceMock.userExistsAndCheckPassword)
        jest.spyOn(SessionService, 'generateToken').mockImplementationOnce(() => {
            throw new Error()
        })

        const res = await SessionController.create(requestMock, responseMock)

        expect(res.status).toBe(500)
        expect(res.data).toBe('Server Error')
    })

})