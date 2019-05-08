const mysql = require('mysql');

const conn = mysql.createConnection({
    user: 'devuser',
    password: 'Mysql123',
    host: 'localhost',
    database: 'finalproject',
    port: '3306'

})

module.exports = conn