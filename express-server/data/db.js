const mysql = require('mysql')

module.exports = async () => {
    try {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'szkielety'
        })
        await connection.connect()
        console.log(`Successfully connected to the database`);
    } catch (e) {
        console.log(`Successfully connected to the database`);
        console.log(e);
    }
}