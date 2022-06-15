const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // support encoded bodies

const port = process.env.PORT || 5000;

const dbConnection = require('./data/db')
dbConnection();

const lectureCotroller = require('./controllers/LectureController');
const userController = require('./controllers/UserController');

app.use('/lectures', lectureCotroller);
app.use('/users', userController);

app.listen(port, () => console.log(`Listening on port ${port}...`))