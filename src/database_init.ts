const config = require( 'config');
const mysql = require('mysql2');

export default function initDB() {
    const database = config.db;

    //init database if not exist
    const con = mysql.createConnection({
        host: database.host,
        user: database.username,
        password: database.password
    });

    con.connect(function(err) {
        if (err) throw err;
        con.query(`CREATE DATABASE IF NOT EXISTS ${database.database}`, function (err, result) {
            if (err) throw err;
        });
    });

}