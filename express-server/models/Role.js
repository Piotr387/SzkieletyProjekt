const { Model } = require('objection')
const knex = require('../config/database')
const User = require('./User')

Model.knex(knex)

class RoleEntity extends Model {
    static get tableName() {
        return 'role_entity'
    }

    static relationMappings = {
        users: {
            relation: Model.ManyToManyRelation,
            modelClass: User,
            join: {
                from: 'role_entity.id',
                through: {
                    from: 'users_roles.role_id',
                    to: 'users_roles.user_id'
                },
                to: 'users.id'
            }

        }
    }
}

module.exports = RoleEntity