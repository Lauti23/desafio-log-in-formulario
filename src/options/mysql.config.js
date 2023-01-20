const configMariaDb = {
    host: "localhost",
    user: "root",
    password: ""
}

const configMySql = {
    client: "mysql",
    connection: {
        host: "localhost",
        user: "root",
        password: "",
        database: "products_database"
    }
}

const configSqlite3 = {
    client: "sqlite3",
    connection: {
        filename: "./src/db/messages.sqlite",
    },
    useNullAsDefault: true
}

module.exports = {
    configMariaDb, 
    configMySql,
    configSqlite3
};