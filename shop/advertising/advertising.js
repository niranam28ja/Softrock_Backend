const { truncateSync, rmSync } = require("fs")
const { syncBuiltinESMExports } = require("module")
const { defaultMaxListeners } = require("nodemailer/lib/xoauth2")
const dbsync = require("D:/react_project/ppap/config/datasync")
const fetch = require("node-fetch")
const md5 = require("md5")
const random = require("random")
const line = require("@line/bot-sdk")
const dotenv = require("dotenv")
const { isDeepStrictEqual } = require("util")
dotenv.config()

const client = new line.Client({
    channelAccessToken: process.env.Longlivedtoken,
    channelSecret: process.env.Channelsecret
})

const registeradvertising = async (req, res) => {
    try {
        // 7.1 ฟิวล์ที่ต้องเก็บในการที่จะโฆษณา
        // 7.1.1 เลือกจังหวัด
        // 7.1.2 เลือกอำเภอ
        // 7.1.3 เลือกตำบล
        // 7.1.4 เลือกเพศ
        // 7.1.5 เลือกช่วงอายุ
        // 7.1.6 สถานะของอันนี้
        // 7.1.7 จำนวนเงินหรือจำนวนการส่งไปให้
        // 7.1.8 auto id
        // 7.1.9 iduser คนนั้น
        // 7.1.10 id shop นั้น
        // 7.1.11 ชื่อร้านค้านั้น
        // 7.1.12 ให้เลือกรูปแบบการโฆษณาว่า จะขึ้นบนหน้า main หรืว่าจะเข้าไป mail user
        const Description = "payment advertising"
        const Currency = "764"
        const RouteNo = "1"
        const OrderId = random.int(10000000000, 99999999999)
        const Merchantcode = process.env.MerchantCode
        const ApiKey = process.env.ApiKey
        const Province = req.body.Province
        const District = req.body.District
        const Subdistrict = req.body.Subdistrict
        const Ipaddress = req.body.Ipaddress
        const Chanelcode = req.body.Chanelcode
        let Gender = req.body.Gender
        let Max_age = req.body.Max_age
        let Min_age = req.body.Min_age
        const Pic = req.body.Pic
        let Iduser = req.body.Iduser
        const Token = req.body.Token
        let Idshop = req.body.Idshop
        let Balance = req.body.Balance
        const Typesend = req.body.Typesend
        let Discount_perseen = req.body.Discount_perseen
        const testsomething = ["internetbank_bay", "internetbank_bbl", "internetbank_scb", "internetbank_ktb", "internetbank_ttb", "payplus_kbank", "mobilebank_scb", "mobilebank_bay", "mobilebank_bbl", "creditcard", "epayment_alipay", "epayment_wechatpay", "epayment_linepay", "epayment_truemoney", "epayment_shopeepay", "Installment_kbank", "installment_krungsri", "installment_firstchoice", "installment_scb"]
        const url = "https://sandbox-appsrv2.chillpay.co/api/v2/Payment/"
        if (Province !== undefined && District !== undefined && Subdistrict !== undefined && Gender !== undefined && Ipaddress !== undefined && Chanelcode !== undefined && Max_age !== undefined && Min_age !== undefined && Pic !== undefined && Iduser !== undefined && Balance !== undefined && Idshop !== undefined && Typesend !== undefined && Discount_perseen !== undefined) {
            Gender = parseInt(Gender)
            Max_age = parseInt(Max_age)
            Min_age = parseInt(Min_age)
            Iduser = parseInt(Iduser)
            Idshop = parseInt(Idshop)
            Balance = parseInt(Balance)
            Discount_perseen = parseInt(Discount_perseen)
            if (isNaN(Gender) !== true && isNaN(Max_age) !== true && isNaN(Min_age) !== true && isNaN(Iduser) !== true && isNaN(Idshop) !== true && isNaN(Balance) !== true && isNaN(Discount_perseen) !== true) {
                const [finduser] = await dbsync.execute("SELECT UserName_usr FROM users WHERE Id_usr=? AND Gen_usr=?", [Iduser, Token])
                if (finduser.length === 1) {
                    const [findshop] = await dbsync.execute("SELECT * FROM profileshop WHERE Id_shop=?", [Idshop])
                    if (findshop.length === 1) {
                        const findindexchanelcode = testsomething.findIndex(x => x === Chanelcode)
                        if (findindexchanelcode > -1) {
                            if (Gender === 0 || Gender === 1 || Gender === 2) {
                                if (Typesend === "home page" || Typesend === "mail") {
                                    if (Balance > 0) {
                                        const Checksome = md5(`${Merchantcode}${OrderId}${finduser[0].UserName_usr}${Balance * 100}${Description}${Chanelcode}${Currency}${RouteNo}${Ipaddress}${ApiKey}${process.env.MD5Key}`)
                                        const option = {
                                            method: "POST",
                                            headers: {
                                                "Cache-Control": "no-cache",
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify({
                                                "MerchantCode": process.env.MerchantCode,
                                                "OrderNo": `${OrderId}`,
                                                "CustomerId": finduser[0].UserName_usr,
                                                "Amount": Balance * 100,
                                                "Description": Description,
                                                "ChannelCode": Chanelcode,
                                                "Currency": Currency,
                                                "RouteNo": RouteNo,
                                                "IPAddress": Ipaddress,
                                                "ApiKey": process.env.ApiKey,
                                                "CheckSum": Checksome
                                            })
                                        }
                                        const response = await fetch(url, option)
                                        const data = await response.json()
                                        if (data.Status === 0) {
                                            await dbsync.execute("INSERT INTO advertising (Province_ads,District_ads,Subdistrict_ads,Order_ads,gender_ads,Min_age_ads,Max_age_ads,Pic_ads,Balance_ads,Seen_ads,Discount_perseen_ads,Typesend_ads,Id_usr_ads,Id_shop_ads,Status_ads) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [Province, District, Subdistrict, OrderId, Gender, Min_age, Max_age, Pic, Balance, 0,Discount_perseen , Typesend, Iduser, Idshop, 0])
                                            res.json(data)
                                        } else {
                                            res.send("maybe something wrong")
                                        }
                                    } else {
                                        res.send("you Balance must to more than 0")
                                    }
                                } else {
                                    res.send("your typesend invalid")
                                }
                            } else {
                                res.send("your gender invalid")
                            }
                        } else {
                            res.send("your chanelcode invalid")
                        }
                    } else if (findshop.length === 0) {
                        res.send("this shop don't have in data")
                    } else {
                        res.send("something wrong")
                    }
                } else if (finduser.length === 0) {
                    res.send("this user don't have in data")
                } else {
                    res.send("something wrong")
                }
            } else {
                res.send("your value int is null")
            }
        } else {
            res.send("")
        }
    } catch (err) {
        if (err) {
            console.log(err)
            res.send("have some error")
        }
    }
}


const allowads = async (req, res) => {
    try {
        let Id_ads = req.body.Id_ads
        let Id_admin = req.body.Id_admin
        const Token = req.body.Token
        if (Id_ads !== undefined && Id_admin !== undefined && Token !== undefined) {
            Id_ads = parseInt(Id_ads)
            Id_admin = parseInt(Id_admin)
            if (isNaN(Id_admin) !== true && isNaN(Id_admin) !== true) {
                const [checkadmin] = await dbsync.execute("SELECT * FROM users WHERE Id_usr=? AND Gen_usr=?", [Id_admin, Token])
                if (checkadmin.lenght === 1) {
                    const [findads] = await dbsync.execute("SELECT * FROM advertising FROM Id_ads=?", [Id_ads])
                    if (findads.lenght === 1) {
                        await dbsync.execute("UPDTE advertising SET Status_ads=1 WHERE Id_ads=?", [Id_ads])
                        await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["Softrock",`ทางเราได้อนุมัคิโฆษณาเป็นที่เรียบร้อย`, 82, 'Softrock', findads[0].Id_usr_ads, 0, 1])
                        const [User] = await dbsync.execute("SELECT Id_line_usr FROM users WHERE Id_usr=?",[findads[0].Id_usr_ads])
                        if (User.lenght ===  1 && User[0] !== undefined){
                           if (User[0].Id_line_usr != 0){
                                const SendToUserAds = [{
                                    type: 'text',
                                    text: `คุณ ${finduser[0].UserName_usr} ได้ทำการชำระเงิน จำนวน ${findorder[0].Pricetotal_paysuccess} บาท order เลขที่ ${findorder[0].Id_order_paysuccess} เรียบร้อยแล้ว`
                                }]
                                const sendm = await client.pushMessage(User[0].Id_line_usr, SendToUserAds)
                                res.send("allow ads success")
                           }else{
                                res.send("allow ads success")
                           }
                        }else{
                            res.send("allow ads success")
                        }
                    } else if (findads.lenght === 0) {
                        res.send("this ads don't have in data")
                    } else {
                        res.send("something wrong")
                    }
                } else if (checkadmin.lenght === 0) {
                    res.send('this user is not admin')
                } else {
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



module.exports = { registeradvertising, allowads }



