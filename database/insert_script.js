const config = require( '../config/default');
const mysql = require('mysql2');
const csv = require('csv-parser');
const fs = require('fs');

const table_name = 'product';
const create_table_script = `
CREATE TABLE ${table_name} (
id           INT           NOT NULL AUTO_INCREMENT,
name         CHAR(60)      NOT NULL DEFAULT '',
description  VARCHAR(200)  NOT NULL DEFAULT '',
price        DECIMAL(8,2)  NOT NULL DEFAULT 0.00,
PRIMARY KEY  (id));
`;

//to be used to create database
function initDB() {
    const database = config.db;

    //init database if not exist
    const con = mysql.createConnection({
        host: database.host,
        user: database.username,
        password: database.password
    });

    con.connect(function(err) {
        if (err) throw err;
        //1. drop database if exist - purge records
        con.query(`DROP DATABASE IF EXISTS ${database.database}`, function (err, result) {
            if (err) throw err;
        });
        //2. create database if not exist - init database
        con.query(`CREATE DATABASE IF NOT EXISTS ${database.database}`, function (err, result) {
            if (err) throw err;
        });
        //3. select database
        con.query(`USE ${database.database}`, function (err, result) {
            if (err) throw err;
        });
        //4. create table
        con.query(create_table_script, function (err, result) {
            if (err) throw err;
        });
        //5. insert records
        fs.createReadStream(config.dataset_filename)
            .pipe(csv())
            .on('data', (row) => {
                const sql_query = "INSERT INTO product (id,name,description,price) " +
                    `VALUES ("${row.id}","${row.name}","${row.description}","${row.price}")`;
                con.query(sql_query, function (err, result) {
                    if (err) throw err;
                });
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
            });
    });

    return;
}

initDB();