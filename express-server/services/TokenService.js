const jwt = require('jsonwebtoken')
const {CONSTANTS} = require("../constant/CONSTATNS")

function generateAccessToken(login, roles) {
    return jwt.sign({ sub: login, roles: roles }, process.env.TOKEN_SECRET, { expiresIn: 86400 })
}

function generateRefreshToken(login, roles) {
    return jwt.sign({ sub: login, roles: roles }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: 525600 })
}

function getTokenFromHeader(req, res) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token === null) return res.status(401).send({ 'error_message': CONSTANTS.TOKEN_REQUIRED })
    return token
}

function getNewAccessTokenFromRefreshToken(req, res) {
    var token = getTokenFromHeader(req, res), decoded;

    try {
        decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        return res.status(403).send({ 'error_message': CONSTANTS.INVALID_TOKEN })
    }

    res.send({
        'access_token': generateAccessToken(decoded.login, decoded.roles),
        'refresh_token': token
    });

}

function decodeToken(token) {
    var decoded;
    try {
        decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    } catch (error) {
        try {
            decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
        } catch (error) {
            return res.status(403).send({ 'error_message': 'Invalid token' })
        }
    }
    return decoded;
}

function getLoginFromToken(req, res) {
    var token = getTokenFromHeader(req, res);
    const decoded = decodeToken(token);
    return decoded.sub;
}

function getRolesFromToken(req, res) {
    var token = getTokenFromHeader(req, res);
    const decoded = decodeToken(token);
    return decoded.roles;
}



// function authenticateUserRole(req, res, next) {
//     var token = getTokenFromHeader(req, res), decoded;

//     try {
//         decoded = jwt.verify(token, process.env.TOKEN_SECRET)
//     } catch (error) {
//         return res.status(403).send({ 'error_message': 'Invalid refresh token' })
//     }
// }

module.exports = {
    generateAccessToken, generateRefreshToken,
    getNewAccessTokenFromRefreshToken, getLoginFromToken,
    getTokenFromHeader, getRolesFromToken
}