const jwt = require('jsonwebtoken')
const Lecture = require("../models/Lecture");
const User = require("../models/User");
const Role = require('../models/Role')
const UserLecture = require('../models/UserLecture')
const TokenService = require("./TokenService");
const bcrypt = require("bcrypt");
const { CONSTANTS } = require('../constant/CONSTATNS');

const getRefreshToken = async (req, res) => {
    TokenService.getNewAccessTokenFromRefreshToken(req, res)
}

const userLoginAuth = async (req, res) => {
    const loginData = {
        login: req.body.login,
        password: req.body.password
    }

    //const testing = await User.query().where('login', 'username1').withGraphFetched('roles')
    const findLoginAndGetPassword = await User.knex().raw(`SELECT A.*, GROUP_CONCAT(C.name) AS roles FROM users A JOIN users_roles B ON A.id = B.user_id JOIN role_entity C ON B.role_id = C.id GROUP BY A.id HAVING A.login = '${loginData.login}' `)

    if (findLoginAndGetPassword[0].length > 1) {
        return res.status(401).send({ 'error_message': CONSTANTS.MORE_USER_WITH_SAME_LOGIN })
    }

    if (findLoginAndGetPassword[0].length === 0) {
        return res.status(401).send({ 'error_message': CONSTANTS.INVALID_PASSWORD_OR_LOGIN })
    }
    const foundAccount = findLoginAndGetPassword[0][0]

    const validPassword = await bcrypt.compare(loginData.password, foundAccount.encrypted_password)
    if (!validPassword) {
        return res.status(401).send({ 'error_message': CONSTANTS.INVALID_PASSWORD_OR_LOGIN })
    }

    foundAccount.roles = foundAccount.roles.split(',')

    res.send({
        'access_token': TokenService.generateAccessToken(foundAccount.login, foundAccount.roles),
        'refresh_token': TokenService.generateRefreshToken(foundAccount.login, foundAccount.roles)
    });
}

const signUp = async (req, res) => {
    if (!req.body.userDTO.password) {
        req.body.userDTO.password = '123'
    }
    const newUser = {
        "lectureName": req.body.lectureName,
        "userDTO": {
            "login": req.body.userDTO.login,
            "email": req.body.userDTO.email,
            "password": req.body.userDTO.password
        }
    }
    const FoundUser = await User.query().where('login', newUser.userDTO.login)

    if (FoundUser.length != 0) {
        if (FoundUser[0].login === newUser.userDTO.login && FoundUser[0].email !== newUser.userDTO.email)
            return res.status(500).send({ "status": 500, "error": "Internal Server Error", "message":CONSTANTS.LOGIN_TAKEN })
        if (FoundUser[0].login !== newUser.userDTO.login && FoundUser[0].email == newUser.userDTO.email)
            return res.status(500).send({ "status": 500, "error": "Internal Server Error", "message": CONSTANTS.EMAIL_TAKEN })
        return res.status(500).send({ "status": 500, "error": "Internal Server Error", "message": CONSTANTS.ALREADY_SIGN_IN })
    }

    const trx = await Lecture.startTransaction();
    try {
        const addUserToLecture = await (await Lecture.query().findOne('name', '=', newUser.lectureName)).$fetchGraph('users')
        console.log()
        if (addUserToLecture.users.length >= 5) {
            return res.status(500).send({ "status": 500, "error": "Internal Server Error", "message": CONSTANTS.NO_FREE_SEATS })
        }
        const insertedUser = await User.query().insert({
            "email": newUser.userDTO.email,
            "login": newUser.userDTO.login,
            "encrypted_password": await bcrypt.hash(newUser.userDTO.password, 10)
        })

        await addUserToLecture.$relatedQuery('users').relate(insertedUser)
        await insertedUser.$relatedQuery('roles').relate(await Role.query().findOne('name', '=', 'ROLE_USER'))
        await trx.commit();
    } catch (err) {
        await trx.rollback();
        res.send(err)
    }
    res.send({
        "operationResult": "SUCCESS",
        "message": CONSTANTS.NEW_USER,
        "status": 200,
    })

}

const getUserLecture = async (req, res) => {
    const login = TokenService.getLoginFromToken(req, res)
    const user = await User.query().findOne('login', '=', login).withGraphFetched('lectures')
    const lectures = user.lectures.map(e => {
        return {
            "name": e.name,
            "thematicPath": e.thematic_path,
            "startTime": e.start_time
        }
    })
    res.send(lectures);
}

const getUserAccountDetails = async (req, res) => {
    const login = TokenService.getLoginFromToken(req, res)
    const query = await User.query().findOne('login', '=', login).withGraphFetched('lectures')
    res.send({
        "login": query.login,
        "email": query.email
    });
}

const signUpRegister = async (req, res) => {
    const login = TokenService.getLoginFromToken(req, res)
    const user = await User.query().findOne('login', '=', login).withGraphFetched('lectures')
    if (user === null)
        return res.status(400).send({ "status": 400, "message": CONSTANTS.NO_USER_WITH_LOGIN })
    const lectureName = req.body.lectureName;

    const lecture = await (await Lecture.query().findOne('name', '=', lectureName)).$fetchGraph('users')

    if (lecture.users.length >= 5) {
        return res.status(500).send({ "status": 500, "error": "Internal Server Error", "message": CONSTANTS.NO_FREE_SEATS })
    }

    const arrWithBusyTime = user.lectures.map(a => a.start_time)

    if (arrWithBusyTime.includes(lecture.start_time))
        return res.status(400).send({ 'error_message': CONSTANTS.USER_ALREADY_BUSY_AT_THIS_TIME })

    const trx = await User.startTransaction();
    try {
        await (await User.query().findOne('login', '=', login)).$relatedQuery('lectures').relate(lecture)
        //lecture.$relatedQuery('users').relate(user)
        await trx.commit();
    } catch (err) {
        await trx.rollback();
        res.send(err)
    }

    res.send({
        "operationResult": "SUCCESS",
        "message": CONSTANTS.SUCCESS_LECTURES_SIGN_IN,
        "status": 200,
    })
}

const cancelReservation = async (req, res) => {
    const login = TokenService.getLoginFromToken(req, res)
    const lectureName = req.body.lectureName;
    const user = await User.query().findOne('login', '=', login).withGraphFetched('lectures')
    const lecture = user.lectures.find(e => e.name === lectureName)
    const trx = await UserLecture.startTransaction();
    try {
        await UserLecture.query().delete().where('user_id', user.id).andWhere('lecture_id', lecture.id)
        await trx.commit();
    } catch (err) {
        await trx.rollback();
        return res.status(400).send({ 'error_message': CONSTANTS.ERROR_CANCEL_RESERVATION })
    }

    res.send({
        "operationResult": "SUCCESS",
        "message": CONSTANTS.SUCCESS_CANCEL_RESERVATION,
        "status": 200,
    })
}

const updateEmail = async (req, res) => {
    const login = TokenService.getLoginFromToken(req, res);
    const newEmail = req.body.newEmail;

    if (await User.query().findOne('email', '=', newEmail)) {
        return res.status(400).send({ 'error_message': CONSTANTS.EMAIL_TAKEN })
    }

    const userUpdated = await User.query()
        .findOne('login', '=', login)
        .patch({
            "email": newEmail
        });

    res.send({
        "operationResult": "SUCCESS",
        "message": CONSTANTS.EMAIL_UPDATE,
        "status": 200,
    })
}

const getAllUsers = async (req, res) => {
    return res.send(await User.query().select('email', 'login'));
}

const getAllUserData = async (req, res) => {
    const login = TokenService.getLoginFromToken(req, res)
    const user = await User.query().findOne('login', '=', login).select('email', 'login').withGraphFetched('lectures')
    res.send(user)
}

const getLecturesWithUsers = async (req, res) => {
    const login = TokenService.getLoginFromToken(req, res)
    const lecutresWithUser = await Lecture.query().withGraphFetched('users')
    res.send(lecutresWithUser.map(element => {
        return {
            "id": element.id,
            "name": element.name,
            "startTime": element.start_time,
            "thematicPath": element.thematic_path,
            "users": element.users.map(el => {
                return {
                    "login": el.login,
                    "email": el.email
                }

            })
        }
    }))

}


module.exports = {
    getRefreshToken, userLoginAuth, signUp,
    getUserLecture, getUserAccountDetails,
    signUpRegister, cancelReservation,
    updateEmail, getAllUsers, getAllUserData,
    getLecturesWithUsers
}