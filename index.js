const dbsync = require("./config/datasync")
const express = require('express')
const random = require("random")
const multer = require('multer')
const bcrypt = require('bcrypt')
const fetch = require('node-fetch')
const dotenv = require("dotenv")
const https = require("https")
const fs = require('fs')
const request = require('request')
const line = require("@line/bot-sdk")
const { RSA_NO_PADDING, EBADF } = require("constants")
const { storage } = require("./multer/multersetting")

// import public
const { getpro, getdis, getsub, getyear } = require("../ppap/public/getprovinces/getprovince")
const { version } = require("../ppap/public/version/version")
const { credit, sendtochillpay } = require("../ppap/public/creditpayment/creditpayment")
const { totalmenuorder, checkmenupromotion, deleteordermenu, editordermenu } = require("../ppap//public/totalmenuorder/totalmenuorder")
const { searchhitshop, searchhitmenu } = require("../ppap/public/saerchhitshopandmenu/searchhitshopandmenu")
const {searchstarshop} = require("../ppap/public/searchstarshop/searchstarshop")
const {showmail} = require("../ppap/public/showmail/showmail")
const {showadvertising,discountBalance} = require("../ppap/public/showadvertising/showadvertising")
const {privacy} = require("../ppap/public/privacy/privacy")
const {updateversion} = require("../ppap/public/updateversion/updateversion")
const {canclemenuorder} = require("../ppap/public/canclemenuorder/canclemenuorder")
const {sendproblem,showsendproblem} = require("../ppap/public/sendproblem/sendproblem")
const {seennotification} = require("../ppap/public/seennotification/seennotification")

// global page api
const { searchmenu, searchshop, distance } = require("../ppap/public/search/search")
const { showcategory, shopprofile, showmenuUsecatfind, showcategoryandmenu, showshopandmenuandsuboption } = require("../ppap/public/showshopandmenu/Showshopandmenu")
// import partner
const { regispartner,showpartner } = require("../ppap/partner/regispartner/registerpartner")
const {checkAccesspartner}  = require("../ppap/partner/checkpartner/checkpartner")
const { allowpartner, allowpartnerrequest } = require("../ppap//partner/allowpartner/allowpartner")
const { withdrawpartnerrequest, allowwithdrawpartnerrequest, showwithdrawpartnerrequest,showwithdraw } = require("../ppap/partner/withdraw/withdraw")
const { showshoppartner } = require("../ppap/partner/showshoppartner/showshoppartner")
const {showallwithdrawpartner} = require("../ppap/partner/showallwithdrawpartner/showlalwithdrawpartner")
const {editpartner,showprofilepartner,showlogeditprofilepartner} = require("../ppap/partner/editpartner/editpartner")


//import users
const { registerEmail, register, verify_register, reverify,forgetpasssword,verifyforgetpassword,comfirmpassword,reverifyforgetpassword } = require("./users/register/Regis")
const { login } = require("./users/login/Login")
const { showusers } = require("../ppap/users/showusers/showusers")
const log_login = require("../ppap/users/log_login/Log_login")
const { addcreditcard } = require("../ppap/users/addcreditcard/addcreditcard")
const { successfullyordered } = require("../ppap/users/doneorder/Doneorder")
const { showuseredit, edituser } = require("../ppap/users/editprofile/Editeprofile")

//import shop
const { regisshop } = require("./shop/register/regis_shop")
const { addmenu, addcategory, deletecategory, getmenu, editmenu, addsub, addoption, deletesub, deleteoption, confirmmenu, getmenushop, searchmenupro } = require("../ppap/shop/addmenu/addmenu")
const { addorder, updatestatusorder } = require("../ppap/shop/addorder/Addorder")
const { addpromotion, showallpromotion, looppromotion, showsomepromotion } = require("../ppap/shop/addpromotion/Addpromotion")
const { addemployee } = require("../ppap/shop/addemployee/addemployee")
const { checkaccess } = require("../ppap/shop/checkaccess/checkaccess")
const { listordershop, findshopmenorder, listorderuser, findusermenuorder } = require("../ppap/shop/findorder/Findorder")
const { commentshop,showStatusorder } = require("../ppap/shop/comment/Comment")
const { showshopwithdraw, showshopwithdrawrequest, shopwithdrawrequest, allowwithdrawrequest, showtotalwithdraw, showithdrawsuccess } = require("../ppap/shop/showlistshopwithdraw/Showshopwithdraw")
const { findmenuorderlog } = require("../ppap/shop/findorderlog/findorderlog")
const { deleteshop } = require("../ppap/shop/deleteshop/deleteshop")
const { closeshop, openshop } = require("./shop/closeshoporopenshop/closeshoporopenshop")
const {givestar} = require("../ppap/shop/givestarshop/givestarshop")
const { registeradvertising, allowads} = require("../ppap/shop/advertising/advertising")
const {showordersuccess} = require("../ppap/admin/showordersuccess/showordersuccess")
const {showallwithdrawshop} = require("../ppap/shop/showallwithdrawshop/showallwithdrawshop")
const {checkownshop} = require("../ppap/shop/checkownshop/checkownshop")
const {editshop,showdetailshop,showlogeditprofileshop} = require("../ppap/shop/editshop/editshop")
const {deletemenu} = require("../ppap/shop/deletemenu/deletemenu")
const {cancleorder,showcancleorderrequest,allowcancleorder} = require("../ppap/shop/cancleorder/cancleorder")
const {closemenu,openmenu} = require("./shop/closemenuoropenmenu/closemenuopenmenu")

//import botline41
const { replymessage, sendmassege } = require("../ppap/botline/botline")

// chill pay 
const { URLbackground } = require("../ppap/public/URLbackground/URLbackground")
// const { read, readdirSync } = require("fs")
// const { resolveSoa, ADDRGETNETWORKPARAMS } = require("dns")
//admin 
const {successwithdrawshop} = require("../ppap/admin/successwithdrawshop/successwithdrawshop")
const {showorderdetail} = require("../ppap/admin/showorderdetail/showorderdetail")
const {payment,showpaymentRequest,allowpayment} = require("../ppap/public/payment/payment")


const { ResultWithContext } = require("express-validator/src/chain")
const { json, application } = require("express")
const { type } = require("os")
const { ValidationHalt } = require("express-validator/src/base")
const { resourceLimits } = require("worker_threads")
const { header } = require("express-validator")
const { parse } = require("path")
const e = require("express")
const { triggerAsyncId } = require("async_hooks")
const { validate } = require("uuid")
// const { json } = require("body-parser")
// const { type } = require("os")



dotenv.config()
const privatekey = fs.readFileSync('C:/ssl-softrockthai.com/softrockthai.com.key', 'utf8')
const certificate = fs.readFileSync('C:/ssl-softrockthai.com/softrockthai.com1.cer', 'utf8')
var credentials = { key: privatekey, cert: certificate }
const upload = multer({ storage: storage })
const app = express()
const port = 3001
const router = express.Router()
// setTimeout(your function,"milliseconds")
app.use(express.json({ limit: '8000mb' }))

app.use(express.urlencoded({
  extended: true,
  limit: '8000mb'
}))
app.use(router)
const client = new line.Client({
  channelAccessToken: process.env.Longlivedtoken,
  channelSecret: process.env.Channelsecret
})

// let headers = {
//   'Content-Type': 'application/json',
//   'Authorization': `Bearer ${process.env.Longlivedtoken}`
// }


//get public
app.get("/provinces", getpro)
app.post("/districts", getdis)
app.post("/subdistricts", getsub)
app.get("/getyear", getyear)
app.post("/testcredit", credit)
app.post("/payment", sendtochillpay)
app.post("/totalmenuorder", totalmenuorder)
app.post("/deletetotalmenuorder", deleteordermenu)
app.post("/editordermenu", editordermenu)
app.post("/showmail",showmail)
app.post("/discountadvertising",discountBalance)
app.post("/version", version)
app.post("/updateversion",updateversion)
// test api chillpay
// background for keep varible chillpay 
// might to edit URl background later 
app.post("/Urlbackground", URLbackground)
app.get("/privacy",privacy)
// URlresult for redirect to frontend
router.get("/Urlresult", async (req, res) => {
  try {
    // console.log("what the world ")
    // console.log(req.body)
    console.log(req.ip)
    res.send("<script>window.close();</script > ")
  } catch (err) {
    if (err) {
      console.log(err)
      res.status(400).send('have some error')
    }
  }
})
app.post("/sendproblem",sendproblem)
app.post("/seennotification",seennotification)


//global page api
app.post("/searchmenu", searchmenu)
app.post("/searchshop", searchshop)
app.post("/showshop", shopprofile)
app.post("/showcategory", showcategory)
app.post("/showcategoryandmenu", showcategoryandmenu)
app.post("/showmenu", showmenuUsecatfind) 
app.post("/showshopandmenuandsubjectandoption", showshopandmenuandsuboption)
app.post("/searchhitmenu",searchhitmenu)
app.post("/searchhitshop",searchhitshop)
app.post("/searchshopfromstar",searchstarshop)
app.post("/showadvertising",showadvertising)
app.post("/canclemenuorder",canclemenuorder)
app.post("/creditpayment",payment)


//users
app.post("/registeremail", registerEmail)
app.post("/register", register)
app.post("/verifyregister", verify_register)
app.post("/reverify", reverify)
app.post("/forgetpassword",forgetpasssword)
app.post("/verifyforgetpassword",verifyforgetpassword)
app.post("/comfirmpassword",comfirmpassword)
app.post("/reverifyforgetpassword",reverifyforgetpassword)
app.post("/login", login)
app.post("/loglogin", log_login)
app.get(`/users`, showusers)
app.post("/addcreditcard", addcreditcard)
app.post("/listorderuser", listorderuser)
app.post("/listmenuinorderuser", findusermenuorder)
app.post("/successfullyordered", successfullyordered)
app.post("/showuseredit", showuseredit)
app.post("/editprofileuser", edituser)
app.post("/Pic", (req, res) => {
  const Pic = req.files.Pic
  const nameja = req.files.Pic.name
  // const pi = path.dirname("D:/react_project/ppap/Picture"+nameja)
  Pic.mv(`${__dirname}/Picture/${nameja}`, (err) => {
    if (err) {
      res.send(err)
    } else {
      res.send(req.files)
    }
  })
  res.send(Pic)
})
app.post("/getPic", upload.array("Pic", 3), async (req, res) => {
  try {
    res.send(req.files)
    // res.redirect(302,"/p12")
  } catch (err) {
    if (err) throw err
  }
})
app.get("/getid/:id", async (req, res) => {
  try {

    // const [rows] = await dbsync.execute("SELECT Id_menu FROM addmenu")
    // // const [data] = await dbsync.execute("SELECT Id_sub FROM menu_subject")
    // // const [sid] = await dbsync.execute("SELECT addmenu.Id_menu menuu_subject.Id_sub FROM addmenu menu_subject WHERE addmenu.Id_menu = Id_menu_sub")
    // const [sid] = await dbsync.execute(" SELECT * FROM addmenu JOIN menu_subject ON menu_subject.Id_menu_sub = addmenu.Id_menu WHERE Id_menu=?",[req.params.id])
    // const cId = rows.some(pp => pp.Id_menu == req.params.id)
    // if (cId === true) {
    //   const [sid] = await dbsync.execute("SELECT *  FROM addmenu  JOIN menu_subject ON addmenu.Id_menu = menu_subject.Id_menu_sub JOIN menu_option ON menu_option.Id_sub_option = menu_subject.Id_sub WHERE addmenu.Id_menu=?", [req.params.id])
    //   // const [sid] = await dbsync.execute("SELECT *  FROM addmenu  JOIN menu_subject ON addmenu.Id_menu = menu_subject.Id_menu_sub JOIN menu_option ON menu_option.Id_sub_option = menu_subject.Id_sub GROUP BY menu_subject.Id_menu_sub ",[req.params.id])
    //   const [io] = await dbsync.execute("SELECT * FROM addmenu JOIN menu_subject ON addmenu.Id_menu = menu_subject.Id_menu_sub JOIN menu_option ON menu_option.Id_sub_option = menu_subject.Id_sub WHERE addmenu.Id_menu=? GROUP BY addmenu.Id_menu,addmenu.Name_menu,addmenu.Id_shop_menu,addmenu.Status_menu", [req.params.id])
    //   res.json(sid)
    //   // const py = typeof req.params.id === "string"
    //   // console.log(py)
    //   console.log(`req ${req.params.id} from ${req.ip}`)
    // } else {
    //   res.send("your params Id is not match in menu id ja")
    // }
    var lo = []

    const niranam = [{ data: 1, test: 56 }, { data: 2, test: 56 }, { data: 3, test: 56 }, { data: 4, test: 56 }, { data: 5, test: 56 }]

    // const [sql] = await dbsync.execute("SELECT Name_shop FROM profileshop WHERE UserName_shop=?", [Username])
    // const pp = niranam.map((item) => {
    //   const  io =  item["data"]
    //   lo.push({io})
    //   return io

    // })
    for (let i = 0; i < niranam.length; i++) {
      var ip = niranam[i].data
      lo.push({ datao: ip })
      console.log(ip)
      if (i == niranam.length - 1) {
        res.send(lo)
      }
    }
    // res.send(pp)

  } catch (err) {
    if (err) throw err
  }
})



//shop
app.post("/shop/regis", regisshop)
app.post("/shop/addmenu", addmenu)
app.post("/shop/deletemenu",deletemenu)
app.post("/shop/addcategory", addcategory)
app.post("/shop/deletecategory", deletecategory)
app.post("/shop/editmenu", editmenu)
app.post("/shop/addsubject", addsub)
app.post("/shop/deletesubject", deletesub)
app.post("/shop/addoption", addoption)
app.post("/shop/deleteoption", deleteoption)
app.post("/shop/confirmmenu", confirmmenu)
app.post("/shop/getmenushop", getmenushop)
app.post("/shop/getmenu", getmenu)
app.post("/shop/searchmenupromotion", searchmenupro)
app.post("/shop/addpromotion", addpromotion)
app.post("/shop/checkaccess", checkaccess)
app.post("/shop/getallpromotion", showallpromotion)
app.post("/shop/getonepromotion", showsomepromotion)
app.post("/shop/comment", commentshop)
app.post("/shop/updatestatusorder", updatestatusorder)
app.get("/shop/showshop", async (req, res) => {
  const [data] = await dbsync.execute("SELECT Id_shop_au,Name_shop,Profle_shop,Latitude_shop,Longitude_shop FROM profileshop")
  res.json(data)
  // console.log(data)
})
app.post("/shop/usershop", async (req, res) => {
  const Id = req.body.Id
  const Gen = req.body.Gen
  if (Id !== undefined && Gen !== undefined) {
    const [ft] = await dbsync.execute("SELECT UserName_usr FROM users WHERE Id_usr=? AND Gen_usr=?", [Id, Gen])
    const pp = ft.map((item) => {
      return item["UserName_usr"]
    })
    if (pp[0] !== undefined) {
      const [rows] = await dbsync.execute("SELECT Id_shop FROM profileshop WHERE UserName_shop=?", [pp[0]])
      res.send(rows)
    } else {
      res.send('your Id or Gen wrong')
    }
  } else {
    res.send()
  }
})
app.post("/shop/addorder", addorder)
app.post("/shop/addemployee", addemployee)
app.post("/shop/listordershop", listordershop)
app.post("/shop/listmenuinorder", findshopmenorder)
app.post("/shop/showshopwithdraw", showshopwithdraw)
app.post("/shop/shopwithdrawrequest", shopwithdrawrequest)
app.post("/shop/showtotalwithdraw", showtotalwithdraw)
app.post("/shop/showwithdrawsuccess", showithdrawsuccess)
app.post("/shop/findlogmenuorderusedate", findmenuorderlog)
app.post("/shop/deleteshop", deleteshop)
app.post("/shop/closeshop", closeshop)
app.post("/shop/openshop", openshop)
app.post("/shop/givestar",givestar)
app.post("/shop/showallwithdrawshop",showallwithdrawshop)
app.post("/shop/registeradvertising",registeradvertising)
app.post("/shop/allowads",allowads)
app.post("/shop/checkownshop",checkownshop)
app.post("/shop/showdetailshop",showdetailshop)
app.post("/shop/editshop",editshop)
app.get("/shop/showlogeditprofile",showlogeditprofileshop)
app.post("/shop/cancleorder",cancleorder)
app.post("/shop/showstatusorder",showStatusorder)


// partner
app.post("/partner/register", regispartner)
app.get("/partner/checkaccessregisterpartner",checkAccesspartner)
app.get("/partner/getpartner",showpartner)
app.post("/partner/wihtdrawrequest", withdrawpartnerrequest)
app.post("/partner/showwithdraw",showwithdraw)
app.post("/partner/showshoppartner", showshoppartner)
app.post("/partner/showallwithdrawpartner",showallwithdrawpartner)
app.post("/partner/showprofilepartner",showprofilepartner)
app.post("/partner/editpartner",editpartner)
app.get("/partner/showlogeditprofile",showlogeditprofilepartner)
app.post("/shop/closemenu",closemenu)
app.post("/shop/openmenu",openmenu)


//admin
app.post("/admin/allowshoprequest", async (req, res) => {
  try {
    let Idshop = req.body.Idshop
    const Username = req.body.Username
    // Idshop = JSON.stringify(Idshop)
    // const infoshop = req.body.findshop
    if (Idshop !== undefined && Username !== undefined) {
      const [checkuser] = await dbsync.execute("SELECT * FROM users WHERE UserName_usr=? AND Status_usr = 9", [Username])
      if (checkuser.length === 1) {
        Idshop = JSON.parse(Idshop)
        if (Array.isArray(Idshop) === true) {
          let x = 0
          if (Idshop.length > 0) {
            for (let i = 0; i < Idshop.length; i++) {
              if (Idshop[i].Idshop !== undefined) {
                await parseInt(Idshop[i].Idshop)
                if (isNaN(Idshop[i].Idshop) !== true) {
                  x += 1
                  if (i === Idshop.length - 1 && x === Idshop.length) {
                    for (let o = 0; o < Idshop.length; o++) {
                      const [findshop] = await dbsync.execute("SELECT Name_shop,UserName_shop FROM profileshop WHERE Id_shop=? AND Status_shop=0", [Idshop[o].Idshop])
                      if (findshop.length == 1) {
                        const [GetIdUser] = await dbsync.execute("SELECT Id_usr,Id_line_usr FROM users WHERE UserName_usr=?",[findshop[0].UserName_shop])  
                        if (GetIdUser.length === 1){
                          // const [showusr] = await dbsync.execute("SELECT Id_usr FROM users WHERE UserName_usr=?", [Username])
                        // await dbsync.execute("INSERT INTO shop_access (Addmenu_acc,Edit_acc,Makefood_acc,Addemployee_acc,Addpro_acc,Idshop_acc,Name_usr_acc,Id_usr_acc) VALUES (1,1,1,1,1,?,?,?)", [Idshop[o].Idshop, findshop[0].UserName_shop, GetIdUser[0].Id_usr]) // saveacces
                        const [sql] = await dbsync.execute("SELECT Name_shop FROM profileshop WHERE UserName_shop=?", [findshop[0].UserName_shop])
                        const [User] = await dbsync.execute("SELECT Status_usr FROM users WHERE UserName_usr=?",[findshop[0].UserName_shop])
                        const pp = sql.map((item) => {
                          return item["Name_shop"]
                        })
                        if (pp[1] === undefined) {
                          if (User[0].Status_usr == 4 || User[0].Status_usr == 5){
                            await dbsync.execute("INSERT INTO shop_access (Addmenu_acc,Edit_acc,Makefood_acc,Addemployee_acc,Addpro_acc,Idshop_acc,Name_usr_acc,Id_usr_acc) VALUES (1,1,1,1,1,?,?,?)", [Idshop[o].Idshop, findshop[0].UserName_shop, GetIdUser[0].Id_usr]) // saveacces
                            await dbsync.execute("UPDATE users SET Status_usr=5 WHERE Username_usr=?", [findshop[0].UserName_shop])
                            await dbsync.execute("INSERT INTO totalwithdraw_shop (Id_shop_Total_withdraw,Amount_Total_withdraw) VALUES (?,0)", [Idshop[o].Idshop])
                            await dbsync.execute("UPDATE profileshop SET status_shop=1 WHERE Id_shop=?", [Idshop[o].Idshop])
                            await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["Softrock", `ระบบได้ทำการอนุมัติการเปิดร้าน ${sql[0].Name_shop} ของคุณแล้ว`, 82, 'Softrock', Idshop, "don't have order", 1])
                            // const [saveverify] = await dbsync.execute("INSERT INTO verify (Verify,Usrname,Email) VALUES (?,?,?)", [randomint, Usersname, Email])
                            if (sql[0].Id_partner_shop > 0){
                              await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["Softrock", `ร้าน ${sql[0].Name_shop} ได้ทำการสมัครเข้ามาภายใต้ไอดีของคุณเรียบร้อยแล้ว`, 82, 'Softrock', sql[0].Id_partner_shop, "don't have order", 1])
                              if (GetIdUser[0].Id_line_usr != 0){
                                const sms = [{
                                  type: 'text',
                                  text: `ระบบได้ทำการอนุมัติการเปิดร้าน ${sql[0].Name_shop} ของคุณแล้ว`
                              }
                              ] 
                              const send = await client.pushMessage(GetIdUser[0].Id_line_usr, sms)
                              }else{
                                res.send("success")
                              }
                            }else{
                              if (GetIdUser[0].Id_line_usr !== 0){
                                const sms = [{
                                  type: 'text',
                                  text: `ระบบได้ทำการอนุมัติการเปิดร้าน ${sql[0].Name_shop} ของคุณแล้ว`
                              }
                              ] 
                              const send = await client.pushMessage(GetIdUser[0].Id_line_usr, sms)
                              }else{
                                res.send("success")
                              }
                            }
                          }else{
                            await dbsync.execute("INSERT INTO shop_access (Addmenu_acc,Edit_acc,Makefood_acc,Addemployee_acc,Addpro_acc,Idshop_acc,Name_usr_acc,Id_usr_acc) VALUES (1,1,1,1,1,?,?,?)", [Idshop[o].Idshop, findshop[0].UserName_shop, GetIdUser[0].Id_usr]) // saveacces
                            await dbsync.execute("UPDATE users SET Status_usr=2 WHERE Username_usr=?", [findshop[0].UserName_shop])
                            await dbsync.execute("INSERT INTO totalwithdraw_shop (Id_shop_Total_withdraw,Amount_Total_withdraw) VALUES (?,0)", [Idshop[o].Idshop])
                            await dbsync.execute("UPDATE profileshop SET status_shop=1 WHERE Id_shop=?", [Idshop[o].Idshop])
                            await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["Softrock", `ระบบได้ทำการอนุมัติการเปิดร้าน ${sql[0].Name_shop} ของคุณแล้ว`, 82, 'Softrock', Idshop, "don't have order", 1])
                            // const [saveverify] = await dbsync.execute("INSERT INTO verify (Verify,Usrname,Email) VALUES (?,?,?)", [randomint, Usersname, Email])
                            if (sql[0].Id_partner_shop > 0){
                              await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["Softrock", `ร้าน ${sql[0].Name_shop} ได้ทำการสมัครเข้ามาภายใต้ไอดีของคุณเรียบร้อยแล้ว`, 82, 'Softrock', sql[0].Id_partner_shop, "don't have order", 1])
                              if (GetIdUser[0].Id_line_usr !== 0){
                                const sms = [{
                                  type: 'text',
                                  text: `ระบบได้ทำการอนุมัติการเปิดร้าน ${sql[0].Name_shop} ของคุณแล้ว`
                              }
                              ] 
                              const send = await client.pushMessage(GetIdUser[0].Id_line_usr, sms)
                              }else{
                                res.send("success")
                              }
                            }else{
                              if (GetIdUser[0].Id_line_usr !== 0){
                                const sms = [{
                                  type: 'text',
                                  text: `ระบบได้ทำการอนุมัติการเปิดร้าน ${sql[0].Name_shop} ของคุณแล้ว`
                              }
                              ] 
                              const send = await client.pushMessage(GetIdUser[0].Id_line_usr, sms)
                              }else{
                                res.send("success")
                              }
                            }
                            // res.send("success")
                          }
                        } else if (pp[1] !== undefined) {
                          if (User[0].Status_usr == 4 || User[0].Status_usr == 5){
                            await dbsync.execute("INSERT INTO shop_access (Addmenu_acc,Edit_acc,Makefood_acc,Addemployee_acc,Addpro_acc,Idshop_acc,Name_usr_acc,Id_usr_acc) VALUES (1,1,1,1,1,?,?,?)", [Idshop[o].Idshop, findshop[0].UserName_shop, GetIdUser[0].Id_usr]) // saveacces
                            await dbsync.execute("UPDATE users SET Status_usr=5 WHERE Username_usr=?", [findshop[0].UserName_shop])
                            await dbsync.execute("INSERT INTO totalwithdraw_shop (Id_shop_Total_withdraw,Amount_Total_withdraw) VALUES (?,0)", [Idshop[o].Idshop])
                            await dbsync.execute("UPDATE profileshop SET status_shop=1 WHERE Id_shop=?", [Idshop[o].Idshop])
                            await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["Softrock", `ระบบได้ทำการอนุมัติการเปิดร้าน ${sql[0].Name_shop} ของคุณแล้ว`, 82, 'Softrock', Idshop, "don't have order", 1])
                            // const [saveverify] = await dbsync.execute("INSERT INTO verify (Verify,Usrname,Email) VALUES (?,?,?)", [randomint, Usersname, Email])
                            if (sql[0].Id_partner_shop > 0){
                              await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["Softrock", `ร้าน ${sql[0].Name_shop} ได้ทำการสมัครเข้ามาภายใต้ไอดีของคุณเรียบร้อยแล้ว`, 82, 'Softrock', sql[0].Id_partner_shop, "don't have order", 1])
                              if (GetIdUser[0].Id_line_usr !== 0){
                                const sms = [{
                                  type: 'text',
                                  text: `ระบบได้ทำการอนุมัติการเปิดร้าน ${sql[0].Name_shop} ของคุณแล้ว`
                              }
                              ] 
                              const send = await client.pushMessage(GetIdUser[0].Id_line_usr, sms)
                              }else{
                                res.send("success")
                              }
                            }else{
                              if (GetIdUser[0].Id_line_usr !== 0){
                                const sms = [{
                                  type: 'text',
                                  text: `ระบบได้ทำการอนุมัติการเปิดร้าน ${sql[0].Name_shop} ของคุณแล้ว`
                              }
                              ] 
                              const send = await client.pushMessage(GetIdUser[0].Id_line_usr, sms)
                              }else{
                                res.send("success")
                              }
                            }
                            // res.send("success")
                          }else{
                            await dbsync.execute("INSERT INTO shop_access (Addmenu_acc,Edit_acc,Makefood_acc,Addemployee_acc,Addpro_acc,Idshop_acc,Name_usr_acc,Id_usr_acc) VALUES (1,1,1,1,1,?,?,?)", [Idshop[o].Idshop, findshop[0].UserName_shop, GetIdUser[0].Id_usr]) // saveacces
                            await dbsync.execute("UPDATE users SET Status_usr=3 WHERE Username_usr=?", [findshop[0].UserName_shop])
                            await dbsync.execute("INSERT INTO totalwithdraw_shop (Id_shop_Total_withdraw,Amount_Total_withdraw) VALUES (?,0)", [Idshop[o].Idshop])
                            await dbsync.execute("UPDATE profileshop SET status_shop=1 WHERE Id_shop=?", [Idshop[o].Idshop])
                            await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["Softrock", `ระบบได้ทำการอนุมัติการเปิดร้าน ${sql[0].Name_shop} ของคุณแล้ว`, 82, 'Softrock', Idshop, "don't have order", 1])
                            if (sql[0].Id_partner_shop > 0){
                              await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["Softrock", `ร้าน ${sql[0].Name_shop} ได้ทำการสมัครเข้ามาภายใต้ไอดีของคุณเรียบร้อยแล้ว`, 82, 'Softrock', sql[0].Id_partner_shop, "don't have order", 1])
                              if (GetIdUser[0].Id_line_usr !== 0){
                                const sms = [{
                                  type: 'text',
                                  text: `ระบบได้ทำการอนุมัติการเปิดร้าน ${sql[0].Name_shop} ของคุณแล้ว`
                              }
                              ] 
                              const send = await client.pushMessage(GetIdUser[0].Id_line_usr, sms)
                              }else{
                                res.send("success")
                              }
                            }else{
                              if (GetIdUser[0].Id_line_usr !== 0){
                                const sms = [{
                                  type: 'text',
                                  text: `ระบบได้ทำการอนุมัติการเปิดร้าน ${sql[0].Name_shop} ของคุณแล้ว`
                              }
                              ] 
                              const send = await client.pushMessage(GetIdUser[0].Id_line_usr, sms)
                              }else{
                                res.send("success")
                              }
                            }
                          }
                        } else {
                          res.send("something wrong")
                        }
                        }else{
                          res.send("this user don't have in data")
                        }
                      } else if (findshop.length === 0) {
                        res.send("this shop is appproved")
                      } else {
                        res.send("something wrong")
                      }
                    }
                  }
                } else {
                  if (i == Idshop.length - 1) {
                    // console.log(typeof Idshop[i].Idshop)
                    res.send("your value int is null")
                  }
                }
              } else {
                if (i == Idshop.length - 1 && x !== Idshop.length) {
                  res.send("your value is missing")
                }
              }
            }
          } else {
            res.send("your idshop don't have in array")
          }
        } else {
          res.send("your idshop type is not array")
        }
      } else if (checkuser.length === 0) {
        res.send("you isn't admin")
      } else {
        res.send("something wrong")
      }
    } else {
      res.send()
    }
  } catch (err) {
    if (err.message === "Unexpected token o in JSON at position 1") {
      // console.log(err.message)
      res.send("have some error")
    }else{
      console.log(err)
      res.send("have some error")
    }
  }
})
app.post("/admin/allowmenurequest", async (req, res) => {
  try {
    let Idmenu = req.body.Idmenu
    const Username = req.body.Username
    // let infouser = req.body.infouser
    // Idmenu = JSON.stringify(Idmenu)
    if (Idmenu !== undefined && Username !== undefined) {
      const [checkuserisbewhat] = await dbsync.execute("SELECT * FROM users WHERE UserName_usr=? AND Status_usr=9", [Username])
      if (checkuserisbewhat.length === 1) {
        Idmenu = JSON.parse(Idmenu)
        const checkarray = Array.isArray(Idmenu)
        if (checkarray === true) {
          if (Idmenu.length > 0) {
            let x = 0
            for (let i = 0; i < Idmenu.length; i++) {
              // console.log(Idmenu[i].Idmenu !== undefined)
              if (Idmenu[i].Idmenu !== undefined) {
                await parseInt(Idmenu[i].Idmenu)
                if (isNaN(Idmenu[i].Idmenu) !== true) {
                  x += 1
                  if (i === Idmenu.length - 1 && x === Idmenu.length) {
                    for (let o = 0; o < Idmenu.length; o++) {
                      await dbsync.execute("UPDATE addmenu SET Status_menu=1 WHERE Id_menu=?", [Idmenu[o].Idmenu])
                      const [Menudetail] = await dbsync.execute("SELECT Id_shop_menu,Name_shop_menu,Name_menu FROM addmenu WHERE Id_menu=?",[Idmenu[o].Idmenu])
                      if(Menudetail.length === 1){
                        await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["Softrock", `ระบบได้ทำการอนุมัติเมนู ${Menudetail[0].Id_menu} นี้แล้ว`, 82, 'Softrock', Menudetail[0].Name_shop_menu, "don't have order", 1])
                        const [Findsubject] = await dbsync.execute("SELECT * FROM menu_subject WHERE Id_menu_sub=?",[Idmenu[o].Idmenu])
                        if (Findsubject.length > 0){
                          for(let p=0;p < Findsubject.length;p++){
                            const [FindOption] = await dbsync.execute("SELECT * FROM menu_option WHERE Id_sub_option=?",[Findsubject[p].Id_sub])
                            if (FindOption.length > 0){
                              await dbsync.execute("UPDATE menu_option SET Status_option=1 WHERE Id_sub_option=?",[Findsubject[p].Id_sub]) // update status option 
                              await dbsync.execute("UPDATE menu_subject SET  Status_sub=1 WHERE Id_sub=?",[Findsubject[p].Id_sub]) // update status subject
                            }
                            if (o === Idmenu.length - 1 && p === Findsubject.length -1) {
                              const [Findshop] = await dbsync.execute("SELECT UserName_shop FROM profileshop WHERE Id_shop=?",[Menudetail[0].Id_shop_menu])
                              if (Findshop.length === 1){
                                const [FindUser] = await dbsync.execute("SELECT Id_line_usr FROM users WHERE UserName_usr=?",[Findshop[0].UserName_shop])
                                if (FindUser.length === 1 ){
                                  if (FindUser[0].Id_line_usr != 0){
                                    const sms = [{
                                      type: 'text',
                                      text: `ระบบได้ทำการอนุมัติเมนู ${Menudetail[0].Id_menu} นี้แล้ว`
                                  }]
                                  const sendm = await client.pushMessage(FindUser[0].Id_line_usr, sms)
                                  res.send("success")
                                  }else{
                                    res.send("success")
                                  }
                                }else{
                                  res.send("success")
                                }
                              }else{
                                res.send("success")
                              }
                            }
                          }
                        }else{
                          if (o === Idmenu.length - 1) {
                            const [Findshop] = await dbsync.execute("SELECT UserName_shop FROM profileshop WHERE Id_shop=?",[Menudetail[0].Id_shop_menu])
                            if (Findshop.length === 1){
                              const [FindUser] = await dbsync.execute("SELECT Id_line_usr FROM users WHERE UserName_usr=?",[Findshop[0].UserName_shop])
                              if (FindUser.length === 1 ){
                                if (FindUser[0].Id_line_usr !== 0){
                                  const sms = [{
                                    type: 'text',
                                    text: `ระบบได้ทำการอนุมัติเมนู ${Menudetail[0].Id_menu} นี้แล้ว`
                                }]
                                const sendm = await client.pushMessage(FindUser[0].Id_line_usr, sms)
                                res.send("success")
                                }else{
                                  res.send("success")
                                }
                              }else{
                                res.send("success")
                              }
                            }else{
                              res.send("success")
                            }
                          }
                        }
                      }
                      // if (o === Idmenu.length - 1) {
                      //   res.send("success")
                      // }
                    }
                  }
                } else {
                  if (i === Idmenu.length - 1 && Idmenu.length !== x) {
                    res.send("your value int is null")
                  }
                }
              } else {
                if (i === Idmenu.length - 1 && Idmenu.length !== x) {
                  res.send("your value is missing")
                }
              }
            }
          } else {

            res.send("your idmenu don't have in array")
          }
        } else {
          console.log(typeof Idmenu)
          res.send("your idmenu type is not array")
        }
      } else if (checkuserisbewhat.length === 0) {
        res.send("you isn't admin")
      } else {
        res.send("something wrong")
      }
    } else {
      res.send()
    }
  } catch (err) {
    if (err) {
      console.log(err)
      res.send('have seme error')
    }
  }
})
app.get("/admin/showpartnerrequest", allowpartnerrequest)
app.post("/admin/allowpartner", allowpartner)
app.post("/admin/showshopwitdrawrequest", showshopwithdrawrequest)
app.post("/admin/allowshopwithdrawrequest", allowwithdrawrequest) // edit vaariable amount later 
app.get("/admin/showwithdrawrequest", showwithdrawpartnerrequest)
app.post("/admin/allowwihtdrawrequest", allowwithdrawpartnerrequest)
app.post("/admin/showshoprequest", async (req, res) => {
  try {
    let Nameshop = req.body.Nameshop
    const nameja = Nameshop
    if (Nameshop !== undefined) {
      Nameshop = parseInt(Nameshop)
      if (isNaN(Nameshop) === true) {
        const [showdata] = await dbsync.execute(`SELECT Id_shop,Profle_shop,Name_shop,RegisDate_shop FROM profileshop WHERE Name_shop LIKE '%${nameja}%' AND Status_shop=0 ORDER BY RegisDate_shop Desc`)
        res.json(showdata)
      } else if (Nameshop === 0) {
        // console.log("what")
        const [showshop] = await dbsync.execute("SELECT Id_shop,Profle_shop,Name_shop,RegisDate_shop FROM profileshop WHERE Status_shop=0 ORDER BY RegisDate_shop Desc")
        // const [test] = await dbsync.execute("SELECT * FROM users ORDER BY Create_usr Desc")
        res.send(showshop)
      } else {
        res.send("Nameshop is not string or 0")
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
})
app.post("/admin/showmenurequest", async (req, res) => {
  try {
    let Namemenu = req.body.Namemenu
    const nameja = Namemenu
    if (Namemenu !== undefined) {
      Namemenu = parseInt(Namemenu)
      if (isNaN(Namemenu) === true) {
        const [showdata] = await dbsync.execute(`SELECT Id_menu,Pic_menu,Name_menu,Price_menu,Time_menu,Create_menu FROM addmenu WHERE Name_menu LIKE '%${nameja}%' AND Status_menu=0 ORDER BY Create_menu Desc `)
        res.json(showdata)
      } else if (Namemenu === 0) {
        const [showshop] = await dbsync.execute("SELECT Id_menu,Pic_menu,Name_menu,Price_menu,Time_menu,Create_menu FROM addmenu WHERE Status_menu=0 ORDER BY Create_menu Desc")
        // const [test] = await dbsync.execute("SELECT * FROM users ORDER BY Create_usr Desc")
        res.send(showshop)
      } else {
        res.send("Namemenu is not string or 0")
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
})
app.post("/admin/showshopsuccesswithdraw",successwithdrawshop)
app.post("/admin/showordersuccess",showordersuccess)
app.post("/admin/showorderdetail",showorderdetail)
app.post("/admin/allowpayment",allowpayment)
app.post("/admin/showpaymentrequest",showpaymentRequest)
app.post("/admin/showcancleorderrequest",showcancleorderrequest)
app.post("/admin/allowcancleorder",allowcancleorder)
app.get("/admin/showsendproblem",showsendproblem)
//botline
app.post("/webhook", async (req, res) => {
  try{
    const events = req.body.events[0]
    // console.log(events.message.text)
    if (events !== undefined) {
      const sendfunction = await replymessage(events)
      res.sendStatus(200)
    } else {
      res.sendStatus(400)
    }
  }catch(err){
    if (err){
      console.log(err)
      res.status(400)
    }
  }
})
app.get("/testsend", sendmassege)


// test link
app.get("/test1", async (req, res) => {
  try {
    // const date = new Date()
    // let poi = 28-58
    // if (poi >=1 || poi >=30 && poi <=59){
    //   res.json(poi)
    // }else if(poi >=-30 && poi <=-1){
    //   res.send("hi")
    // }
    // else{
    // "reverify must wait more 30 mins"
    // const pp = 123
    // for (let i=0;i<8;i++){
    //   console.log("po")
    //   if (i == 7){
    //     console.log("hi")
    //   }

    //   if (pp == 123){
    //     console.log("im porsche")
    //   }
    // }
    // const p= [{Idoption: "118", Nameoption: "detail1", Priceoption: "0"}, {Idoption: "119", Nameoption: "detail2", Priceoption: "0"}, {Idoption: "128", Nameoption: "ab1", Priceoption: "0"}, {Idoption: "103", Nameoption: "asdf", Priceoption: "0"}, {Idoption: "112", Nameoption: "lows", Priceoption: "0"}]
    // const jsonencode = JSON.stringify(p)

    // test for addorder
    // let values =   [{"Idoption":"114","Nameoption":"verysweet","Priceoption":"0"},{"Idoption":"116","Nameoption":"lowsweet","Priceoption":"0"}]
    // values = JSON.stringify(values)
    // const strtest = undefined
    // const jsondecode = JSON.parse(values)
    // console.log(Array.isArray(jsondecode))
    // console.log(typeof jsondecode)
    // res.json(jsondecode)


    // const valuesp = [{ subject: [{Idsub:"78",Namesubject:"what's your life in future going to be?", option : [{idoption:165 , nameoption:"hiimporsche", status:"3"}]}] },{ subject: [{Idsub:"78",Namesubject:"what's your life in future"}], option : [{idoption:165 , nameoption:"hiimporsche", status:"3"}] }]
    // const valuesja = [{Subject: { idsubject:92 , option: [{Idoption:103,Nameoption:"asdf",Priceoption:0}] } } , {Subject: {idsubject:94, option: [{Idoption:110,Nameoption:"very",Priceoption:0}] } } ]

    // const valuesforsendreq = [{Subject:{idsubject:92,namesubject:"eiei",option:[{ Idoption:104,Nameoption:"mid",Priceoption:0}]}},{Subject:{idsubject:94,namesubject:"eiei2",option:[{Idoption:112,Nameoption:"lows",Priceoption:0}]}},{Subject:{idsubject:96,namesubject:"eiei3",option:[{Idoption:118,Nameoption:"detail1",Priceoption:0}]}},{Subject:{idsubject:96,namesubject:"eiei3",option:[{Idoption:119,Nameoption:"detail2",Priceoption:0}]}},{Subject:{idsubject:99,namesubject:"eiei4",option:[{ Idoption:129,Nameoption:"ab2",Priceoption:0}]}},{Subject:{idsubject:99,namesubject:"eiei4",option:[{Idoption:130,Nameoption:"ab3",Priceoption:0}]}}]
    // [{"Subject":[{"idsubject":92,"option":[{"Idoption":103,"Nameoption":"asdf","Priceoption":0}]}]},{"Subject":[{"idsubject":94,"option":[{"Idoption":110,"Nameoption":"very","Priceoption":0}]}]}]
    // let str = JSON.stringify(valuesforsendreq)
    // const decode = JSON.parse(str)
    // let valueskub = decode[0]
    // const keepvalues = valueskub.Subject.option
    // if (keepvalues === undefined){
    //   res.json(typeof keepvalues)
    // res.json(keepvalues)
    // }

    // const array = {}
    // let x=0
    // for(let i=0;i < 8;i++){
    //   x += 10
    //   console.log(x)
    //   if (i == 7){
    //     res.json(x)
    //   }
    // }


    // const token = "TdBzlVpr6ZeooP2zGiov2VYkm0qwji46xMo71jv6ROK"
    // const url = "https://notify-api.line.me/api/notify"
    // const option = {
    //   method: "POST",
    //   headers: {
    //     'Authorization':'Bearer '+ token,
    //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    //   },
    //   // form: {
    //   //   message: 'Test Message!'
    //   // },
    //   body: new URLSearchParams({
    //     message:"porsche with the g"
    //   })
    // }
    // let response = await fetch(url,option)
    // let data = await response.json()
    // res.send(data)

    // const getdate = new Date()
    // res.send(getdate)

    // const testssomething = ["internetbank_bay", "internetbank_bbl", "internetbank_scb", "internetbank_ktb", "internetbank_ttb", "payplus_kbank", "mobilebank_scb", "mobilebank_bay", "mobilebank_bbl", "creditcard", "epayment_alipay", "epayment_wechatpay", "epayment_linepay", "epayment_truemoney", "epayment_shopeepay", "Installment_kbank", "installment_krungsri", "installment_firstchoice", "installment_scb"]
    // const findindex = testssomething.findIndex(x => x === "internetbank_ttb")
    // res.json(findindex)
    // const date = new Date("2023-01-07 18:04:43")
    // res.send(date.toISOString().slice(0, 19).replace('T', ' '))

    const [use] = await dbsync.execute("SELECT * FROM pdpa")
    const trime = use[0].Text_pdpa
    res.send(trime.trim())
    
    // let [findorderuser] = await dbsync.execute(`SELECT * FROM paysuccess WHERE Id_usr_paysuccess=? AND Status_paysuccess>=2  ORDER BY Date_paysuccess DESC`, [82])
    // res.json(findorderuser)

    // const output = [{ "Amount": "40", "Day": "08/31/2022" }, { "Amount": "300", "Day": "09/01/2022" }, { "Amount": "1715", "Day": "08/31/2022" }, { "Amount": "250", "Day": "08/31/2022" }, { "Amount": "100", "Day": "08/31/2022" }, { "Amount": "200", "Day": "08/31/2022" }]

    // const sum = output.reduce((acc, cur) => {
    //   const found = acc.find(val => val.Day === cur.Day)
    //   if (found) {
    //     found.Amount += 1
    //   }
    //   else {
    //     acc.push({ ...cur, Amount: Number(cur.Amount) })
    //   }
    //   return acc
    // }, [])

    // res.send(sum)


    // // this for test star
    // let star =  209
    // let teststar = star / 50
    // if (typeof teststar == 'number'){
    //   console.log(teststar)
    //   res.json(Math.floor(teststar))
    // }else {
    //   res.send("nothing")
    // }

    // for(let i=0 ; i < 2;i++){
    //   let sendtest  = await checkmenupromotion(valuearray,82,59)
    //     // console.log(sendtest)
    //     if(typeof sendtest == "object"){
    //       valuearray = sendtest
    //       if(i == 1){
    //         res.json(valuearray)
    //       }else if(i == 0){
    //         console.log(valuearray)
    //       }
    //     }else{
    //       res.send("what")
    //     }
    // }
    //  let p = 8
    //  if (p == 7){
    //   res.send("hello world")
    //  }else if(p == 8){
    //   res.send("what!!")
    //  }
    // console.log(Array.isArray(valuearray) == true
    // res.send(typeof valuearray)
    // const sendtest = await checkmenupromotion(valuearray,73,25,59)
    // res.json(sendtest)

    // const lengthsubject = valuearray[1].Subjectandioption
    //  console.log( lengthsubject[0].Option[1].Price_option_addor)

    // for(let p=0;p<2;p++){
    //   const u = valuearray.length
    //   console.log(u)
    //   for(let i=0; i<u;i++){
    //     if (i == 1){
    //       valuearray.push({Id:"what!!"})
    //     }
    //     // console.log(i)
    //     if (i == u-1){
    //       console.log("Hello world")
    //       console.log(valuearray.length)
    //       console.log(u)
    //     }
    //   }
    // }
    // const checkoriginalprice = valuearray.findIndex(x => x.originalprice !== undefined)
    // const checkdiscountprice = valuearray.findIndex(x => x.discountprice !== undefined)
    // const checksumprice = valuearray.findIndex(x => x.sumprice !== undefined)
    // console.log(checkoriginalprice)
    // console.log(checkdiscountprice)
    // console.log(checksumprice)

    // const value = dd.findIndex(x  => x.Id !== undefined)

    // console.log(value)
    // res.send(value)

    // res.send("already test")

    // Subject:{idsubject:92,namesubject:"eiei",option:[{ Idoption:104,Nameoption:"mid",Priceoption:0}]}
    // if (typeof valuesja === "string"){
    //   res.json("hi")
    // }else if (typeof valuesja === "number"){
    //   res.json('no')
    // }
    // if (valuesforsendreq[0].Subject.idsubject !== undefined){
    //   res.send("hi")
    // }else if (valuesforsendreq[0].Subject.idsubject === undefined){
    //   res.send("what!!")
    // }


    // res.json(valuesforsendreq.length)
    //   res.send("noo")
    // }
    // || minusmins >=30 && minusmins <=59
    // || minusmins >=-30 && minusmins <=-1
    // const transport = nodemailer.createTransport({ service: "gmail", port: 456, secure: false, auth: { user: "niranamppap18@gmail.com", pass: "porscheniranamppap" }, tls: { rejectUnauthorized: false } })
    // const mailobj = { from: "NIRANAM<niranamppap18@gmail.com>", to: Email, subject: "HI!", text: `verify is ${randomint}` }
    // const send = await transport.sendMail(mailobj)
    // const [updateveri] = await dbsync.execute("UPDATE verify SET Verify_veri=?,Year_veri=?,Month_veri=?,Day_veri=?,Hours_veri=?,Minutes_veri=? WHERE Usrname_veri=? AND Email_veri=?", [randomint, year, month, day, hours, minutes, Username, Email])
    // res.send("reverify success")


    // console.log(ui)
    // const [data] = await dbsync.execute("DELETE FROM  users WHERE Id_usr = 999")
    // res.send(data)

    // console.log(date.getFullYear())

    // console.log(date.getUTCMonth()+1)
    // const day = date.getDate().toString()

    // console.log(date.getMinutes().toString())
    // const poi = -1
    // if (poi >= -30 && poi <=0){
    //   res.json(poi)
    // }else{
    //   res.send("noo")
    // }

    // console.log(date.getHours())
    // console.log(date.getMinutes())
    //  const op = [0,4,3,1,3]
    //  res.json(op[0+op.length-1]-1)
    // const pp = "13456"
    // const [sid] = await dbsync.execute("SELECT *  FROM addmenu  JOIN menu_subject ON addmenu.Id_menu = menu_subject.Id_menu_sub JOIN menu_option ON menu_option.Id_sub_option = menu_subject.Id_sub WHERE addmenu.Id_menu=31")
    // res.send(sid)
  } catch (err) {
    // if (err) throw err
    // console.log("ERROR: ", err.message)
    if (err) throw err

  }
})





// var httpsServer = https.createServer(credentials, app)
//   httpsServer.listen(port, () => {
//   console.log(`server is running on https://www.softrockthai.com:${port}`)
// })


app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`)
})


//wrong synctag
// ("D:\react_project\ppap\Picture")


