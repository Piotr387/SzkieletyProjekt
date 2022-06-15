const router = require("express").Router();
const UserService = require('../services/UserService')

const { verifyRoles, authenticate } = require('../middleware/authenticate')

const Joi = require('joi');
const User = require("../models/User");

//Open endpoints
//Refresh token endpoint
router.get('/token/refresh', (req, res) => {
    return UserService.getRefreshToken(req, res);
})


//Sign in to user account
router.post('/login', (req, res) => {
    const schema = Joi.object({
        login: Joi.string().required(),
        password: Joi.string().required()
    }).with('login', 'password')
    const result = schema.validate(req.body)
    if (result.error) {
        return res.status(400).send({ 'error_message': result.error.details[0].message })
    }
    return UserService.userLoginAuth(req, res)
})

//Unregistered user sign up for lecture
// {
//     "lectureName": "Lecture 1 at 12:00",
//     "userDTO" : {
//         "login":"test2",
//         "email":"test2@gmail.com"
//     }

// }
router.post('/sign-up', (req, res) => {
    return UserService.signUp(req, res);
})

//User Role endpoints
//List of all user's lecutres
router.get('/data', authenticate, verifyRoles('ROLE_USER'), (req, res) => {
    return UserService.getAllUserData(req, res)
})

router.get('/lectures', authenticate, verifyRoles('ROLE_USER'), (req, res) => {
    return UserService.getUserLecture(req, res)
})

//User account details
router.get('/account', authenticate, verifyRoles('ROLE_USER'), (req, res) => {
    return UserService.getUserAccountDetails(req, res)
})

//Registered user sign up for lecture
router.post('/sign-up-register', authenticate, verifyRoles('ROLE_USER'), (req, res) => {
    return UserService.signUpRegister(req, res);
})

//Cancel user reservation
router.delete('/cancel', authenticate, verifyRoles('ROLE_USER'), (req, res) => {
    return UserService.cancelReservation(req, res);
})

//Update email
router.put('/update-email', authenticate, verifyRoles('ROLE_USER','ROLE_ORGANIZER'), (req, res) => {
    return UserService.updateEmail(req, res);
})

//Organizer Role endpoints
//List of all users
router.get('/organizer', authenticate, verifyRoles('ROLE_ORGANIZER'), (req, res) => {
    UserService.getLecturesWithUsers(req,res);
})

module.exports = router;