const { Model } = require('objection')
const knex = require('../config/database')

Model.knex(knex)

class UsersRole extends Model {
    static get tableName(){
        return 'users_role'
    }
}

module.exports = UsersRole