const mysql = require('mysql2')
const config = require("./config")

const db =  mysql.createPool(config)

module.exports = db