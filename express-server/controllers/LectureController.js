const router = require("express").Router();
const LectureService = require('../services/LectureService')

//Open lecture's endpoints
//List of all lectures
router.get('/', async (req,res) => {
    res.send(await LectureService.getLectures());
})

//List of all lectures details
router.get('/details', async (req,res) => {
    res.send(await LectureService.getLecturesDetails());
})

module.exports = router;