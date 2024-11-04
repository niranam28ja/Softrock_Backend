const dbsync = require("D:/react_project/ppap/config/datasync")
const express = require('express')
const bcrypt = require('bcrypt')
const randomstring = require("randomstring")
// const log = express()
// พนเช้าจะลองทำว่าสาเหตุที่ทำให้ค่าเป็นfalse
const login = async (req, res) => {
  try {
    const Username = req.body.Username
    const Password = req.body.Password
    if (Username !== undefined && Password !== undefined) {
      if (typeof Username === "string" & typeof Password === "string") {
        const [rows] = await dbsync.execute("SELECT UserName_usr FROM users WHERE UserName_usr=?",[Username])
        // const cUsrname = rows.some(rows => rows.UserName_usr == Username)
        // console.log(Username)
        if (rows.length === 1) {
          const [data] = await dbsync.execute("SELECT Password_usr,Gen_usr FROM users WHERE UserName_usr=?", [Username])
          if (bcrypt.compareSync(Password, data[0].Password_usr) === true) {
            const [status] = await dbsync.execute("SELECT Status_usr FROM users WHERE UserName_usr=?", [Username])
            // const [datasync] = await dbsync.execute("SELECT Status_usr FROM users WHERE Username_usr=?",[Username])
            const Gen = randomstring.generate(30)
            if (status[0].Status_usr === "1") {
              // console.log("owihfe")
              const [sSQL] =  await dbsync.execute("SELECT Id_usr,Email_usr,Total_payment_usr,Tel_usr,Gen_usr,Status_usr,Star_usr,Token_line_usr FROM users WHERE UserName_usr=?", [Username])
              const success = { sucess: "successful" }
              sSQL.push(success)
              if (data[0].Gen_usr === "0") {
                const [SQLg] = await dbsync.execute("UPDATE users SET Gen_usr=? WHERE UserName_usr=?", [Gen, Username])
                const [gdata] = await dbsync.execute("SELECT Id_usr,Email_usr,Total_payment_usr,Tel_usr,Gen_usr,Status_usr,Star_usr,Token_line_usr FROM users WHERE UserName_usr=?", [Username])
                gdata.push(success)
                // const [show] = await dbsync.execute("SELECT id_usr,Gen_usr FROM users WHERE UserName_usr=?", [Username])
                // show.push(success)
                res.send(gdata)
              } else if (data[0].Gen_usr !== "0") {
                res.send(sSQL)
              }
            } else if (status[0].Status_usr === "2" || status[0].Status_usr === '3' || status[0].Status_usr === "4" || status[0].Status_usr === "5" || status[0].Status_usr === "9") {
              // console.log("osefeon")
              const [sSQL] = await dbsync.execute("SELECT Id_usr,Email_usr,Total_payment_usr,Tel_usr,Gen_usr,Status_usr,Star_usr,Token_line_usr FROM users WHERE UserName_usr=?", [Username])
              const [SQLs] = await dbsync.execute("SELECT Id_shop,Name_shop FROM profileshop WHERE UserName_shop=?", [Username])
              // const pp = SQLs.map((item) =>{
              //   return item["Id_shop"]
              // })
              // let po = pp.toString()
              const success = { sucess: "successful" }
              const sid = { shopid: SQLs }
              sSQL.push(success)
              sSQL.push(sid)
              if (data[0].Gen_usr === "0") {
                // console.log("iii")
                const [SQLg] = await dbsync.execute("UPDATE users SET Gen_usr=? WHERE UserName_usr=?", [Gen, Username])
                // const [show] = await dbsync.execute("SELECT id_usr,Gen_usr FROM users WHERE UserName_usr=?", [Username])
                // show.push(success)
                res.send(sSQL)
              } else if (data[0].Gen_usr !== "0") {
                // console.log("]]]")
                // console.log(sSQL)
                res.send(sSQL)
              }
            } else {
              res.send("you didn't verify")
            }
          } else {
            res.send("Password is wrong")
          }
        } else {
          res.send("your username is wrong")
        }
      } else {
        res.send()
      }
    } else {
      res.send()
    }
  } catch (err) {
    if (err) throw err
  }
}


module.exports = { login }