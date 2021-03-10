// VALIDATION
const Joi = require('joi');


// Register Validation
const registerValidation = (data) =>{
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    schema.validateAsync(data);

};


// login Validation
const loginValidation = (data) =>{
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    schema.validate(data);
};





module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;