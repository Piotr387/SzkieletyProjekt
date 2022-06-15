const { Model } = require('objection')
const knex = require('../config/database')

Model.knex(knex)

class UserLecture extends Model {
    static get tableName(){
        return 'user_lecture'
    }
}

module.exports = UserLecture