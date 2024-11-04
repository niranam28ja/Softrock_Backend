const { response } = require("express")
const { rmSync } = require("fs")
const dbsync = require("D:/react_project/ppap/config/datasync")
const line = require("@line/bot-sdk")
const dotenv = require("dotenv")
const { syncBuiltinESMExports } = require("module")
dotenv.config()
const client = new line.Client({
    channelAccessToken: process.env.Longlivedtoken,
    channelSecret: process.env.Channelsecret
})





const showshopwithdraw = async (req, res) => {
    try {
        let Idshop = req.body.Idshop
        const Datestart = req.body.Datestart
        const Datestop  = req.body.Datestop
        // const Datestop  = req.body.Datestop
        if (Idshop !== undefined && Datestart !== undefined && Datestop !== undefined) {
            Idshop = parseInt(Idshop)
            if (isNaN(Idshop) !== true) {
                const datestart = new Date(Datestart)
                const datestop = new Date(Datestop)
                if (isNaN(datestart.getFullYear()) !== true ){
                     if (isNaN(datestop.getFullYear()) !== true){
                        const formatdatestart = `${datestart.getFullYear()}-${datestart.getMonth() + 1}-${datestart.getDate()} ${datestart.getHours()}:${datestart.getMinutes()}:${datestart.getSeconds()}`
                        const formatdatestop = `${datestop.getFullYear()}-${datestop.getMonth() + 1}-${datestop.getDate()} ${datestop.getHours()}:${datestop.getMinutes()}:${datestop.getSeconds()}`
                        const [shoplistorder] = await dbsync.execute("SELECT Id_paysuccess,Id_order_paysuccess,Pricetotal_paysuccess,Star_use_paysuccess,Date_paysuccess,Datewanttogo_paysuccess FROM paysuccess WHERE Id_shop_paysucess=? AND Status_paysuccess=3 AND Date_paysuccess BETWEEN ? AND ?", [Idshop,
                            formatdatestart,
                            formatdatestop])
                        if (shoplistorder.length >= 1) {
                            res.json(shoplistorder)
                        } else if (shoplistorder.length == 0) {
                            res.send("you don't have order succes yet")
                        }
                     }else{
                         res.send("something wrong with your Datestop")
                     }
                }else{
                 res.send("something wrong with your Datestart")
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
            res.send("have some eror")
        }
    }
}

const showshopwithdrawrequest = async (req, res) => {
    try {
        let Idshop = req.body.Idshop
        if (Idshop !== undefined) {
            Idshop = parseInt(Idshop)
            if (isNaN(Idshop) !== true) {
                if (Idshop === 0) {
                    const [showwithdraw] = await dbsync.execute("SELECT * FROM showshopwithdraw WHERE Status_withdraw_shop=0 ORDER BY Date_withdraw_shop DESC")
                    if (showwithdraw.length > 0) {
                        for (let i = 0; showwithdraw.length > i; i++) {
                            const date = showwithdraw[i].Date_withdraw_shop
                            showwithdraw[i].Date_withdraw_shop = date.toISOString().slice(0, 19).replace('T', ' ')
                            if (showwithdraw.length - 1 === i) {
                                res.json(showwithdraw)
                            }
                        }
                        // res.json(showwithdraw)
                    } else if (showwithdraw.length === 0) {
                        res.send("don't have withdraw request yet")
                    } else {
                        res.send("something wrong")
                    }
                } else if (Idshop > 0) {
                    const [findwithdraw] = await dbsync.execute("SELECT * FROM showshopwithdraw WHERE Status_withdraw_shop=0 AND Id_shop_withdraw_shop=? ORDER BY Date_withdraw_shop DESC", [Idshop])
                    if (findwithdraw.length > 0) {
                        for (let i = 0; findwithdraw.length > i; i++) {
                            const date = findwithdraw[i].Date_withdraw_shop
                            findwithdraw[i].Date_withdraw_shop = date.toISOString().slice(0, 19).replace('T', ' ')
                            if (findwithdraw.length - 1 === i) {
                                res.json(findwithdraw)
                            }
                        }
                    } else if (findwithdraw.length === 0) {
                        res.send("can't find this shop in order")
                    } else {
                        res.send("something wrong")
                    }
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

const shopwithdrawrequest = async (req, res) => {
    try {
        let Amount = req.body.Amount
        let Iduser = req.body.Iduser
        let Idshop = req.body.Idshop
        if (Amount !== undefined && Iduser !== undefined && Idshop !== undefined) {
            Idshop = parseInt(Idshop)
            Iduser = parseInt(Iduser)
            Amount = parseFloat(Amount)
            if (isNaN(Idshop) !== true && isNaN(Iduser) !== true && isNaN(Amount) !== true) {
                const [findshop] = await dbsync.execute("SELECT Name_shop FROM profileshop WHERE Id_shop=?", [Idshop])
                if (findshop.length == 1) {
                    const [checkuser] = await dbsync.execute("SELECT * FROM users WHERE Id_usr=?", [Iduser])
                    if (checkuser.length == 1) {
                        const [findTotalwithdraw] = await dbsync.execute("SELECT * FROM totalwithdraw_shop WHERE Id_shop_Total_withdraw=?", [Idshop])
                        if (findTotalwithdraw.length == 1) {
                            if (findTotalwithdraw[0].Amount_Total_withdraw >= Amount) {
                                const [insertwithdrawrequest] = await dbsync.execute("INSERT INTO showshopwithdraw (Amout_withdraw_shop,UserName_withdraw_shop,Id_usr_withdraw_shop,Id_shop_withdraw_shop,Status_withdraw_shop) VALUES (?,?,?,?,0)", [Amount, checkuser[0].UserName_usr, checkuser[0].Id_usr, Idshop])
                                const minnuswithdraw = findTotalwithdraw[0].Amount_Total_withdraw - Amount
                                if (isNaN(minnuswithdraw) !== true) {
                                    const [updateAmountwithdraw] = await dbsync.execute("UPDATE totalwithdraw_shop SET Amount_Total_withdraw=? WHERE Id_shop_Total_withdraw=?", [minnuswithdraw, Idshop])
                                    res.send("success")
                                } else {
                                    res.send("something wrong")
                                }
                            } else if (findTotalwithdraw[0].Amount_Total_withdraw < Amount) {
                                res.send("you Amount is more than your Total")
                            } else {
                                res.send("something wrong")
                            }
                        } else {
                            res.send("something wrong")
                        }
                    } else if (checkuser.length == 0) {
                        res.send("you don't have this user in data")
                    } else {
                        res.send("something wrong")
                    }
                } else if (findshop.length == 0) {
                    res.send("you don't have this shop in data")
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
// maybe you must to add totalwithdraw_shop in link allowshoprequest 

const allowwithdrawrequest = async (req, res) => {
    try {
        let Iduser = req.body.Iduser
        let Idshop = req.body.Idshop
        let Idwithdraw = req.body.Idwithdraw
        if (Iduser !== undefined && Idshop !== undefined && Idwithdraw !== undefined) {
            Iduser = parseInt(Iduser)
            Idshop = parseInt(Idshop)
            Idwithdraw = parseInt(Idwithdraw)
            if (isNaN(Iduser) !== true && isNaN(Idshop) !== true && isNaN(Idwithdraw) !== true) {
                const [checkadmin] = await dbsync.execute("SELECT * FROM users WHERE Id_usr=? AND Status_usr=9", [Iduser])
                if (checkadmin.length == 1) {
                    const [checkTotalshowithdraw] = await dbsync.execute("SELECT Id_shop_Total_withdraw,Amount_Total_withdraw FROM totalwithdraw_shop WHERE Id_shop_Total_withdraw=?", [Idshop])
                    const [findTotalshowwithdrawrequest] = await dbsync.execute("SELECT Id_withdraw_shop,Amout_withdraw_shop FROM showshopwithdraw WHERE Id_withdraw_shop=?", [Idwithdraw])
                    if (checkTotalshowithdraw.length == 1 && findTotalshowwithdrawrequest.length == 1) {
                      const [shop] = await dbsync.execute("SELECT UserName_shop FROM profileshop WHERE Id_shop=?",[Idshop])
                      if (shop.length === 1){
                        const [Finduser] = await dbsync.execute("SELECT Id_usr,Id_line_usr FROM users WHERE UserName_usr=?",[shop[0].UserName_shop])
                        if (Finduser.length === 1){
                              // const minusTotalwithdraw = checkTotalshowithdraw[0].Amount_Total_withdraw - findTotalshowwithdrawrequest[0].Amout_withdraw_shop             
                            await dbsync.execute("UPDATE showshopwithdraw SET Status_withdraw_shop=1 WHERE Id_withdraw_shop=? AND Id_shop_withdraw_shop=?", [Idwithdraw, Idshop])
                            await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["Softrock",`คำขอถอนเงินของคุณ ${shop[0].UserName_shop}ผู้ถอน จำนวน ${findTotalshowwithdrawrequest[0].Amount_withdraw_shop} อนุมัติเรียบร้อยครับ วันที่ ${new Date().toLocaleString()}`, 82, "Softrock", Finduser[0].Id_usr, "don't have order", 1])
                            const sms = [{
                                type: 'text',
                                text: `คำขอถอนเงินของคุณ ${shop[0].UserName_shop} จำนวน ${findTotalshowwithdrawrequest[0].Amout_withdraw_shop} อนุมัติเรียบร้อยครับ วันที่ ${new Date().toLocaleString()}`
                            }]
                            const sendm = await client.pushMessage(Finduser[0].Id_line_usr, sms)
                            res.status(200).send("success")
                            // res.send("success")
                        }else{
                            res.send("something wrong")
                        }
                      }else{
                        res.send("something wrong")
                      }
                    } else {
                        res.send("something wrong")
                    }
                } else if (checkadmin.length == 0) {
                    res.send("you don't have admin roles")
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

const showtotalwithdraw = async (req, res) => {
    try {
        let Idshop = req.body.Idshop
        if (Idshop !== undefined) {
            Idshop = parseInt(Idshop)
            if (isNaN(Idshop) !== true) {
                const [findwithdrawshop] = await dbsync.execute("SELECT Id_Total_withdraw,Id_shop_Total_withdraw,Amount_Total_withdraw FROM totalwithdraw_shop WHERE Id_shop_Total_withdraw=? ORDER BY Date_Update_Total_withdraw DESC", [Idshop])
                if (findwithdrawshop.length == 1) {
                    res.json(findwithdrawshop)
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

const showithdrawsuccess = async (req, res) => {
    try {
        let Idshop = req.body.Idshop
        if (Idshop !== undefined) {
            const [findwithdrawsuccess] = await dbsync.execute("SELECT Id_withdraw_shop,Amout_withdraw_shop,Status_withdraw_shop,Date_withdraw_shop FROM showshopwithdraw WHERE Id_shop_withdraw_shop=? AND Status_withdraw_shop=1 ", [Idshop])
            if (findwithdrawsuccess.length > 0) {
                res.json(findwithdrawsuccess)
            } else if (findwithdrawsuccess.length === 0) {
                res.send("you don't have withdraw success yet")
            } else {
                res.send("something wrong")
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

module.exports = { showshopwithdraw, showshopwithdrawrequest, shopwithdrawrequest, allowwithdrawrequest, showtotalwithdraw, showithdrawsuccess }


