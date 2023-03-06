require('dotenv').config()

const mongoose = require('mongoose')
const request = require('supertest')

const app = require('../../src/app')

const User = require('../../src/schemas/User')

const { requestMock } = require('../mocks/controllers-mocks')
const userDataMock = requestMock.body

describe('[E2E] Session Service', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URL)
        await User.create(userDataMock)
    })

    afterAll(async () => {
        await User.deleteMany({})
        mongoose.connection.close()
    })
    
    it('Should return 200 if session is created', async () => {
        const res = await request(app).post('/session').send({
            email: userDataMock.email,
            password: userDataMock.password,
        })

        expect(res.status).toBe(200)
    })

    it('Should return 400 if password does not match', async () => {
        const res = await request(app).post('/session').send({
            email: userDataMock.email,
            password: 'any_password',
        })

        expect(res.status).toBe(400)
    })

    it('Should return 400 if email is not provided', async () => {
        const res = await request(app).post('/session').send({
            password: userDataMock.password,
        })

        expect(res.status).toBe(400)
    })

    it('Should return 404 if user does not exists', async () => {
        const res = await request(app).post('/session').send({
            email: 'any_user@mail.com',
            password: userDataMock.password,
        })

        expect(res.status).toBe(404)
    })
})