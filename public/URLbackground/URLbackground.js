const dbsync = require("D:/react_project/ppap/config/datasync")
const line = require("@line/bot-sdk")
const dotenv = require("dotenv")
dotenv.config()
// const { totalprice } = require("../creditpayment/creditpayment")
const { checkpromotion } = require("../totalmenuorder/totalmenuorder")
const { addmenu } = require("../../shop/addmenu/addmenu")
const { user } = require("../../config/config")
const e = require("express")

const client = new line.Client({
    channelAccessToken: process.env.Longlivedtoken,
    channelSecret: process.env.Channelsecret
})





const URLbackground = async (req, res) => {
    try {
        const TransactionId = req.body.TransactionId
        const Amount = req.body.Amount
        const OrderNo = req.body.OrderNo
        const CustomerId = req.body.CustomerId
        const BankCode = req.body.BankCode
        const Paymentstatus = req.body.PaymentStatus
        const PaymentDescription = req.body.PaymentDescription
        const Currency = req.body.Currency
        // console.log(req.body)
        if (TransactionId !== undefined && Amount !== undefined && OrderNo !== undefined && CustomerId !== undefined && BankCode !== undefined && Paymentstatus !== undefined && PaymentDescription !== undefined && Currency !== undefined) {
            if (PaymentDescription === "payment order") {
                if (Paymentstatus === '0') {
                    const [finduser] = await dbsync.execute("SELECT Id_usr,UserName_usr,Id_line_usr FROM users WHERE UserName_usr=?", [CustomerId])
                    if (finduser.length == 1) {
                        const [findorder] = await dbsync.execute("SELECT * FROM paysuccess WHERE Id_order_paysuccess=?", [OrderNo])
                        const [shop] = await dbsync.execute("SELECT UserName_shop,Name_shop FROM profileshop WHERE Id_shop=?",[findorder[0].Id_shop_paysucess])
                        if (findorder.length == 1) {
                            const checknewpromotionorder = await findmenuorderpromotion(OrderNo, findorder[0].Id_shop_paysucess, finduser[0].UserName_usr)
                            if (checknewpromotionorder == 'success') {
                                await dbsync.execute("UPDATE paysuccess SET Status_paysuccess=1 WHERE Id_order_paysuccess=?", [OrderNo])
                                await dbsync.execute("UPDATE addorder SET Status_addor=? WHERE Id_usr_addor=? AND Idorder_addor=?", ["2", finduser[0].Id_usr, OrderNo])
                                await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["Softrock", `คุณ ${finduser[0].UserName_usr} ได้ทำการชำระเงิน จำนวน ${findorder[0].Pricetotal_paysuccess} บาท order เลขที่ ${findorder[0].Id_order_paysuccess} เรียบร้อยแล้ว`, 82, 'Softrock', findorder[0].Id_usr_paysuccess, findorder[0].Id_order_paysuccess, 1])
                                // await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["Softrock", `Order เลขที่ ${findorder[0].Id_order_paysuccess} จำนวนเงิน ${findorder[0].Pricetotal_paysuccess} บาท ได้ทำการชำระเรียบร้อยแล้ว`, 82, 'Softrock', findorder[0].Id_shop_paysucess, findorder[0].Id_order_paysuccess, 1])
                                if (finduser[0].Id_line_usr !== 0){
                                    const sms = [{
                                        type: 'text',
                                        text: `คุณ ${finduser[0].UserName_usr} ได้ทำการชำระเงิน จำนวน ${findorder[0].Pricetotal_paysuccess} บาท order เลขที่ ${findorder[0].Id_order_paysuccess} เรียบร้อยแล้ว`
                                    }]
                                    const sendm = await client.pushMessage(finduser[0].Id_line_usr, sms)
                                    const [FindOwnShop] = await dbsync.execute("SELECT Id_usr,Id_line_usr FROM users WHERE UserName_usr=?",[shop[0].UserName_shop]) // Send to Own Shop 
                                    if (FindOwnShop.length == 1){
                                        if (FindOwnShop[0].Id_line_usr != 0){
                                            const SendtoOwnshop = [{
                                                type: 'text',
                                                text: `มีลูกค้า ${finduser[0].UserName_usr} ได้ทำการชำระเงิน จำนวน ${findorder[0].Pricetotal_paysuccess} บาท order เลขที่ ${findorder[0].Id_order_paysuccess} เรียบร้อยแล้ว`
                                            }]
                                            const sendm = await client.pushMessage(FindOwnShop[0].Id_line_usr, SendtoOwnshop)
                                            await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["Softrock", `มีลูกค้า ${finduser[0].UserName_usr} ได้ทำการชำระเงิน จำนวน ${findorder[0].Pricetotal_paysuccess} บาท order เลขที่ ${findorder[0].Id_order_paysuccess} เรียบร้อยแล้ว`, 82, 'Softrock', FindOwnShop[0].Id_usr, findorder[0].Id_order_paysuccess, 1])
                                            const [Finduser] = await dbsync.execute("SELECT Id_line_usr FROM users WHERE Id_usr=?",[findorder[0].Id_usr_paysuccess])
                                            if (Finduser.length === 1 && Finduser[0] !== undefined){
                                                if (Finduser[0].Id_line_usr != 0){
                                                    const SendtoUser = [{
                                                        type: 'text',
                                                        text: `คุณ ${finduser[0].UserName_usr} ได้ทำการชำระเงิน จำนวน ${findorder[0].Pricetotal_paysuccess} บาท order เลขที่ ${findorder[0].Id_order_paysuccess} เรียบร้อยแล้ว`
                                                    }]
                                                    const sendm = await client.pushMessage(Finduser[0].Id_line_usr, SendtoUser)
                                                    res.status(200).send("success")   
                                                }else{
                                                    res.status(200).send("success")   
                                                }
                                            }else{
                                                res.status(200).send("success")   
                                            }
                                        }else{
                                            res.status(200).send("success")
                                        }
                                    }else{
                                        res.status(200).send("success")
                                    }
                                }else{
                                    res.status(200).send("success")
                                }
                            } else if (checknewpromotionorder == "something wrong") {
                               await dbsync.execute("DELETE FROM paysuccess WHERE Id_order_paysuccess=?", [OrderNo])
                               await dbsync.execute("DELETE FROM addorder WHERE Idorder_addor=?",[OrderNo])
                               await dbsync.execute("UPDATE addorder SET Status_addor=? WHERE Id_usr_addor=? AND Idorder_addor=?", ["0", finduser[0].Id_usr, OrderNo])
                                res.send("something wrong")
                            } else if (checknewpromotionorder == "you don't have order in data") {
                                await dbsync.execute("DELETE FROM paysuccess WHERE Id_order_paysuccess=?", [OrderNo])
                                await dbsync.execute("DELETE FROM addorder WHERE Idorder_addor=?",[OrderNo])
                                await dbsync.execute("UPDATE addorder SET Status_addor=? WHERE Id_usr_addor=? AND Idorder_addor=?", ["0", finduser[0].Id_usr, OrderNo])
                                res.send("something wrong")
                            } else if (checknewpromotionorder == "you don't have user in data") {
                                await dbsync.execute("DELETE FROM paysuccess WHERE Id_order_paysuccess=?", [OrderNo])
                                await dbsync.execute("DELETE FROM addorder WHERE Idorder_addor=?",[OrderNo])
                                await dbsync.execute("UPDATE addorder SET Status_addor=? WHERE Id_usr_addor=? AND Idorder_addor=?", ["0", finduser[0].Id_usr, OrderNo])
                                res.send("something wrong")
                            } else if (checknewpromotionorder == "have some error") {
                                // const [updatestatuspaysuccess] = await dbsync.execute("UPDATE paysuccess SET Status_paysuccess=0 WHERE Id_order_paysuccess=?", [OrderNo])
                                await dbsync.execute("DELETE FROM paysuccess WHERE Id_order_paysuccess=?", [OrderNo])
                                await dbsync.execute("DELETE FROM addorder WHERE Idorder_addor=?",[OrderNo])
                                await dbsync.execute("UPDATE addorder SET Status_addor=? WHERE Id_usr_addor=? AND Idorder_addor=?", ["0", finduser[0].Id_usr, OrderNo])
                                res.send("something wrong")
                            }
                        } else {
                            res.send("something wrong")
                        }
                    } else if (finduser.length == 0) {
                        res.send("something wrong with send user to payment")
                    } else {
                        res.send("something wrong")
                    }
                } else {
                    await dbsync.execute("UPDATE addorder SET Status_addor=0 WHERE Status_addor=?", ["1"])
                    res.send("something wrong")
                }
            }else if (PaymentDescription === "payment advertising"){
                if (Paymentstatus === '0'){
                    const [findadvertising] = await dbsync.execute("SELECT * FROM advertising WHERE Order_ads=?",[OrderNo])
                    const [shop] = await dbsync.execute("SELECT Name_shop FROM profileshop WHERE Id_shop=?",[findorder[0].Id_shop_paysucess])
                    // console.log(findadvertising.length)
                    if (findadvertising.length === 1){
                        const [updatestatus] = await dbsync.execute("UPDATE advertising SET Status_ads=1 WHERE Order_ads=?",[OrderNo])
                        await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["Softrock" `Advertising successfully`, findadvertising[0].Id_shop_ads, 'softrock', findadvertising[0].Id_usr_ads, OrderNo, 1])
                        // do next 
                        const [User] = await dbsync.execute("SELECT Id_line_usr FROM users WHERE Id_usr=?",[findadvertising[0].Id_usr_ads])
                        if (User.length === 1){
                            if (User[0].Id_line_usr !== 0){
                                const sms = [{
                                    type: 'text',
                                    text: `การชำระเงินค่าโฆษณาของท่านสำเร็จ`
                                }]
                                const sendm = await client.pushMessage(User[0].Id_line_usr, sms)
                                res.status(200).send("success")
                            }else{
                                res.status(200).send("success")
                            }
                        }else{
                            res.status(200).send("success")
                        }
                    }else{
                        res.send("something wrong")
                    }
                }else{
                    res.send("something wrong with send user to payment")
                }
            }else{
                res.send9("something wrong")
            }
        } else {
            res.send()
        }
    } catch (err) {
        if (err) {
            console.log(err)
            res.status(500).send("have some error")
        }
    }
}
const findmenuorderpromotion = async (Idorder, Idshop, UserName) => {
    try {
        Idorder = parseInt(Idorder)
        Idshop = parseInt(Idshop)
        if (isNaN(Idorder) !== true && isNaN(Idshop) !== true) {
            const [findusername] = await dbsync.execute("SELECT * FROM users WHERE UserName_usr=?", [UserName])
            if (findusername.length === 1) {
                const usertotalprice = await addmenupromotion(UserName)
                // console.log(usertotalprice)
                if (typeof usertotalprice === 'object') {
                    const checkoriginalprice = usertotalprice.findIndex(x => x.originalprice !== undefined)
                    const checkdiscountprice = usertotalprice.findIndex(x => x.discountprice !== undefined)
                    const checksumprice = usertotalprice.findIndex(x => x.sumprice !== undefined)
                    if (checkoriginalprice > -1 && checkdiscountprice > -1 && checksumprice > -1) {
                        const [checkshop] = await dbsync.execute("SELECT * FROM profileshop WHERE Id_shop=?", [Idshop])
                        if (checkshop.length == 1) {
                            for (let i = 0; i < usertotalprice.length; i++) {
                                if (checkoriginalprice !== i && checkdiscountprice !== i && checksumprice !== i) {
                                    if (usertotalprice[i].Idorder !== undefined && usertotalprice[i].Idmenu !== undefined && usertotalprice[i].Pricemenu !== undefined && usertotalprice[i].Picmenu !== undefined && usertotalprice[i].Namemenu !== undefined && usertotalprice[i].Subjectandioption !== undefined && usertotalprice[i].access !== undefined && usertotalprice[i].oldornewvalue !== undefined) {
                                        if (usertotalprice[i].oldornewvalue == 'new') {
                                            const [findmenu] = await dbsync.execute("SELECT * FROM addmenu WHERE Id_shop_menu=? AND Name_menu=?", [Idshop, usertotalprice[i].Namemenu])
                                            if (findmenu.length == 1) {
                                                const [insertmenuorder] = await dbsync.execute("INSERT INTO addorder (Id_menu_addor,Id_usr_addor,Id_shop_addor,Name_menu_addor,Lat_addor,Long_addor,Quantity_addor,Comment_addor,random_num_addor,Status_addor,Idorder_addor) VALUES (?,?,?,?,?,?,?,?,?,?,?)", [findmenu[0].Id_menu, findusername[0].Id_usr, checkshop[0].Id_shop, findmenu[0].Name_menu, 0, 0, 1, "-", 0, "1", Idorder])
                                                if (i == usertotalprice.length - 1) {
                                                    let sumpriceforcheckstar = usertotalprice[checksumprice].sumprice
                                                    if (typeof sumpriceforcheckstar == "number") {
                                                        let givestar = sumpriceforcheckstar / 50
                                                        let floornumberstar = Math.floor(givestar)
                                                        // const totalstar = floornumberstar + findusername[0].Star_usr
                                                        // console.log(findusername[0].Star_usr)

                                                        // const [updatestar] = await dbsync.execute("UPDATE users SET Star_usr=? WHERE UserName_usr=? ", [totalstar, findusername[0].UserName_usr])
                                                        const [logstar] = await dbsync.execute("INSERT INTO star_log (Id_shop_starlog,Id_usr_starlog,Id_order_starlog,Amount_starlog,Price_starlog,Status_starlog) VALUES (?,?,?,?,?,0)", [Idshop, findusername[0].Id_usr,Idorder, floornumberstar, usertotalprice[checksumprice].sumprice])
                                                        return "success"
                                                    } else {
                                                        return "success"
                                                    }
                                                }
                                            } else {
                                                if (i == usertotalprice.length - 1) {
                                                    let sumpriceforcheckstar = usertotalprice[checksumprice].sumprice
                                                    if (typeof sumpriceforcheckstar == "number") {
                                                        let givestar = sumpriceforcheckstar / 50
                                                        let floornumberstar = Math.floor(givestar)
                                                        // const totalstar = floornumberstar + findusername[0].Star_usr
                                                        // console.log(findusername[0].Star_usr)

                                                        // const [updatestar] = await dbsync.execute("UPDATE users SET Star_usr=? WHERE UserName_usr=? ", [totalstar, findusername[0].UserName_usr])
                                                        const [logstar] = await dbsync.execute("INSERT INTO star_log (Id_shop_starlog,Id_usr_starlog,Id_order_starlog,Amount_starlog,Price_starlog,Status_starlog) VALUES (?,?,?,?,?,0)", [Idshop, findusername[0].Id_usr,Idorder, floornumberstar, usertotalprice[checksumprice].sumprice])
                                                        return "success"
                                                    } else {
                                                        return "success"
                                                    }
                                                }
                                            }
                                        } else if (usertotalprice[i].oldornewvalue == 'old') {
                                            if (i == usertotalprice.length - 1) {
                                                let sumpriceforcheckstar = usertotalprice[checksumprice].sumprice
                                                if (typeof sumpriceforcheckstar == "number") {
                                                    let givestar = sumpriceforcheckstar / 50
                                                    let floornumberstar = Math.floor(givestar)
                                                    // const totalstar = floornumberstar + findusername[0].Star_usr
                                                    // console.log(findusername[0].Star_usr)

                                                    // const [updatestar] = await dbsync.execute("UPDATE users SET Star_usr=? WHERE UserName_usr=? ", [totalstar, findusername[0].UserName_usr])
                                                    const [logstar] = await dbsync.execute("INSERT INTO star_log (Id_shop_starlog,Id_usr_starlog,Id_order_starlog,Amount_starlog,Price_starlog,Status_starlog) VALUES (?,?,?,?,?,0)", [Idshop, findusername[0].Id_usr,Idorder, floornumberstar, usertotalprice[checksumprice].sumprice])
                                                    return "success"
                                                } else {
                                                    return "success"
                                                }
                                            }
                                        } else {
                                            if (i == usertotalprice.length - 1) {
                                                let sumpriceforcheckstar = usertotalprice[checksumprice].sumprice
                                                if (typeof sumpriceforcheckstar == "number") {
                                                    let givestar = sumpriceforcheckstar / 50
                                                    let floornumberstar = Math.floor(givestar)
                                                    // const totalstar = floornumberstar + findusername[0].Star_usr
                                                    // console.log(findusername[0].Star_usr)
                                                    // const [updatestar] = await dbsync.execute("UPDATE users SET Star_usr=? WHERE UserName_usr=? ", [totalstar, findusername[0].UserName_usr])
                                                    const [logstar] = await dbsync.execute("INSERT INTO star_log (Id_shop_starlog,Id_usr_starlog,Id_order_starlog,Amount_starlog,Price_starlog,Status_starlog) VALUES (?,?,?,?,?,0)", [Idshop, findusername[0].Id_usr,Idorder, floornumberstar, usertotalprice[checksumprice].sumprice])
                                                    return "success"
                                                } else {
                                                    return "success"
                                                }
                                            }
                                        }
                                    } else {
                                        return "something wrong"
                                    }
                                } else {
                                    if (i == usertotalprice.length - 1) {
                                        let sumpriceforcheckstar = usertotalprice[checksumprice].sumprice
                                        if (typeof sumpriceforcheckstar == "number") {
                                            let givestar = sumpriceforcheckstar / 50
                                            let floornumberstar = Math.floor(givestar)
                                            // const totalstar = floornumberstar + findusername[0].Star_usr
                                            // console.log(findusername[0].Star_usr)
                                            // const [updatestar] = await dbsync.execute("UPDATE users SET Star_usr=? WHERE UserName_usr=? ", [totalstar, findusername[0].UserName_usr])
                                            const [logstar] = await dbsync.execute("INSERT INTO star_log (Id_shop_starlog,Id_usr_starlog,Id_order_starlog,Amount_starlog,Price_starlog) VALUES (?,?,?,?,?)", [Idshop, findusername[0].Id_usr,Idorder, floornumberstar, usertotalprice[checksumprice].sumprice])
                                            return "success"
                                        } else {
                                            return "success"
                                        }
                                    }
                                }
                            }
                        } else {
                            return "something wrong"
                        }
                    } else {
                        return "something wrong"
                    }

                } else if (usertotalprice === "you don't have order in data") {
                    return "you don't have order in data"
                } else if (usertotalprice === "you don't have user in data") {
                    return "you don't have user in data"
                } else if (usertotalprice === "have some error") {
                    return "have some error"
                } else {
                    return "something wrong"
                }
            } else {
                return "something wrong"
            }
        } else {
            return "something wrong"
        }
    } catch (err) {
        if (err.message === "sendtotalprice.findIndex is not a function") {
            console.log(err.message)
            return "you don't have order in data"
        } else {
            console.log(err)
            return "have some error "
        }
    }


}
const addmenupromotion = async (UserName) => {
    try {
        const [checkuser] = await dbsync.execute("SELECT Id_usr FROM users WHERE UserName_usr=? AND Status_usr != 0", [UserName])
        if (checkuser.length == 1) {
            const [checkorder] = await dbsync.execute("SELECT Id_addor,Id_menu_addor,Id_shop_addor,Name_menu_addor,Quantity_addor,Comment_addor  FROM addorder WHERE Id_usr_addor=? AND Status_addor=?", [checkuser[0].Id_usr, "1"])
            if (checkorder.length > 0) {
                let allsumpricemenu = 0
                let allvalue = []
                let valueoptionforkeep = []
                let valuesubjectandoption = []
                for (let i = 0; i < checkorder.length; i++) {
                    const [getpricemenu] = await dbsync.execute("SELECT Pic_menu,Price_menu FROM addmenu WHERE Id_menu=?", [checkorder[i].Id_menu_addor])
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
                                        allvalue.push({ sumprice: allsumpricemenu })
                                        // console.log(allvalue.length)
                                        const sendpromotion = await checkpromotion(allvalue, checkuser[0].Id_usr, checkorder[i].Id_addor)
                                        // console.log(sendpromotion)
                                        if (typeof sendpromotion === 'object') {
                                            return sendpromotion
                                        } else if (sendpromotion == 'no') {
                                            // console.log("whhh")
                                            return 'something wrong'
                                        } else if (sendpromotion === "have some err") {
                                            return "have some errpr"
                                        } else {
                                            return "somthing wrong"
                                        }
                                        // res.json(sendpromotion)
                                        // res.send(allvalue)
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
                                    allvalue.push({ sumprice: allsumpricemenu })
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
                    // if (i == checkorder.length-1){
                    //     res.send(allvalue)
                    // }
                }
            } else if (checkorder.length == 0) {
                return "you don't have order in data"
            } else {
                return "something wrong"
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


module.exports = { URLbackground,findmenuorderpromotion }


//json send from chllpay
// {
//     TransactionId: '159144',
//     Amount: '27500',
//     OrderNo: '22646130046',
//     CustomerId: 'ppapa',
//     BankCode: 'creditcard',
//     PaymentDate: '20221228182935',
//     PaymentStatus: '0',
//     BankRefCode: '638078',
//     CurrentDate: '20221228',
//     CurrentTime: '182935',
//     PaymentDescription: '',
//     CreditCardToken: '',
//     Currency: '764',
//     CustomerName: '',
//     CheckSum: '85eb19dea02ad9a20ff678882abb3952'
//   }