const { Model } = require('objection')
const knex = require('../config/database')
const Lecture = require("./Lecture");
const Role = require("./Role")

Model.knex(knex)

class User extends Model {
    static get tableName() {
        return 'users'
    }

    static relationMappings = {
        lectures: {
            relation: Model.ManyToManyRelation,
            modelClass: Lecture,
            join: {
                from: 'users.id',
                through: {
                    from: 'user_lecture.user_id',
                    to: 'user_lecture.lecture_id'
                },
                to: 'lectures.id'
            }

        },
        roles: {
            relation: Model.ManyToManyRelation,
            modelClass: Role,
            join: {
                from: 'users.id',
                through: {
                    from: 'users_roles.user_id',
                    to: 'users_roles.role_id'
                },
                to: 'role_entity.id'
            }

        }
    }
}

module.exports = User