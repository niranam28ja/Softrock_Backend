const { stream } = require("npmlog")

const config = {
host:"localhost",
user: "root",
password: "",
database: "sr",
timezone: "+00:00",
charset: "utf8mb4_general_ci",
// wait_timeout:30000,
// waitForConnections: false,
// connectionLimit: 100,
// queueLimit: 100,

// acquireTimeout: 1000000
// pool:{
//     max:10,
//     min:0,
//     acquire:30000,
//     dile:10000
// }
// Option: {
//     stream:true
// }
// acquireTimeout
// pooling:true
}

module.exports = config