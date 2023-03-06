const { faker } = require('@faker-js/faker')

const requestMock = {
    body: {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password()
    }
}

const requestMockByParam = (data) => {
    return  {
        body: data
    }
}

const requestMockWithoutPassword = {
    body: {
        name: faker.name.fullName(),
        email: faker.internet.email(),
    }
}

const requestMockWithoutEmail = {
    body: {
        name: faker.name.fullName(),
        password: faker.internet.password()
    }
}

const responseMock = {
    status: (statusCode) => {
        return {
            json: (response) => {
                return {
                    status: statusCode,
                    data: response
                }
            }
        }
    }
}


module.exports = {
    responseMock,
    requestMock,
    requestMockWithoutEmail,
    requestMockWithoutPassword,
    requestMockByParam
}