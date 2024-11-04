const dbsync = require("D:/react_project/ppap/config/datasync")
const nodemailer = require("nodemailer")
const random = require('random')

const { register, cid, verify_register } = require("D:/react_project/ppap/users/register/Regis")
const { response } = require('express')
// register test 
const regisshop2 = async (req, res) => {
    const Id_shop = req.body.Id_shop
    const Pic_shop = req.body.Pic_shop
    const Status_shop = req.body.Status_shop
    const Id_usr = req.body.Id_usr
    if (Id_shop !== undefined && Pic_shop !== undefined && Status_shop !== undefined && Id_usr !== undefined) {
        const [rows] = await dbsync.execute("INSERT INTO profileshop (Id_shop,Pic_shop,Status_shop,Id_usr) VALUES (?,?,?,?)", [Id_shop, Pic_shop, Status_shop, Id_usr])
        res.send(req.body)
    } else {
        res.send()
    }
}
// main register 
// maybe i must to edit date later
const regisshop = async (req, res) => {
    try {
        const Nameshop = req.body.Nameshop
        const Name = req.body.Name
        const Sur = req.body.Sur
        const Age = req.body.Age
        const Email = req.body.Email
        let Tel = req.body.Tel
        const PicPayment = req.body.Picpayment
        const IdPayment = req.body.Idpayment
        const Idcard = req.body.Idcard
        const Picidcard = req.body.Picidcard
        const Address = req.body.Address
        const Province = req.body.Province
        const District = req.body.District
        const Amphur = req.body.Amphur
        const Latitude = req.body.Latitude
        const Longitude = req.body.Longitude
        const Profile = req.body.Profile
        const Background = req.body.Background
        const Open = req.body.Open
        const Close = req.body.Close
        const Username = req.body.Username
        // const Email = req.body.Email
        const Gen = req.body.Gen
        const Dayb = req.body.Dayb
        const Monthb = req.body.Monthb
        const Yearb = req.body.Yearb
        let Id_partner = req.body.Id_partner

        if (Nameshop !== undefined && Name !== undefined && Sur !== undefined && Age !== undefined && Email !== undefined && Tel !== undefined && PicPayment !== undefined && IdPayment !== undefined && Idcard !== undefined && Picidcard !== undefined && Address !== undefined && Province !== undefined && District !== undefined && Amphur !== undefined && Latitude !== undefined && Longitude !== undefined && Profile !== undefined && Background !== undefined && Open !== undefined && Close !== undefined && Username !== undefined && Gen !== undefined && Dayb !== undefined && Monthb !== undefined && Yearb !== undefined && Id_partner !== undefined) {
            const result = cid(Idcard)
            if (result === "yes") {
                Id_partner = parseInt(Id_partner)
                if (isNaN(Id_partner) !== true) {
                    const [data] = await dbsync.execute("SELECT Name_shop FROM profileshop WHERE Name_shop=? ", [Nameshop])
                    // const cUsrname = data.some(data => data.Name_shop === Nameshop)
                    if (data.length === 1) {
                        res.send("this name shop has been used")
                    } else {
                        const [usr] = await dbsync.execute("SELECT Id_usr,UserName_usr,Status_usr,Gen_usr FROM users WHERE UserName_usr=? AND Gen_usr=?", [Username, Gen])
                        const [findpartner] = await dbsync.execute("SELECT UserName_usr FROM users WHERE Id_usr=?", [Id_partner])
                        // const cusr = usr.some(usr => usr.UserName_usr === Username)
                        if (usr.length === 1) {
                            // console.log("what the worlddd")
                            if (findpartner.length === 1 || Id_partner == '0000') {
                                if (usr[0].Id_usr != Id_partner) {
                                    // const [gen] = await dbsync.execute("SELECT Gen_usr,Status_usr FROM users WHERE Username_usr=?", [Username])
                                    // const cgen = gen.some(gen => gen.Gen_usr === Gen)
                                    const id_shop = random.int(1000, 9999)
                                    const statusadd = 0
                                    Tel = `${0}${Tel}`
                                    const date = new Date()
                                    const year = date.getFullYear().toString()
                                    const realmonth = date.getMonth() + 1
                                    const month = realmonth.toString()
                                    const day = date.getDate().toString()
                                    const hours = date.getHours().toString()
                                    const minutes = date.getMinutes().toString()
                                    console.log("what the world")
                                    const [saveS] = await dbsync.execute("INSERT INTO profileshop (Name_shop,Name_usr_shop,Sur_usr_shop,UserName_shop,Email_shop,Tel_shop,Pic_payment_shop,Payment_payment_shop,Gen_usr_shop,Id_shop,Idcard_usr_shop,Age_usr_shop,Id_partner_shop,Pic_Idcard_shop,Address_usr_shop,Latitude_shop,Longitude_shop,Province_shop,District_shop,Amphur_shop,Profle_shop,Bg_shop,Open_shop,Close_shop,Status_shop,Dayb_shop,Monthb_shop,Yearb_shop,Year_shop,Month_shop,Day_shop,Hours_shop,Minutes_shop) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [Nameshop, Name, Sur, Username, Email, Tel, PicPayment, IdPayment, Gen, id_shop, Idcard, Age, Id_partner, Picidcard, Address, Latitude, Longitude, Province, District, Amphur, Profile, Background, Open, Close, statusadd, Dayb, Monthb, Yearb, year, month, day, hours, minutes])
                                    res.send("you register pass ja")
                                } else {
                                    res.send("you can't send your users with partner")
                                }
                            } else if (findpartner.length === 0 ) {
                                res.send("your Idpartner don't have in data")
                            }else{
                                res.send("something wrong")
                            }
                        } else {
                            res.send("you don't have username")
                            // console.log("you don't have username")
                        }
                    }
                } else {
                    res.send("your value int is null")
                }
            } else {
                res.send("your IDcards wrong")
                // console.log("your IDcards wrong")
            }
        } else {
            res.send()
        }
    } catch (err) {
        if (err){
            console.log(err)
            res.send("have some error")
        }
    }

}

module.exports = { regisshop }