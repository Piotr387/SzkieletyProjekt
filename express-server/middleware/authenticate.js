const TokenService = require('../services/TokenService')
const jwt = require('jsonwebtoken')

exports.authenticate = (req, res, next) => {
    const token = TokenService.getTokenFromHeader(req, res)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).send({ 'error_message': 'Invalid access token' })
        req.decoded = decoded
        req.roles = decoded.roles
        next()
    })
}


exports.verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req?.roles) return res.status(401).send({ 'error_message': 'No roles provided' })
        const rolesArray = [...allowedRoles];
        const result = req.roles.map(role => rolesArray.includes(role)).find( val => val === true);
        if(!result) return res.status(401).send({ 'error_message': 'No premission granted' })
        next();
    }
}