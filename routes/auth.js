const express = require('express')
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
//const {registerValidation} = require('../validation');



// VALIDATION
const Joi = require('joi');


// Register Validation
const RegisterSchema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});


router.post('/user', async (req, res)=>{

    // VALIDATION BEFORE SAVE
    try {
        const {error} = await RegisterSchema.validateAsync(req.body);
        if (error) return res.status(400).send(error.details[1].message);
        //res.send(error.details[0].message);
    } catch(err){
        res.status(400).send(err)
    }

    // CHECK IF USER IS IN DB
    const ExsistingEmail = await User.findOne({email: req.body.email});
    if (ExsistingEmail) return res.status(400).send('Email already exsists');

    // PASSWORD HASH sol
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);


    // moze kiedys ogarne czemu to nie dziala
    // const {error} = await registerValidation(req.body);
    // if (error) return res.status(400).send(error.details[0]["details"].message);

    // crete a new user if its possible
    const user = new User( {
        name: req.body.name,
        email: req.body.email,
        password: hashedPass
    });
    try {
        const newUser = await user.save();
        res.send({user: newUser.id});

    } catch(err) {
        res.status(400).send(err);
    }
});

const LoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

// LOGIN
router.post('/auth-token', async (req, res)=>{

    // VALIDATION
    try {
        const {error} = await LoginSchema.validateAsync(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        //res.send(error.details[0].message);
    } catch(err){
        res.status(400).send(err)
    }

    // CHECKING IF USER IS IN DB
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Email or password are invalid');

    // CHECKING PASSWORD
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(40).send('Email or password are invalid');


    // CREATING SIGNED TOKEN
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
    res.cookie('auth-token',token,{
       httpOnly: true
    });
    res.redirect(302,'http://localhost:8080/');


});



module.exports = router;
