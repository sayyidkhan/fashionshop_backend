const config = require( '../config/default');
const mysql = require('mysql2');
const csv = require('csv-parser');
const fs = require('fs');



function initDB() {
    const table_name = 'product';
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
        const create_table_query = `
        CREATE TABLE ${table_name} (
         id    INT UNSIGNED  NOT NULL AUTO_INCREMENT,
         name  CHAR(60)      NOT NULL DEFAULT '',
         description  VARCHAR(500)   NOT NULL DEFAULT '',
         price     DECIMAL UNSIGNED  NOT NULL DEFAULT 0.00,
         PRIMARY KEY  (id));
        `;
        con.query(create_table_query, function (err, result) {
            if (err) throw err;
        });
        //5. insert records
        fs.createReadStream(config.dataset_filename)
            .pipe(csv())
            .on('data', (row) => {
                row.id = parseInt(row.id);
                row.price = parseFloat(row.price);
                const sql_query = "INSERT INTO product (id,name,description,price) " +
                    `VALUES ("${row.id}","${row.name}","${row.description}",${row.price})`;
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