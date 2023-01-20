const { configMariaDb, configMySql, configSqlite3 } = require('../options/mysql.config')
const knex = require('knex')
const mysql = require('mysql')

//DATABASE
const databaseMySql = knex(configMySql)
const databaseSqlite3 = knex(configSqlite3)

//MIDDLEWARE PARA CREAR LA BASE DE DATOS LOCAL
const createDatabase = async (req, res, next) => {
    try {
        const connect = mysql.createConnection(configMariaDb) //NOS CONECTAMOS
    connect.connect(function (err, result) {
        if(err) throw err;
        connect.query("CREATE DATABASE IF NOT EXISTS products_database", function(err, result) { //USAMOS LA QUERY PARA QUE CREE LA BASE DE DATOS SI ES QUE NO EXISTE
            console.log("Base de datos products_database creada...")
            if(err) throw err;
        })
    })
    next();
    } catch (error) {
        console.log("Error al crear la base de datos:", error.message)
    }
    
}

//MIDDLEWARE PARA CREAR LA TABLA DE MYSQL
const createTable = async (req, res, next) => {
    try {
        databaseMySql.initialize(databaseMySql)
        const ifExists = await databaseMySql.schema.hasTable("products") //VEMOS SI LA TABLA EXISTE O NO
        if(ifExists) {
            next() 
        } else {
            await databaseMySql.schema.createTable("products", table => {
                table.increments("id");
                table.string("name");
                table.integer("price");
                table.string("image");
            })
                .then(() => console.log("Table created"))
                .catch(err => console.log(err))
                .finally(() => databaseMySql.destroy());
            next()
        }
    } catch (error) {
        console.log("Error al crear tabla:", error.message)
    }
    
}

//MIDDLEWARE PARA CREAR LA TABLA DE SQLITE3
const createTableSqlite3 = async (req, res, next) => {
    try {
        const ifExists = await databaseSqlite3.schema.hasTable("messages") //VEMOS SI LA TABLA EXISTE O NO
        if(ifExists) {
            next()
        } else {
            await databaseSqlite3.schema.createTable("messages", table => {
                table.increments("id");
                table.string("email");
                table.string("date");
                table.string("message");
            })
                .then(() => console.log("Table messages created"))
                .catch(err => console.log(err))
                .finally(() => databaseSqlite3.destroy());
            next()
        }  
    } catch (error) {
        console.log("Error al crear tabla de Sqlite3:", error.message)
    }
}

module.exports = {
    createDatabase, 
    createTable,
    createTableSqlite3
};