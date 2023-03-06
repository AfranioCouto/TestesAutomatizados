require('dotenv').config()
const mongoose = require('mongoose')
const { faker } = require('@faker-js/faker')

const User = require('../../../src/schemas/User')
const UserController = require('../../../src/controllers/user-ctrl')
const UserService = require('../../../src/services/user-service')
const { requestMock, requestMockByParam, responseMock } = require('../../mocks/controllers-mocks')

const userDataMock = requestMock.body


describe('[Integration] User Service', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URL)
        await User.create(userDataMock)
    })
    
    afterAll(async () => {
        await User.deleteMany({})
        mongoose.connection.close()
    })
    
    it('Deve retornar 200 e um id se um usuário for criado', async () => {
        const res = await UserController.create(requestMock, responseMock)
        expect(res.status).toBe(200)
        expect(res.data).toHaveProperty('id')
    })

    it('Deve retornar status 400 se não for passado um email válido como parametro', async () => {
        const res = await UserController.create(requestMockByParam({
            name: faker.name.fullName(),
            email: "invalidMail@mail",
            password: faker.internet.password()
        }), responseMock)

        expect(res.status).toBe(400)
        expect(res.data).toBe('Email inválido')
    })

    it('Deve retornar status 400 se a senha não for passada como parametro', async () => {
        const res = await UserController.create(requestMockByParam({
            name: faker.name.fullName(),
            email: faker.internet.email(),
        }), responseMock)

        expect(res.status).toBe(400)
        expect(res.data).toBe('Senha inválida')
    })

    it('Deve retornar 500 se houver um erro no serviço UserService.createUser na criação do usuário no banco de dados', async () => {
        jest.spyOn(UserService, 'createUser').mockImplementationOnce(() => {
            throw new Error()
        })
        
        const res = await UserController.create(requestMock, responseMock)

        expect(res.status).toBe(500)
        expect(res.data).toBe('Server Error')
    })
})