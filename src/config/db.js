const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '11111111',
    database: 'webtoon-moa',
    port: 3306
});
db.connect();

module.exports = db;


