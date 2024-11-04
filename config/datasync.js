const mysql = require('mysql2/promise')
const config = require("../config/config")

const  dbsync =  mysql.createPool(config)


module.exports= dbsync
