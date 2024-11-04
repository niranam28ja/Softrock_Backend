const dbsync = require("D:/react_project/ppap/config/datasync")
const dotenv = require("dotenv")
const line = require("@line/bot-sdk")
const random = require('random')
const { updateTotalwithdraw } = require("../../users/doneorder/Doneorder")
// const e = require("express")
dotenv.config()

const client = new line.Client({
    channelAccessToken: process.env.Longlivedtoken,
    channelSecret: process.env.Channelsecret
})




const addorder = async (req, res) => {
    try {
        const Option = req.body.Option
        // let Option = [{ Subject: { idsubject: 92, namesubject: "eiei", option: [{ Idoption: 104, Nameoption: "mid", Priceoption: 0 }] } }, { Subject: { idsubject: 94, namesubject: "eiei2", option: [{ Idoption: 112, Nameoption: "lows", Priceoption: 0 }] } }, { Subject: { idsubject: 96, namesubject: "eiei3", option: [{ Idoption: 118, Nameoption: "detail1", Priceoption: 0 }] } }, { Subject: { idsubject: 96, namesubject: "eiei3", option: [{ Idoption: 119, Nameoption: "detail2", Priceoption: 0 }] } }, { Subject: { idsubject: 99, namesubject: "eiei4", option: [{ Idoption: 129, Nameoption: "ab2", Priceoption: 0 }] } }, { Subject: { idsubject: 99, namesubject: "eiei4", option: [{ Idoption: 130, Nameoption: "ab3", Priceoption: 0 }] } }]
        let Quantity = req.body.Quantity
        let Idshop = req.body.Idshop
        const Nameshop = req.body.Nameshop
        let Idmenu = req.body.Idmenu
        const Namemenu = req.body.Namemenu
        let Iduser = req.body.Iduser
        const Username = req.body.Username
        let Lat = req.body.Lat
        let Long = req.body.Long
        const Comment = req.body.Comment
        const status = 0
        // console.log(typeof Option)
        // console.log(Option.length)
        // Option = JSON.stringify(Option)
        // JSON.stringify(Option)
        // [{Idoption:"123",Nameoption:"ophsdf",Priceoption:"5"},{Idoption:"859",Nameoption:"skdgflb",Priceoption:"20"}]
        if (Option !== undefined && Quantity !== undefined && Idshop !== undefined && Nameshop !== undefined && Idmenu !== undefined && Namemenu !== undefined && Iduser !== undefined && Username !== undefined && Lat !== undefined && Long !== undefined && Comment !== undefined) {
            Quantity = parseInt(Quantity)
            Idshop = parseInt(Idshop)
            Idmenu = parseInt(Idmenu)
            Iduser = parseInt(Iduser)
            Lat = parseFloat(Lat)
            Long = parseFloat(Long)
            if (isNaN(Quantity) !== true && isNaN(Idshop) !== true && isNaN(Idmenu) !== true && isNaN(Iduser) !== true && isNaN(Lat) !== true && isNaN(Long) !== true) {
                const [finduser] = await dbsync.execute("SELECT Id_usr,UserName_usr FROM users WHERE Id_usr=? AND UserName_usr=? AND status_usr <> 0", [Iduser, Username])
                if (finduser.length == 1) {
                    const [findshop] = await dbsync.execute("SELECT Id_shop,Name_shop FROM profileshop WHERE Id_shop=? AND Name_shop=? AND Status_shop=1 ", [Idshop, Nameshop])
                    if (findshop.length == 1) {
                        const [findmenu] = await dbsync.execute("SELECT Id_menu,Name_menu,Pic_menu,Price_menu,Time_menu FROM addmenu WHERE Id_menu=? AND Id_shop_menu=? AND Name_menu=?", [Idmenu, Idshop, Namemenu])
                        if (findmenu.length == 1) {
                            const randomint = random.int(100000, 999999)
                            const [addmenuorder] = await dbsync.execute("INSERT INTO addorder (Id_menu_addor,Id_usr_addor,Id_shop_addor,Name_menu_addor,Lat_addor,Long_addor,Quantity_addor,Comment_addor,random_num_addor,Status_addor) VALUES (?,?,?,?,?,?,?,?,?,0)", [Idmenu, Iduser, Idshop, Namemenu, Lat, Long, Quantity, Comment, randomint])
                            const [showmenuor] = await dbsync.execute("SELECT Id_addor FROM addorder WHERE Id_menu_addor=? AND Id_usr_addor=? AND random_num_addor=?", [Idmenu, Iduser, randomint])
                            if (typeof Option === 'string') {
                                const decode = JSON.parse(Option)
                                const checkvalueoption = Array.isArray(decode)
                                if (checkvalueoption === true) {
                                    if (showmenuor.length == 1) {
                                        if (decode.length > 0) {
                                            for (let i = 0; i < decode.length; i++) {
                                                if (decode[i].Subject !== undefined) {
                                                    if (decode[i].Subject.idsubject !== undefined && decode[i].Subject.namesubject !== undefined && decode[i].Subject.option !== undefined) {
                                                        const [addordersub] = await dbsync.execute("INSERT INTO addordersubject (Idsub_addor,Name_sub_addor,Id_addor_addorsub) VALUES (?,?,?)", [decode[i].Subject.idsubject, decode[i].Subject.namesubject, showmenuor[0].Id_addor])
                                                        const [showordersub] = await dbsync.execute("SELECT Id_sub_addor FROM addordersubject WHERE Idsub_addor=? AND Name_sub_addor=? AND Id_addor_addorsub=?", [decode[i].Subject.idsubject, decode[i].Subject.namesubject, showmenuor[0].Id_addor])
                                                        const checkvalueoption = Array.isArray(decode[i].Subject.option)
                                                        if (checkvalueoption === true) {
                                                            if (decode[i].Subject.option.length > 0) {
                                                                for (let o = 0; o < decode[i].Subject.option.length; o++) {
                                                                    if (decode[i].Subject.option[o].Idoption !== undefined && decode[i].Subject.option[o].Nameoption !== undefined && decode[i].Subject.option[o].Priceoption !== undefined && typeof decode[i].Subject.option[o].Idoption === 'number' && typeof decode[i].Subject.option[o].Nameoption === 'string' && typeof decode[i].Subject.option[o].Priceoption === 'number') {
                                                                        const [addorderoption] = await dbsync.execute("INSERT INTO addorderoption (Id_option_addor,Id_sub_option_addor,Name_option_addor,Price_option_addor) VALUES (?,?,?,?)", [decode[i].Subject.option[o].Idoption, showordersub[0].Id_sub_addor, decode[i].Subject.option[o].Nameoption, decode[i].Subject.option[o].Priceoption])
                                                                        if (decode.length - 1 == i && decode[i].Subject.option.length - 1 == o) {
                                                                            res.send("ok")
                                                                        }
                                                                    } else {
                                                                        console.log(typeof decode[i].Subject.option[o].Idoption)
                                                                        console.log(typeof decode[i].Subject.option[o].Priceoption)
                                                                        if (decode.length - 1 == i) {
                                                                            res.send("ok")
                                                                        }
                                                                    }
                                                                }
                                                            } else {

                                                                if (decode.length - 1 === i) {

                                                                    res.send("ok")
                                                                }
                                                                // res.send("your array don't have value")
                                                            }
                                                        } else {

                                                            res.send("your value is not array")
                                                        }
                                                    } else {
                                                        if (i == decode.length - 1) {
                                                            res.send("something wrong")
                                                        }
                                                    }
                                                } else {
                                                    if (i == decode.length - 1) {
                                                        // console.log(555)
                                                        res.send("ok")
                                                    }
                                                }
                                            }
                                        } else {
                                            res.send("ok")
                                        }
                                    } else {
                                        res.send("something wrong")
                                    }
                                } else {
                                    res.send("your value is not array")
                                }
                            } else {
                                res.send("your values don't encode")
                            }

                        } else if (findmenu.length == 0) {
                            res.send("you don't have menu in data")
                        } else {
                            res.send("something wrong")
                        }
                    } else if (findshop.length == 0) {
                        res.send("you don't have shop in data")
                        // console.log(Idshop)
                        // console.log(Nameshop)
                    } else {
                        res.send("something wrong")
                    }
                } else if (finduser.length == 0) {
                    res.send("you don't have user in data")
                } else {
                    res.send("something wrong")
                }
            } else {
                res.send("your values int is null")
            }
        } else {
            res.send()
        }
    } catch (err) {
        // if (err) throw err
        // if (err){
        //     console.log("ERROR:" , err)
        //     res.send('have some error')
        // }
        // console.log("ERROR:" , err.message)
        if (err.message === "Unexpected token o in JSON at position 1") {
            console.log(err)
            // console.log("hahaha")
            res.send("have some error")
        } else if (err.message === "Unexpected end of JSON input") {
            res.send("hahaha")
        } else if (err.message === "Unexpected token e in JSON at position 0") {
            console.log(err.message)
            // res.send("hahaha")
            res.send("have some error")
        } else {
            console.log(err)
            res.send("have some error")
        }
    }
}


// no done yet
const orderlistforshop = async (req, res) => {
    try {
        let Idshop = req.body.Idshop
        if (Idshop !== undefined) {
            Idshop = parseInt(Idshop)
            if (isNaN(Idshop) !== true) {
                const [findshopisreal] = await dbsync.execute("SELECT * FROM profileshop WHERE Id_shop=?", [Idshop])
                if (findshopisreal.length === 1) {
                    const [findordershop] = await dbsync.execute("SELECT * FROM addorder WHERE Id_shop_addor=?", [findshopisreal[0].Id_shop])
                    if (findordershop.length > 0) {
                        let nullvalue = []
                        let nullvaluesubject = []
                        let nullvalueoption = []
                        for (let i = 0; i < findordershop.length; i++) {
                            const [findsubject] = await dbsync.execute("SEELCT * FROM addordersubject WHERE Id_addor_addorsub=?", [findordershop[0].Id_addor])
                            for (let o = 0; o < findsubject.length; o++) {
                                const findoption = await dbsync.execute("SELECT * FROM addorderoption WHERE Id_sub_option_addor=?")
                                if (findoption.length > 0) {

                                } else {

                                }

                            }
                        }
                    } else {
                        res.send("now your shop don't have a order")
                    }
                } else if (findshopisreal.length === 0) {
                    res.send("you don't have shop in data")
                } else {
                    res.send("somthing wrong")
                }
            } else {
                res.send("you value int is null")
            }
        } else {
            res.send()
        }
    } catch (err) {
        if (err) {
            res.send("have some error")
        }
    }

}
// maybe should to edit later
const updatestatusorder = async (req, res) => {
    try {
        // maybe i should to edit totalwithdraw in this link
        let Idorder = req.body.Idorder
        let Idshop = req.body.Idshop
        // console.log("what the world")
        if (Idorder !== undefined && Idshop !== undefined) {
            Idorder = parseInt(Idorder)
            Idshop = parseInt(Idshop)
            if (isNaN(Idorder) !== true && isNaN(Idshop) !== true) {
                const [ShowShop] = await dbsync.execute("SELECT * FROM profileshop WHERE Id_shop=?", [Idshop])
                if (ShowShop.length === 1) {
                    const [ShowOrder] = await dbsync.execute("SELECT * FROM paysuccess WHERE Id_shop_paysucess=? AND Id_order_paysuccess=?", [Idshop, Idorder])
                    if (ShowOrder.length === 1) {
                        const sendtotalwithdraw = await updateTotalwithdraw(ShowShop, ShowOrder)
                        if (sendtotalwithdraw === "success") {
                            await dbsync.execute("UPDATE paysuccess SET Status_paysuccess=2 WHERE Id_order_paysuccess=? AND Id_shop_paysucess=?", [Idorder, Idshop])
                            await dbsync.execute("UPDATE addorder SET Status_addor=3 WHERE Id_shop_addor=? AND Idorder_addor=?", [Idshop, Idorder])
                            await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", [ShowShop[0].Name_shop, `Order ที่ ${Idorder} ของคุณพร้อมให้บริการแล้ว ในวันที่ ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`, Idshop, 'shop', ShowOrder[0].Id_usr_paysuccess, Idorder, 1])
                            await dbsync.execute("INSERT INTO shop_finish (Id_shop_finish) VALUES (?)",[Idshop])
                            const [User] = await dbsync.execute("SELECT Id_line_usr FROM users WHERE Id_usr=?",[ShowOrder[0].Id_usr_paysuccess])
                            if (User.length === 1){
                                if (User[0].Id_line_usr != 0){
                                    const sms = [{
                                        type: 'text',
                                        text: `Order ที่ ${Idorder} ของคุณพร้อมให้บริการแล้ว ในวันที่ ${new Date().toLocaleDateString().slice(0, 19).replace('T', ' ')}`
                                    }
                                ]
                                    const sendm = await client.pushMessage(User[0].Id_line_usr, sms)
                                    res.send("success")
                                }else{
                                    res.send("success")
                                }
                            }else{
                                res.send("success")
                            }
                            // const [findnoti] = await dbsync.execute("SELECT * FROM mail_notification WHERE Id_order_noti=?", [Idorder])
                        } else if (sendtotalwithdraw === "don't have this shop in data") {
                            // console.log("pp")
                            res.send("something wrong")
                        } else if (sendtotalwithdraw === "don't have this order in Star_log") {
                            // console.log("Ee")
                            res.send("something wrong")
                        } else if (sendtotalwithdraw === "have some error") {
                            // console.log("qq")
                            res.send("have some eror")
                        } else if(sendtotalwithdraw === "this order has been success by shop") {
                            // console.log("{[[[")
                            res.send("something wrong")
                        }else if(sendtotalwithdraw === "this partner don't have in data"){
                            // console.log("{EEMF")
                            res.send("something wrong")
                        }else{
                            // console.log("wlpelmf")
                            res.send("something wrong")
                        }
                    } else if (ShowOrder.length == 0) {
                        res.send("you don't have this order in data")
                    } else if (ShowOrder[0].Status_paysuccess == 2) {
                        res.send("this order has been done")
                    } else {
                        res.send("something wrong")
                    }
                } else if (ShowShop.length === 0) {
                    res.send("this shop don't have in data")
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
        if (err) {
            console.log(err)
            res.send("have some error")
        }
    }
}

module.exports = { addorder, orderlistforshop, updatestatusorder }




