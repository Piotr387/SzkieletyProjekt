const { Model } = require('objection')
const knex = require('../config/database')


Model.knex(knex)

class Lecture extends Model {
    static get tableName() {
        return 'lectures'
    }

    static get relationMappings() {
        const User = require('./User');

        return {
            users: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'lectures.id',
                    through: {
                        from: 'user_lecture.lecture_id',
                        to: 'user_lecture.user_id'
                    },
                    to: 'users.id'
                }
            }
        }

        // static relationMappings = {
        //     users: {
        //         relation: Model.ManyToManyRelation,
        //         modelClass: User,
        //         join: {
        //             from: 'lectures.id',
        //             through: {
        //                 from: 'user_lecture.lecture_id',
        //                 to: 'user_lecture.user_id'
        //             },
        //             to: 'users.id'
        //         }

        //     }
        // }
    }
}
module.exports = Lecture