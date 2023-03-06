const Email = require('../../../src/utils/email-validator')

describe('Email Validator', () => {
    it('Should return true if a valid email is provided', () => {
        const isValid = Email.isValid('any_email@adatech.com')

        expect(isValid).toBe(true)
    })

    it('Should return false if an invalid email is provided', () => {
        const isValid = Email.isValid('any_emailadatech.com')

        expect(isValid).toBe(false)
    })

    it('Should return false if an invalid email without domain is provided', () => {
        const isValid = Email.isValid('any_emailad@atech')

        expect(isValid).toBe(false)
    })
})