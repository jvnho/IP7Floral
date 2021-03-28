//source: https://www.edureka.co/community/88799/how-provide-mysql-database-connection-single-file-in-nodejs

const mysql = require('mysql');
const connection = mysql.createConnection(
{
    host: "localhost",
    user: "root",
    password: "Nicola$32",
    database: "ip7floral"
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;