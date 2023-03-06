require('dotenv').config()

const mongoose = require('mongoose')
const request = require('supertest')

const app = require('../../src/app')

const User = require('../../src/schemas/User')

const { requestMock } = require('../mocks/controllers-mocks')
const userDataMock = requestMock.body

describe('[E2E] User Service', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URL)
        await User.create(userDataMock)
    })

    afterAll(async () => {
        await User.deleteMany({})
        mongoose.connection.close()
    })
    
    it('Deve retornar 200 e um id se um usuário for criado', async () => {
        const res = await request(app).post('/user').send({
            name: userDataMock.name,
            email: userDataMock.email,
            password: userDataMock.password,
        })

        expect(res.status).toBe(200)
    })

    it('Deve retornar status 400 se não for passado um email válido como parametro', async () => {
        const res = await request(app).post('/user').send({
            name: userDataMock.name,
            email: "invalidMail@mail",
            password: userDataMock.password,

        })

        expect(res.status).toBe(400)
    })

    it('Deve retornar status 400 se a senha não for passada como parametro', async () => {
        const res = await request(app).post('/user').send({
            name: userDataMock.name,
            email: userDataMock.email,
        })

        expect(res.status).toBe(400)
    })

})