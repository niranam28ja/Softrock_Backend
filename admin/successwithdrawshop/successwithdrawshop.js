const dbsync = require("D:/react_project/ppap/config/datasync")



const successwithdrawshop = async (req, res) => {
    try {
        let Datestart = req.body.Datestart
        let Datestop = req.body.Datestop
        const Nameshop = req.body.Nameshop
        const Token = req.body.Token
        if (Datestart !== undefined && Datestop !== undefined && Nameshop !== undefined && Token !== undefined) {
            Datestart = new Date(Datestart)
            Datestop = new Date(Datestop)
            if (isNaN(Datestart) !== true) {
                if (isNaN(Datestop) !== true) {
                    const [checkadmin] = await dbsync.execute("SELECT Id_usr FROM users WHERE Gen_usr=?", [Token])
                    if (checkadmin.length === 1) {
                        if (Nameshop === "0") {
                            const [showshop] = await dbsync.execute("SELECT * FROM showshopwithdraw WHERE Status_withdraw_shop=1 AND Date_withdraw_shop BETWEEN ? AND ? ORDER BY Date_withdraw_shop DESC", [Datestart.toISOString().slice(0, 19).replace('T', ' '), Datestop.toISOString().slice(0, 19).replace('T', ' ')])
                            res.json(showshop)
                        } else if (typeof Nameshop === "string") {
                            const [findthisshop] = await dbsync.execute("SELECT Id_shop FROM profileshop WHERE Name_shop=?", [Nameshop])
                            if (findthisshop.length === 1) {
                                const [showshop] = await dbsync.execute("SELECT * FROM showshopwithdraw WHERE Id_shop_withdraw_shop=?", [findthisshop[0].Id_shop])
                                if (showshop.length === 1) {
                                    const [findwithdraw] = await dbsync.execute("SELECT * FROM showshopwithdraw WHERE Id_shop_withdraw_shop=? AND Status_withdraw_shop=1 AND  Date_withdraw_shop BETWEEN ? AND ? ORDER BY Date_withdraw_shop DESC", [findthisshop[0].Id_shop, Datestart.toISOString().slice(0, 19).replace('T', ' '), Datestop.toISOString().slice(0, 19).replace('T', ' ')])
                                    res.json(findwithdraw)
                                } else if (showshop.length === 0) {
                                    res.send("this shop don't have withdraw yet")
                                } else {
                                    res.send("something wrong")
                                }
                            } else if (findthisshop.length === 0) {
                                res.send("this shop don't have in data")
                            } else {
                                res.send("something wrong")
                            }
                            // let [findorderBydate] = await dbsync.execute(`SELECT Id_menu_addor,Name_menu_addor,Quantity_addor,Status_addor,Date_addor FROM addorder WHERE Id_shop_addor=? AND Status_addor=4 AND Date_addor BETWEEN ? AND ? `, [Idshop, datestart.toISOString().slice(0, 19).replace('T', ' '), datestop.toISOString().slice(0, 19).replace('T', ' ')])
                        } else {
                            res.send("something wrong")
                        }
                    } else if (checkadmin.length === 0) {
                        res.send("your Token is not admin")
                    } else {
                        res.send("something wrong")
                    }
                } else {
                    res.send("your Datestop invalid")
                }
            } else {
                res.send("your Datestart invalid")
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



module.exports = { successwithdrawshop }