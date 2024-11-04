// const express = require('express')
const bcrypt = require('bcrypt')
const dbsync = require("D:/react_project/ppap/config/datasync")
const random = require('random')
const nodemailer = require("nodemailer")
const SMTPPool = require('nodemailer/lib/smtp-pool')
const randomstring = require("randomstring")
const { rmSync } = require('fs')
const { rejects } = require('assert')
// this vaeriable about modemailer
const port = 25
const service = "mail.softrockthai.com"
const secure = false
const username = "noreply@softrockthai.com"
const pass = "12345678"

// for send verify to User in email
const registerEmail = async (req, res) => {
  try {
    const randomint = random.int(100000, 999999)
    const DeviceName = req.body.Devicename
    const Email = req.body.Email
    if (Email !== undefined && DeviceName !== undefined) {
      const [findEmailusers] = await dbsync.execute("SELECT Id_usr FROM users WHERE Email_usr=?", [Email])
      if (findEmailusers.length === 0) {
        const Getdate = new Date()
        const formatstartdate = `${Getdate.getFullYear()}/${Getdate.getMonth() + 1}/${Getdate.getDate()} 00:00:00`
        const formatstopdate = `${Getdate.getFullYear()}/${Getdate.getMonth() + 1}/${Getdate.getDate()} 23:59:59`
        const [findDeivceTimeTOEmail] = await dbsync.execute("SELECT Id_usr FROM users WHERE Device_usr=? AND Create_usr BETWEEN ? AND ?", [DeviceName, formatstartdate, formatstopdate])
        if (findDeivceTimeTOEmail.length < 3) {
          const transport = nodemailer.createTransport({ host: service, port: port, secure: secure, auth: { user: "noreply@softrockthai.com", pass: "12345678" }, tls: { rejectUnauthorized: false } })
          const mailobj = { from: "SOFTROCKFOOD<noreply@softrockthai.com>", to: Email, subject: "HI!", text: `verify is ${randomint}` }
          const send = await transport.sendMail(mailobj)
          // console.log(send)
          const [insertEmail] = await dbsync.execute("INSERT INTO users (Email_usr,Status_usr,Device_usr,Token_line_usr) VALUES (?,?,?,?)", [Email, 0,DeviceName,`L${random.int(10000000,99999999)}`])
          const [putverify] = await dbsync.execute("INSERT INTO verify (Verify_veri,Email_veri,Status_veri) VALUES (?,?,?)", [randomint, Email, 0])
          res.send("send to Email success")
        } else if (findDeivceTimeTOEmail.length >= 3) {
          res.send("you have send to email more 2 times you must to wait next day to send email again")
        } else {
          res.send("something wrong")
        }
      } else if (findEmailusers.length === 1) {
        res.send("This Email has been used")
      } else {
        res.send("something wrong")
      }
    } else {
      res.send()
    }
  } catch (err) {
    if (err.command === "RCPT TO" && err.code === "EENVELOPE") {
      res.send("invalid with your email")
    } else {
      console.log(err)
      res.send("have some error")
    }
  }
}

// verify register
const verify_register = async (req, res) => {
  try {
    // const Status = "1"
    // const Usersname = req.body.Usersname
    const Email = req.body.Email
    let verify = req.body.verify
    if (Email !== undefined && verify !== undefined) {
      verify = parseInt(verify)
      if (isNaN(verify) !== true) {
        const [finduser] = await dbsync.execute("SELECT * FROM users WHERE Email_usr=?", [Email])
        if (finduser.length === 1) {
          const [findverify] = await dbsync.execute("SELECT * FROM verify WHERE Email_veri=? AND Status_veri=0 ", [Email])
          if (findverify.length === 1 && findverify[0].Status_veri == 0) {
            if (verify == findverify[0].Verify_veri) {
              const [updateStatusverify] = await dbsync.execute("UPDATE verify SET Status_veri=1 WHERE Email_veri=?", [Email])
              res.json([{
                Status: "success",
                IdUser: finduser[0].Id_usr,
                EmailUser: Email
              }])
            } else if (verify !== findverify[0].Verify_veri) {
              // console.log(findverify[0].Verify_veri)
              // console.log("what the world")
              res.send("invalid verify")
            } else if (findverify[0].Status_veri == 1) {
            // console.log('oh ')
              res.send("This email has been verified")
            }
          } else if (findverify.length === 0) {
            // console.log('oh you ?')
            res.send("you didn't registered")
          } else if (findverify.length === 1 && findverify[0].Status_veri == 1) {
            // console.log('oh you here?')
            res.send("This Email has been verified")
          } else {
            res.send("something wrong")
          }
        } else if (finduser.length === 0) {
          res.send("your email don't have in data")
        } else {
          // console.log('what ')
          res.send("something wrong")
        }
      } else {
        res.send("your value int is null")
      }
    } else {
      res.send()
    }
  } catch (err) {
    if (err) {
      console.log(err)
      res.send("have some error")
    }
  }
}

const register = async (req, res) => {
  try {
    // const randomint = random.int(100000, 999999)
    let Iduser = req.body.Iduser
    const Email = req.body.Email
    let Tel = req.body.Tel
    const UserName = req.body.Username
    const Pass = req.body.Pass
    if (Email !== undefined && Tel !== undefined && UserName !== undefined && Pass !== undefined && typeof UserName === "string" && Iduser !== undefined) {
      Iduser = parseInt(Iduser)
      Tel = parseInt(Tel,10)
      if (isNaN(Iduser) !== true && isNaN(Tel) !== true) {
        Tel = `${0}${Tel}` 
        const [checkuser] = await dbsync.execute("SELECT * FROM users WHERE Email_usr=? AND Id_usr=?", [Email, Iduser])
        if (checkuser.length === 1) {
          // check username 
          const [checkusername] = await dbsync.execute("SELECT UserName_usr FROM users WHERE Id_usr!=?", [Iduser])
          const findindexusername = checkusername.findIndex(obj => {
            return obj.UserName_usr === UserName.toLowerCase()
          })
          if (findindexusername < 0) {
            // check status
            if (checkuser[0].Status_usr == 0) {
              const [checkverify] = await dbsync.execute("SELECT Status_veri FROM verify WHERE Email_veri=?", [Email])
              if (checkverify[0].Status_veri == 1) {
                const salt = bcrypt.genSaltSync(9)
                const hash = bcrypt.hashSync(Pass, salt)
                const [updateuser] = await dbsync.execute("UPDATE users SET Tel_usr=?,UserName_usr=?,Password_usr=?,Status_usr=? WHERE Id_usr=? AND Email_usr=?", [Tel, UserName, hash, '1', Iduser, Email])
                res.send("register success")
              } else if (checkverify[0].Status_veri == 0) {
                res.send("you didn't verified")
              } else {
                res.send("something wrong")
              }
            } else if (checkuser[0].Status_usr == 1) {
              res.send("you has been reigstered")
            }
          } else {
            res.send("this username has been used")
          }
        } else if (checkuser.length === 0) {
          res.send("you don't have this user in data")
        } else {
          res.send("something wrong")
        }
      } else {
        res.send("you value int is null")
      }
    } else {
      res.send()
    }

  } catch (err) {
    if (err.command === "RCPT TO" && err.code === "EENVELOPE") {
      res.send("invalid with your email")
    } else if (err) {
      console.log(err)
      res.send("have some error")
    }
  }
}

// reverify
const reverify = async (req, res) => {
  try {
    const Email = req.body.Email
    if (Email !== undefined) {
      const [data] = await dbsync.execute("SELECT Email_usr,Status_usr FROM users WHERE Email_usr=?", [Email])
      if (data.length === 1 && data[0].Status_usr == 0) {
        // const [rows] = await dbsync.execute("SELECT * FROM users WHERE UserName_usr=? AND Email_usr=?", [Username, Email])
        const [VerifyData] = await dbsync.execute("SELECT Latest_veri FROM verify WHERE Email_veri=? AND Status_veri=0", [Email])
        if (VerifyData.length === 1) {
          // const dateveri = new Date(VerifyData[0].Latest_veri)
          const randomint = random.int(100000, 999999)
          const dateverify = await checkdateverify(VerifyData[0].Latest_veri
            .toISOString()
            .slice(0, 19)
            .replace('T', ' '))
          if (dateverify === "reverify success"){
            // const transport = nodemailer.createTransport({ host: service, port: port, secure: secure, auth: { user: "noreply@softrockthai.com", pass: "12345678" }, tls: { rejectUnauthorized: false } })
            const transport = nodemailer.createTransport({ host: service, port: port, secure: secure, auth: { user: username, pass: pass }, tls: { rejectUnauthorized: false }})
            const mailobj = { from: "SOFTROCKFOOD<noreply@softrockthai.com>", to: Email, subject: "HI!", text: `your verify is ${randomint}` }
            const send =  await transport.sendMail(mailobj)
            // console.log(send)
            await dbsync.execute("UPDATE verify SET Verify_veri=?  WHERE Email_veri=? AND Status_veri=0 ",[randomint,Email])
            res.send("success")
          }else if (dateverify === "reverify must wait more 30 mins"){
            res.send("reverify must wait more 30 mins")
          }else if (dateverify === "something wrong"){
            res.send("something wrong")
          }else if (dateverify === "have some error"){
            res.send("something wrong")
          }
        } else {
          res.send("something wrong")
        }
      } else if (data.length === 1 && data[0].Status_usr > 0) {
        res.send("this email has been verified")
      } else if (data.length === 0) {
        res.send("you don't have this email in data")
      } else {
        res.send("something wrong")
      }
    } else {
      res.send()
    }

  } catch (err) {
    if (err.command === "RCPT TO" && err.code === "EENVELOPE") {
      res.send("invalid with your email")
    } else if (err) {
      console.log(err)
      res.send("have some error")
    }
  }
}

// for check IDCARD 
const cid = (id) => {
  try {
    const pp = {}
    let x = 0

    for (let i in id) {
      x += 1
      pp["test" + x] = id[i]
    }
    pp.test1 = parseInt(pp.test1, 10) * 13
    pp.test2 = parseInt(pp.test2, 10) * 12
    pp.test3 = parseInt(pp.test3, 10) * 11
    pp.test4 = parseInt(pp.test4, 10) * 10
    pp.test5 = parseInt(pp.test5, 10) * 9
    pp.test6 = parseInt(pp.test6, 10) * 8
    pp.test7 = parseInt(pp.test7, 10) * 7
    pp.test8 = parseInt(pp.test8, 10) * 6
    pp.test9 = parseInt(pp.test9, 10) * 5
    pp.test10 = parseInt(pp.test10, 10) * 4
    pp.test11 = parseInt(pp.test11, 10) * 3
    pp.test12 = parseInt(pp.test12, 10) * 2
    pp.test13 = parseInt(pp.test13, 10)
    let cpp1 = Number.isNaN(pp.test1)
    let cpp2 = Number.isNaN(pp.test2)
    let cpp3 = Number.isNaN(pp.test3)
    let cpp4 = Number.isNaN(pp.test4)
    let cpp5 = Number.isNaN(pp.test5)
    let cpp6 = Number.isNaN(pp.test6)
    let cpp7 = Number.isNaN(pp.test7)
    let cpp8 = Number.isNaN(pp.test8)
    let cpp9 = Number.isNaN(pp.test9)
    let cpp10 = Number.isNaN(pp.test10)
    let cpp11 = Number.isNaN(pp.test11)
    let cpp12 = Number.isNaN(pp.test12)
    let cpp13 = Number.isNaN(pp.test13)

    if (cpp1 === false && cpp2 === false && cpp3 === false && cpp4 === false && cpp5 === false && cpp6 === false && cpp7 === false && cpp8 === false && cpp9 === false && cpp10 === false && cpp11 === false && cpp12 === false && cpp13 === false && pp.test14 === undefined && pp.test13 !== undefined) {
      let mod = 11
      let patest = pp.test1 + pp.test2 + pp.test3 + pp.test4 + pp.test5 + pp.test6 + pp.test7 + pp.test8 + pp.test9 + pp.test10 + pp.test11 + pp.test12
      let divide = patest % mod
      let cltest = mod - divide
      let ctestl = cltest % 10
      if (pp.test13 === ctestl) {
        return "yes"
      } else {
        return "no"
      }
      // return pp
    } else {
      return "no"
    }


  } catch (err) {
    if (err) throw err
  }
}


// verify forgetpassword
const forgetpasssword  = async(req,res) =>{
  try{
    const Email = req.body.Email
    const randomint = random.int(100000, 999999)
    if (Email !== undefined ){
        const [User] = await dbsync.execute("SELECT * FROM users WHERE Email_usr=? AND Status_usr!=0",[Email])
        if (User.length === 1){
         if (User[0].Status_usr != 0){
          const transport = nodemailer.createTransport({ host: service, port: port, secure: secure, auth: { user: "noreply@softrockthai.com", pass: "12345678" }, tls: { rejectUnauthorized: false } })
          const mailobj = { from: "SOFTROCKFOOD<noreply@softrockthai.com>", to: Email, subject: "HI!", text: `verify is ${randomint}` }
          await dbsync.execute("INSERT INTO verify_password  (Email_verify_pass,Veri_verify_pass,Status_verify_pass) VALUES (?,?,?)",[Email,randomint,0])
          await transport.sendMail(mailobj)
          res.send("verify has send in email")
         }else{
          res.send("this user didn't register yet")
         }
        }else if (User.length === 0){
            res.send("this user don't have in data")
        }else{
          res.send("something wrong")
        }
    }else{
      res.send()
    }
  }catch(err){
    if (err){
      console.log(err)
      res.send("have some error")
    }
  }
}

const verifyforgetpassword = async(req,res) =>{
  try{
    const Email = req.body.Email
    let Verify = req.body.Verify
    if (Email !== undefined && Verify !== undefined){
      Verify = parseInt(Verify)
      if (isNaN(Verify) !== true){
        const [User] = await dbsync.execute("SELECT * FROM users WHERE Email_usr=? AND Status_usr!=0",[Email])
        if (User.length === 1){
          const Gen = randomstring.generate(30)
          const [VerifyPassword] = await dbsync.execute("SELECT * FROM verify_password WHERE Email_verify_pass=? AND Status_verify_pass=0",[Email])
          if (VerifyPassword.length === 1){
            if (VerifyPassword[0].Veri_verify_pass === Verify){
              await dbsync.execute("UPDATE verify_password SET Token_verify_pass=?,Status_verify_pass=1 WHERE Email_verify_pass=?",[Gen,Email])
              res.json({
                message:"success",
                Token:Gen
              })
            }else if (VerifyPassword[0].Veri_verify_pass !== Verify){
              res.send("Invalid verify")
            }else{
              res.send("something wrong")
            }
          }else{
          res.send("this user didn't verify forgetpassword")
          }
        }else{
        res.send("this user don't have in data")
        }
      }else{
        res.send("your value int is null")
      }
    }else{
      res.send()
    }
  }catch{
    if (err){
      console.log(err)
      res.send("have some error")
    }
  }
}

const comfirmpassword = async(req,res) =>{
  try{
    const Email = req.body.Email
    const TokenVerify = req.body.TokenVerify
    const NewPassword = req.body.NewPassword
    if (Email !== undefined &&TokenVerify !== undefined && NewPassword !== undefined){
      const [User] = await dbsync.execute("SELECT * FROM users WHERE Email_usr=?",[Email])
      if (User.length === 1){
        const [VerifyPassword] = await dbsync.execute("SELECT Token_verify_pass FROM verify_password WHERE Email_verify_pass=?",[Email])
        if (VerifyPassword.length === 1){
          if (VerifyPassword[0].Token_verify_pass === TokenVerify){
            const salt = bcrypt.genSaltSync(9)
            const hash = bcrypt.hashSync(NewPassword, salt)
            await dbsync.execute("UPDATE users SET Password_usr=? WHERE Email_usr=?",[hash,Email])
            res.send("successfully")
          }else if (VerifyPassword[0].Token_verify_pass !== TokenVerify){
            res.send("your Token don't match in data")
          }else{
            res.send("something wrong")
          }
        }else{
          res.send("this user didn't verify forgetpassword")
        }
      }else{
        res.send("this user don't have in data")
      }
    }else{
      res.send()
    }
  }catch(err){
    console.log(err)
    res.send("have some error")
  }
}

const reverifyforgetpassword = async(req,res) =>{
  try{
    const Email = req.body.Email
    if (Email !== undefined){
      const [Verify] = await dbsync.execute("SELECT * FROM verify_password WHERE Email_verify_pass=? ",[Email])
      if (Verify.length === 1){
        if (Verify[0].Status_verify_pass == 0){
          const randomint = random.int(100000, 999999)
          const dateverify = await checkdateverify(Verify[0].Update_verify_pass
          .toISOString()
          .slice(0, 19)
          .replace('T', ' '))
          if (dateverify === "reverify success"){
            // const transport = nodemailer.createTransport({ host: service, port: port, secure: secure, auth: { user: "noreply@softrockthai.com", pass: "12345678" }, tls: { rejectUnauthorized: false } })
            const transport = nodemailer.createTransport({ host: service, port: port, secure: secure, auth: { user: username, pass: pass }, tls: { rejectUnauthorized: false }})
            const mailobj = { from: "SOFTROCKFOOD<noreply@softrockthai.com>", to: Email, subject: "HI!", text: `your verify is ${randomint}` }
            const send =  await transport.sendMail(mailobj)
            // console.log(send)
            await dbsync.execute("UPDATE verify_password SET Veri_verify_pass=?  WHERE Email_verify_pass=? AND Status_veri_pass=0 ",[randomint,Email])
            res.send("success")
          }else if (dateverify === "reverify must wait more 30 mins"){
            res.send("reverify must wait more 30 mins")
          }else if (dateverify === "something wrong"){
            res.send("something wrong")
          }else if (dateverify === "have some error"){
            res.send("something wrong")
          }
        }else{
          res.send("this user has been verified")
        }
      }else{
        res.send("this user didn't verify forgetpassword")
      }
    }else{
      res.send()
    }
  }catch(err){
    if (err){
      console.log(err)
      res.send("have some error")
    }
  }
}

// check date verify 
const checkdateverify = async(dateverify) =>{
  try{
    const datenow = new Date()
    dateverify = new Date(dateverify)
    if (datenow.getFullYear() > dateverify.getFullYear()) {
      return "reverify success"
    } else if (dateverify.getFullYear() == datenow.getFullYear()) {
      if (datenow.getMonth() + 1 > dateverify.getMonth() + 1) {
          return "reverify success"
      } else if (datenow.getMonth() + 1 == dateverify.getMonth() + 1) {
        if (datenow.getDate() > dateverify.getDate()) {
            return "reverify success"
        } else if (datenow.getDate() == dateverify.getDate()) {
          const minushousr = datenow.getHours() - dateverify.getHours()
          const minusmins = datenow.getMinutes() - dateverify.getMinutes()
          if (minushousr >= 2) {
            return "reverify success"
          } else if (minushousr === 1) {
            const plusmins = dateverify.getMinutes() + 30
            if (plusmins >= 61 && plusmins <= 89) {
              if (minusmins >= -30 && minusmins <= -1) {
                     return "reverify success"
              } else if (minusmins >= 30 && minusmins <= 59) {
                     return "reverify success"
              } else {
                return "reverify must wait more 30 mins"
              }
            } else if (plusmins >= 30 && plusmins <= 60) {
                     return "reverify success"
            } else {
              return "something wrong"
            }
          } else if (minushousr === 0) {
            if (minusmins >= -30 && minusmins <= -1) {
              return "reverify success"
            } else if (minusmins >= 30 && minusmins <= 59) {
                return "reverify success"
            } else {
              return "reverify must wait more 30 mins"
            }
          } else {
            return "something wrong"
          }
        } else {
          return "something wrong"
        }
      } else {
        return "something wrong"
      }
    } else if (dateverify.getFullYear() > datenow.getFullYear()) {
      return "something wrong"
    } else {
      return "something wrong"
    }
  }catch(err){
    if (err) {
    return "have some error"
    }
  }
}

module.exports = { registerEmail, register, cid, verify_register, reverify,forgetpasssword,verifyforgetpassword,comfirmpassword,reverifyforgetpassword }


// .toLowerCase()
// SMTPPool()



// SELECT * FROM verify_password WHERE Email_verify_pass=?",[Email]
