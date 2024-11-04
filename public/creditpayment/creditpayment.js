const dbsync = require("D:/react_project/ppap/config/datasync")
const ms = require("@moneyspace.net/moneyspace-node-js-sdk")
const os = require("os")
const path = require("path")
const uuid = require("uuid")
const md5 = require("md5")
const random = require("random")
const line = require("@line/bot-sdk")
const dotenv = require("dotenv")
const { json } = require("express")
const fetch = require("node-fetch")
const { createGunzip } = require("zlib")
const { isAsyncFunction } = require("util/types")
const {findmenuorderpromotion} = require("../../public/URLbackground/URLbackground")
const { checkpromotion } = require("../../public/totalmenuorder/totalmenuorder")
const { resolveSoa } = require("dns")
const { closeshop } = require("../../shop/closeshoporopenshop/closeshoporopenshop")
const { rmSync } = require("fs")
const { syncBuiltinESMExports } = require("module")
const { findshopmenorder } = require("../../shop/findorder/Findorder")
const { resolveObjectURL } = require("buffer")
dotenv.config()

const client = new line.Client({
    channelAccessToken: process.env.Longlivedtoken,
    channelSecret: process.env.Channelsecret
})


// money space payment  
const credit1 = async (req, res) => {
    try {
        const api = ms.createMoneySpace({
            credentials: ms.createSimpleCredentialsProvider("281b059a0d2e4b57a837252d89de7b6b", "e75c28d544e24e14a5101996fa3be6b3"),
            successUrl: 'https://www.moneyspace.net/merchantapi/paycardsuccess',
            cancelUrl: 'https://www.moneyspace.net?status=cancel',
            failUrl: 'https://www.moneyspace.net?status=fail'
        })
        // console.log(api)
        // res.json(api)
        const merchantapi = api.merchantApi
        const response = await merchantapi.sendPaymentTransaction({
            amount: '0.25',
            customerOrderId: uuid.v4().substring(0, 10),
            firstName: 'ทดสอบ',
            lastName: 'ระบบ',
            gatewayType: "qrnone",
            productDescription: 'Ice cream'
        })
        res.send(response)
    } catch (err) {
        if (err)
            console.log(err)
        res.send("have some error")
    }
}
// test payment chillpay
// but now i think maybe it's just a test in this function
const credit = async (req, res) => {
    const ppnja = md5("AirPods ProAirPodsPro XXX01/10/2021 11:05:0612/12/2022 11:05:06THB8992001VfDXcLkoxEnL3A3Vb4enr1dkdvnpKswGVYDt5WwHTiI3nSLUVdYI0hWy0Aw3omQSyRjnwYzUwzCs0MlopsrsqCFN3B0wTu12zxAb6vee41RCiaoI4jUF3tZTc8bQWZNsm4MQtjAIb0yXa1E9OjFv9p78Rn9yMLwi8JYL")
    const url = "https://sandbox-apipaylink.chillpay.co/api/v1/paylink/generate"
    const option = {
        method: "POST",
        headers: {
            "CHILLPAY-MerchantCode": "M033547",
            "CHILLPAY-ApiKey": "sOK96RSrVZzKEUDIHCGFZrqfkNQ3a6ZURtmAnwQYSKDaLkmx0R1py6gr7gPyHMpB",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "ProductName": "AirPods Pro",
            "ProductDescription": "AirPodsPro XXX",
            "StartDate": "01/10/2021 11:05:06",
            "ExpiredDate": "12/12/2022 11:05:06",
            "Currency": "THB",
            "Amount": "899200",
            "CheckSum": ppnja
        })
    }
    const response = await fetch(url, option)
    const data = await response.json()
    res.json(data)
    // console.log(data)
    // fetch(url, option)
    //     .then((response) => response.json())
    //     .then((data) => {
    //         console.log(data)
    //         res.send(data)
    //     });
}
// amounttakefood have some problem 
// this main function payment to chillpay 
const sendtochillpay = async (req, res) => {
    try {
        // varible must to require
        const Merchantcode = process.env.MerchantCode
        const OrderId = random.int(10000000000, 99999999999)
        const Username = req.body.Username
        const Ipaddress = req.body.Ipaddress
        const Chanelcode = req.body.Chanelcode
        // if user send Chanelcode = credit point you must to change chanel payment 
        const Currency = "764"
        const RouteNo = "1"
        const Description = "payment order"
        let Star = req.body.Star
        // console.log(Star)
        // edit later 
        const Amounttakefood = req.body.Amounttakefood
        const Placetakefood = req.body.Placetakefood
        const Datewanttogo = req.body.Datewanttogo
        const Amounttakecheck = ["กลับบ้าน", "ทานที่ร้าน"]
        const testsomething = ["internetbank_bay", "internetbank_bbl", "internetbank_scb", "internetbank_ktb", "internetbank_ttb", "payplus_kbank", "mobilebank_scb", "mobilebank_bay", "mobilebank_bbl", "creditcard", "epayment_alipay", "epayment_wechatpay", "epayment_linepay", "epayment_truemoney", "epayment_shopeepay", "Installment_kbank", "installment_krungsri", "installment_firstchoice", "installment_scb"]

        const ApiKey = process.env.ApiKey
        const url = "https://sandbox-appsrv2.chillpay.co/api/v2/Payment/"
        if (Username !== undefined && Ipaddress !== undefined && Chanelcode !== undefined && Amounttakefood !== undefined && Placetakefood !== undefined && Datewanttogo !== undefined && isNaN(Star) !== true) {
            const checkDate = await checkDatewanttogo(Datewanttogo)
            if (typeof checkDate === 'string') {
                if (Amounttakefood > "0") {
                    const findindex = Amounttakecheck.findIndex((e) => e === Placetakefood)
                    if (findindex > -1) {
                        const [finduser] = await dbsync.execute("SELECT Id_usr,UserName_usr,Total_payment_usr FROM users WHERE UserName_usr=?", [Username])
                        if (finduser.length === 1) {
                            const findindexchanelcode = testsomething.findIndex(x => x === Chanelcode)
                            if (findindexchanelcode > -1) {
                                const sendtotalprice = await totalprice(Username, Star)
                                // && checksumprice > -1
                                // console.log(Checksome)
                                if (typeof sendtotalprice === 'object') {
                                    const checksumprice = sendtotalprice.findIndex(x => x.sumprice !== undefined)
                                    if (checksumprice > -1) {
                                        const Checksome = md5(`${Merchantcode}${OrderId}${Username}${sendtotalprice[checksumprice].sumprice * 100}${Description}${Chanelcode}${Currency}${RouteNo}${Ipaddress}${ApiKey}${process.env.MD5Key}`)
                                        const option = {
                                            method: "POST",
                                            headers: {
                                                "Cache-Control": "no-cache",
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify({
                                                "MerchantCode": process.env.MerchantCode,
                                                "OrderNo": `${OrderId}`,
                                                "CustomerId": Username,
                                                "Amount": sendtotalprice[checksumprice].sumprice * 100,
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
                                        if (data.Status == 0) {
                                            // console.log(data)
                                            await dbsync.execute(`UPDATE addorder SET Idorder_addor=${OrderId},Status_addor=1 WHERE Status_addor=0 AND Id_usr_addor=?`, [finduser[0].Id_usr])
                                            const [findshopinorder] = await dbsync.execute("SELECT Id_shop_addor FROM addorder WHERE Idorder_addor=?", [OrderId])
                                            if (findshopinorder.length >= 1) {
                                                await dbsync.execute("INSERT INTO paysuccess (Id_order_paysuccess,Transaction_id_log,Id_shop_paysucess,Id_usr_paysuccess,UserName_usr_paysuccess,Pricetotal_paysuccess,Star_use_paysuccess,Amountpeople_paysuccess,Placetakefood_paysuccess,Status_paysuccess,Datewanttogo_paysuccess) VALUES (?,?,?,?,?,?,?,?,?,?,?) ", [OrderId, data.TransactionId, findshopinorder[0].Id_shop_addor, finduser[0].Id_usr, Username, sendtotalprice[checksumprice].sumprice,star, Amounttakefood, Placetakefood, 0, checkDate])
                                                res.json(data)
                                            } else {
                                                res.send("you don't have order in data")
                                            }
                                            // res.json(data)
                                        } else if (data.Status != 0) {
                                            res.send("maybe you something wrong")
                                        } else {
                                            res.send("have some error")
                                        }
                                    } else{
                                        res.send("something wrong")
                                    }
                                    // res.json(data.Status)
                                } else if (sendtotalprice === "you don't have order in data") {
                                    // console.log("sss")
                                    res.send("you don't have order in data")
                                } else if (sendtotalprice === "you don't have user in data") {
                                    res.send("you don't have user in data")
                                } else if (sendtotalprice === 'your star in data less than star you want to use') {
                                    res.send("your star in data less than star you want to use")
                                } else if (sendtotalprice === "have some error") {
                                    res.send("have some error")
                                } else if (sendtotalprice === 'your star must to be a number') {
                                    res.send("your star must to be a number")
                                } else {
                                    res.send("something wrong")
                                }
                            }else if (Chanelcode == "credit point") {
                                const sendtotalprice = await totalprice(Username, Star)
                                if (typeof sendtotalprice === 'object') {
                                    const checksumprice = sendtotalprice.findIndex(x => x.sumprice !== undefined)
                                    if (checksumprice > -1) {
                                        if (sendtotalprice[checksumprice].sumprice <= finduser[0].Total_payment_usr) {
                                            await dbsync.execute(`UPDATE addorder SET Idorder_addor=?,Status_addor=1 WHERE Status_addor=0 AND Id_usr_addor=?`, [OrderId,finduser[0].Id_usr])
                                            const [findshopinorder] = await dbsync.execute("SELECT Id_shop_addor FROM addorder WHERE Idorder_addor=?", [OrderId])
                                            if (findshopinorder.length > 0 ){
                                                const checknewpromotionorder = await findmenuorderpromotion(OrderId, findshopinorder[0].Id_shop_addor, finduser[0].UserName_usr)
                                                if (checknewpromotionorder  === "success"){
                                                    // console.log("pppp")s
                                                    let Withholdmoney = finduser[0].Total_payment_usr - sendtotalprice[checksumprice].sumprice
                                                    await dbsync.execute("UPDATE users SET Total_payment_usr=? WHERE UserName_usr=?",[Withholdmoney,Username])
                                                    await dbsync.execute(`UPDATE addorder SET Idorder_addor=${OrderId},Status_addor=2 WHERE Status_addor=1 AND Id_usr_addor=?`, [finduser[0].Id_usr])
                                                    await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["Softrock", `คุณ ${Username} ได้ทำการชำระเงิน จำนวน ${sendtotalprice[checksumprice].sumprice} บาท order เลขที่ ${OrderId} เรียบร้อยแล้ว`, 82, 'Softrock', finduser[0].Id_usr, OrderId, 1])
                                                    await dbsync.execute("INSERT INTO paysuccess (Id_order_paysuccess,Transaction_id_log,Id_shop_paysucess,Id_usr_paysuccess,UserName_usr_paysuccess,Pricetotal_paysuccess,Star_use_paysuccess,Amountpeople_paysuccess,Placetakefood_paysuccess,Status_paysuccess,Datewanttogo_paysuccess) VALUES (?,?,?,?,?,?,?,?,?,?,?) ", [OrderId, 0, findshopinorder[0].Id_shop_addor, finduser[0].Id_usr, Username, sendtotalprice[checksumprice].sumprice,star, Amounttakefood, Placetakefood, 1, checkDate])
                                                    const [FindUser] = await dbsync.execute("SELECT UserName_usr,Id_line_usr FROM users WHERE Id_usr=?",[finduser[0].Id_usr])
                                                    if (FindUser.length === 1 && FindUser[0] !== undefined){
                                                        if (FindUser[0].Id_line_usr != 0){
                                                            const SendtoUser = [{
                                                                type: 'text',
                                                                text: `คุณ ${Username} ได้ทำการชำระเงิน จำนวน ${sendtotalprice[checksumprice].sumprice} บาท order เลขที่ ${OrderId} เรียบร้อยแล้ว`
                                                            }]
                                                            const sendm = await client.pushMessage(FindUser[0].Id_line_usr,SendtoUser)
                                                            const [Shop] = await dbsync.execute("SELECT UserName_shop FROM profileshop WHERE Id_shop=?",[findshopinorder[0].Id_shop_addor])
                                                            if (Shop.length === 1 && Shop[0] !== undefined){
                                                                const [FindOwnShop] = await dbsync.execute("SELECT Id_usr,Id_line_usr FROM users WHERE UserName_usr=?",[Shop[0].UserName_shop])
                                                                if (FindOwnShop.length === 1 && FindOwnShop[0] !== undefined){
                                                                    if (FindOwnShop[0].Id_line_usr != 0){
                                                                        const SendtoOwnshop = [{
                                                                            type: 'text',
                                                                            text: `มีลูกค้า ${finduser[0].UserName_usr} ได้ทำการชำระเงิน จำนวน ${sendtotalprice[checksumprice].sumprice} บาท order เลขที่ ${OrderId} เรียบร้อยแล้ว`
                                                                        }]
                                                                        const sendm = await client.pushMessage(FindOwnShop[0].Id_line_usr, SendtoOwnshop)
                                                                        await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["Softrock",`มีลูกค้า ${finduser[0].UserName_usr} ได้ทำการชำระเงิน จำนวน ${sendtotalprice[checksumprice].sumprice} บาท order เลขที่ ${OrderId} เรียบร้อยแล้ว`, 82, 'Softrock', FindOwnShop[0].Id_usr,OrderId, 1])
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
                                                        }else{
                                                            res.send("success")
                                                        }
                                                    }else{
                                                        res.send("success")
                                                    }
                                                    // } else {
                                                //     res.send("you don't have order in data")
                                                // }
                                                // res.send("success")
                                                }else if (checknewpromotionorder === "something wrong"){
                                                    await dbsync.execute(`UPDATE addorder SET Status_addor=1 WHERE Status_addor=0 AND Id_usr_addor=?`, [OrderId,finduser[0].Id_usr])
                                                    res.send("something wrong")
                                                }
                                            }else{
                                                res.send("you don't have order in data")
                                            }
                                           
                                        } else if (sendtotalprice[checksumprice].sumprice > finduser[0].Total_payment_usr) {
                                            res.send("your wallet don't have enough to pay this order")
                                        } else {
                                            res.send("have some error")
                                        }
                                    } else{
                                        res.send("something wrong")
                                    }
                                } else if (sendtotalprice === "you don't have order in data") {
                                    res.send("you don't have order in data")
                                } else if (sendtotalprice === "you don't have user in data") {
                                    res.send("you don't have user in data")
                                } else if (sendtotalprice === 'your star in data less than star you want to use') {
                                    res.send("your star in data less than star you want to use")
                                } else if (sendtotalprice === "have some error") {
                                    res.send("have some error")
                                } else if (sendtotalprice === 'your star must to be a number') {
                                    res.send("your star must to be a number")
                                } else {
                                    res.send("something wrong")
                                }
                            } else {
                                res.send("your Chanelcode is wrong")
                            }
                        } else if (finduser.length === 0) {
                            res.send("you don't have user in data")
                        } else {
                            res.send("something wrong")
                        }
                    } else {
                        res.send("something wrong with your Placetakefood")
                    }
                } else {
                    res.send("Amounttake must have more than 0")
                }
            } else if (checkDate === null) {
                res.send("your date wrong")
            } else {
                res.send("something wrong")
            }
        } else {
            res.send()
        }
    } catch (err) {
        if (err.message === "sendtotalprice.findIndex is not a function") {
            console.log(err.message)
            res.send("you don't have order in data")
        } else {
            console.log(err)
            res.send("have some error ")
        }
    }
}
// this function use for check price and discount star(if user hace star)
const totalprice = async (UserName, Star) => {
    try {
        const [checkuser] = await dbsync.execute("SELECT Id_usr,Star_usr FROM users WHERE UserName_usr=? AND Status_usr != 0", [UserName])
        if (checkuser.length == 1) {
            // console.log("whattt")
            star = parseInt(Star)
            if (isNaN(star) !== true) {
            // console.log(checkuser[0].Id_usr)
                const [checkorder] = await dbsync.execute("SELECT Id_addor,Id_menu_addor,Id_shop_addor,Name_menu_addor,Quantity_addor,Comment_addor  FROM addorder WHERE Id_usr_addor=? AND Status_addor=?", [checkuser[0].Id_usr, "0"])
                // console.log(checkorder.length)
                if (checkorder.length > 0) {
                    if (Star <= checkuser[0].Star_usr) {
                        let allsumpricemenu = 0
                        let allvalue = []
                        let valueoptionforkeep = []
                        let valuesubjectandoption = []
                        for (let i = 0; i < checkorder.length; i++) {
                            const [getpricemenu] = await dbsync.execute("SELECT Pic_menu,Price_menu FROM addmenu WHERE Id_menu=?", [checkorder[i].Id_menu_addor])
                            if (getpricemenu.length === 1){
                                allsumpricemenu += getpricemenu[0].Price_menu
                                const [valuesubject] = await dbsync.execute("SELECT * FROM addordersubject WHERE Id_addor_addorsub=?", [checkorder[i].Id_addor])
                                if (valuesubject.length > 0) {
                                    for (let q = 0; q < valuesubject.length; q++) {
                                        const [valueoption] = await dbsync.execute("SELECT * FROM addorderoption WHERE Id_sub_option_addor=?", [valuesubject[q].Id_sub_addor])
                                        if (valueoption.length > 0) {
                                            for (let p = 0; p < valueoption.length; p++) {
                                                const [priceoption] = await dbsync.execute("SELECT Price_option FROM menu_option WHERE Id_option=?", [valueoption[p].Id_option_addor])
                                                allsumpricemenu += priceoption[0].Price_option
                                                valueoptionforkeep.push({ Nameoption: valueoption[p].Name_option_addor, Priceopiton: valueoption[p].Price_option_addor })
                                                if (p == valueoption.length - 1) {
                                                    valuesubjectandoption.push({ Namesubject: valuesubject[q].Name_sub_addor, Option: valueoption })
                                                    // console.log(valuesubjectandoption)
                                                    valueoptionforkeep = []
                                                }
                                                if (q == valuesubject.length - 1 && p == valueoption.length - 1) {
                                                    // console.log(785)
                                                    allvalue.push({ Idorder: checkorder[i].Id_addor, Idmenu: checkorder[i].Id_menu_addor, Pricemenu: getpricemenu[0].Price_menu, Picmenu: getpricemenu[0].Pic_menu, Namemenu: checkorder[i].Name_menu_addor, Subjectandioption: valuesubjectandoption, access: null, oldornewvalue: "old" })
                                                    valueoptionforkeep = []
                                                    valuesubjectandoption = []
                                                }
                                                if (i == checkorder.length - 1 && q == valuesubject.length - 1 && p == valueoption.length - 1) {
                                                    // const sendcheckpromotion = checkpromotoion(allvalue)
                                                    // allvalue.push({ sumprice: allsumpricemenu })
                                                    allvalue.push({ originalprice: allsumpricemenu })
                                                    allvalue.push({ discountprice: 0 })
                                                    allvalue.push({ sumprice: allsumpricemenu - Number(Star) })
                                                    const minusstar = checkuser[0].Star_usr - Number(star)
                                                    await dbsync.execute("UPDATE users SET Star_usr=? WHERE Id_usr=?", [minusstar, checkuser[0].Id_usr])
                                                    const sendpromotion = await checkpromotion(allvalue, checkuser[0].Id_usr, checkorder[i].Id_addor)
                                                    if (typeof sendpromotion === 'object') {
                                                        return sendpromotion
                                                    } else if (sendpromotion == 'no') {
                                                        return 'something wrong'
                                                    } else if (sendpromotion === "have some err") {
                                                        return "have some errpr"
                                                    } else {
                                                        return "somthing wrong"
                                                    }
                                                }
                                            }
                                        } else {
                                            if (q == valuesubject.length - 1) {
                                                allvalue.push({ Idorder: checkorder[i].Id_addor, Idmenu: checkorder[i].Id_menu_addor, Pricemenu: getpricemenu[0].Price_menu, Picmenu: getpricemenu[0].Pic_menu, Namemenu: checkorder[i].Name_menu_addor, Subjectandioption: valuesubjectandoption, access: null, oldornewvalue: "old" })
                                                valueoptionforkeep = []
                                                valuesubjectandoption = []
                                            }
                                            if (i == checkorder.length - 1 && q == valuesubject.length - 1) {
                                                // allvalue.push({ sumprice: allsumpricemenu })
                                                allvalue.push({ originalprice: allsumpricemenu })
                                                allvalue.push({ discountprice: 0 })
                                                allvalue.push({ sumprice: allsumpricemenu - Number(Star) })
                                                const minusstar = checkuser[0].Star_usr - Number(star)
                                                await dbsync.execute("UPDATE users SET Star_usr=? WHERE Id_usr=?", [minusstar, checkuser[0].Id_usr])
                                                const sendpromotion = await checkpromotion(allvalue, checkuser[0].Id_usr, checkorder[i].Id_addor)
                                                // console.log(sendpromotion)
                                                if (typeof sendpromotion === 'object') {
                                                    return sendpromotion
                                                } else if (sendpromotion == 'no') {
                                                    // console.log("whhh")
                                                    return 'something wrong'
                                                } else if (sendpromotion === "have some err") {
                                                    return "have some error"
                                                } else {
                                                    return "somthing wrong"
                                                }
                                                // res.json(sendpromotion)
                                                // res.send(allvalue)
    
                                            }
                                        }
                                    }
                                } else {
                                    allvalue.push({ Idorder: checkorder[i].Id_addor, Idmenu: checkorder[i].Id_menu_addor, Pricemenu: getpricemenu[0].Price_menu, Picmenu: getpricemenu[0].Pic_menu, Namemenu: checkorder[i].Name_menu_addor, Subjectandioption: null, access: null, oldornewvalue: "old" })
                                    if (i == checkorder.length - 1) {
                                        // allvalue.push({ sumprice: allsumpricemenu })
                                        allvalue.push({ originalprice: allsumpricemenu })
                                        allvalue.push({ discountprice: 0 })
                                        const minusstar = checkuser[0].Star_usr - Number(star)
                                        await dbsync.execute("UPDATE users SET Star_usr=? WHERE Id_usr=?", [minusstar, checkuser[0].Id_usr])
                                        allvalue.push({ sumprice: allsumpricemenu })
                                        const sendpromotion = await checkpromotion(allvalue, checkuser[0].Id_usr, checkorder[i].Id_addor)
                                        // res.json(sendpromotion)
                                        if (typeof sendpromotion === 'object') {
                                            return sendpromotion
                                        } else if (sendpromotion == 'no') {
                                            // console.log("whhh")
                                            return 'something wrong'
                                        } else if (sendpromotion === "have some err") {
                                            return "have some error"
                                        } else {
                                            return "something wrong"
                                        }
                                    }
                                }
                            }else{
                                if (i == checkorder.length - 1) {
                                    // allvalue.push({ sumprice: allsumpricemenu })
                                    allvalue.push({ originalprice: allsumpricemenu })
                                    allvalue.push({ discountprice: 0 })
                                    const minusstar = checkuser[0].Star_usr - Number(star)
                                    await dbsync.execute("UPDATE users SET Star_usr=? WHERE Id_usr=?", [minusstar, checkuser[0].Id_usr])
                                    allvalue.push({ sumprice: allsumpricemenu })
                                    const sendpromotion = await checkpromotion(allvalue, checkuser[0].Id_usr, checkorder[i].Id_addor)
                                    // res.json(sendpromotion)
                                    if (typeof sendpromotion === 'object') {
                                        return sendpromotion
                                    } else if (sendpromotion == 'no') {
                                        // console.log("whhh")
                                        return 'something wrong'
                                    } else if (sendpromotion === "have some err") {
                                        return "have some error"
                                    } else {
                                        return "something wrong"
                                    }
                                }
                            }
                          
                        }
                    } else if (Star > checkuser[0].Star_usr) {
                        return 'your star in data less than star you want to use'
                    } else {
                        return 'something wrong'
                    }
                } else if (checkorder.length == 0) {
                    return "you don't have order in data"
                } else {
                    return "something wrong"
                }
            } else {
                return "your star must to be a number"
            }
        } else if (checkuser.length == 0) {
            return "you don't have user in data"
        } else {
            return "something wrong"
        }


    } catch (err) {
        if (err) {
            console.log(err)
            return "have some error"
        }
    }
}

// for check date and synctag date this parametor by sendtochillpay function
const checkDatewanttogo = async (Datewanttogo) => {
    try {
        const GetfullDate = new Date()
        const dofullyear = `${GetfullDate.getFullYear()}-${GetfullDate.getMonth() + 1}-${GetfullDate.getDate()} ${GetfullDate.getHours()}:${GetfullDate.getMinutes()}:${GetfullDate.getSeconds()}`
        const GetfullDatewanttogo = new Date(Datewanttogo)
        if (isNaN(GetfullDatewanttogo.getFullYear()) !== true && isNaN(GetfullDatewanttogo.getFullYear()) !== true) {
            if (GetfullDatewanttogo.getFullYear() > GetfullDate.getFullYear()) {
                return Datewanttogo
            } else if (GetfullDatewanttogo.getFullYear() == GetfullDate.getFullYear()) {
                if (GetfullDatewanttogo.getMonth() > GetfullDate.getMonth()) {
                    return Datewanttogo
                } else if (GetfullDatewanttogo.getMonth() == GetfullDate.getMonth()) {
                    if (GetfullDatewanttogo.getDate() > GetfullDate.getDate()) {
                        return Datewanttogo
                    } else if (GetfullDatewanttogo.getDate() == GetfullDate.getDate()) {
                        if (GetfullDatewanttogo.getHours() > GetfullDate.getHours()) {
                            return Datewanttogo
                        } else if (GetfullDatewanttogo.getHours() == GetfullDate.getHours()) {
                            if (GetfullDatewanttogo.getMinutes() >= GetfullDate.getMinutes()) {
                                return Datewanttogo
                            } else {
                                return dofullyear
                            }
                        } else {
                            return null
                        }
                    } else {
                        return null
                    }
                } else {
                    return null
                }
            } else {
                return null
            }
        }
    } catch (err) {
        if (err) {
            console.log(err)
            return 'have some error'
        }
    }
}

module.exports = { credit, sendtochillpay, totalprice }


// memory of my mistake 

// const p = new Date()
// const ip = 555
// const realdate = `${ip}/${ip}/${ip} `




