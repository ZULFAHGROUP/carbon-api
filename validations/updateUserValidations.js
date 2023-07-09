const joi = require('joi')


const validateUpdateUser = (data) => {
    const updateUserSchema = joi.object({
        surname: joi.string(),
        othernames: joi.string(),
        dob: joi.date().string(),
        gender: joi.string(),
        address_number: joi.string(),
        address_street: joi.string(),
        address_city: joi.string(),
        address_state: joi.string(),
        localgovt: joi.string(),
        state_of_origin: joi.string(),
        marital_status: joi.string(),
        nextofkin_fullname: joi.string(),
        nextofkin_relationship: joi.string(),
        nextofkin_address: joi.string(),
        nextofkin_phone: joi.string(),
    })
    return updateUserSchema.validate(data)
}

module.exports = validateUpdateUser