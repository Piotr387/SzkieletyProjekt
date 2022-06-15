const Lecture = require("../models/Lecture");
const {CONSTANTS} = require("../constant/CONSTATNS")

const getLectures = async () => {
    return await Lecture.query();
}

const getLecturesDetails = async () => {
    // const lecturesDetails = await Lecture.query()
    // .select('lectures.*', 'COUNT(`B.lecture_id`) as takenSeats')
    // .leftOuterJoin('user_lecture as B', 'lectures.id','B.lecture_id')
    // .groupBy('lectures.id')
    const lecturesDetails = await Lecture.knex().raw(`SELECT A.*, COUNT(B.lecture_id) AS takenSeats FROM lectures A LEFT OUTER JOIN user_lecture B ON A.id = B.lecture_id GROUP BY A.id`)
    const lecturesDetailsDTO = lecturesDetails[0].map((lecture) => {
        return {
            'lectureDTO': {
                'name': lecture.name,
                'thematicPath': lecture.thematic_path,
                'startTime': lecture.start_time,
            },
            'capacity': 5,
            'takenSeats': lecture.takenSeats,
        }
    })
    return lecturesDetailsDTO
}

module.exports = { getLectures, getLecturesDetails }