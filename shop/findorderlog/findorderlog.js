const { truncate } = require("fs")
const dbsync = require("D:/react_project/ppap/config/datasync")


const findmenuorderlog = async (req, res) => {
    try {
        // 1 is less to than date 
        // 2 quatity from moer to less 
        let Idshop = req.body.Idshop
        const Sortby = req.body.Sortby
        const Datestart = req.body.Datestart
        const Datestop = req.body.Datestop
        if (Idshop !== undefined && Sortby !== undefined && Datestart !== undefined && Datestop !== undefined) {
            Idshop = parseInt(Idshop)
            if (isNaN(Idshop) !== true) {
                const [findshop] = await dbsync.execute("SELECT Name_shop FROM profileshop WHERE Id_shop=?", [Idshop])
                if (findshop.length === 1) {
                    const [checkorderlogshop] = await dbsync.execute("SELECT Id_usr_addor FROM addorder WHERE Id_shop_addor=? AND Status_addor!=0", [Idshop])
                    if (checkorderlogshop.length > 0) {
                        const datestart = new Date(Datestart)
                        const datestop = new Date(Datestop)
                        // console.log(datestop.getHours())
                        if (isNaN(datestart.getFullYear()) !== true) {
                            if (isNaN(datestop.getFullYear()) !== true) {
                                const formatdatestart = `${datestart.getFullYear()}-${datestart.getMonth() + 1}-${datestart.getDate()} ${datestart.getHours()}:${datestart.getMinutes()}:${datestart.getSeconds()}`
                                const formatdatestop = `${datestop.getFullYear()}-${datestop.getMonth() + 1}-${datestop.getDate()} ${datestop.getHours()}:${datestop.getMinutes()}:${datestop.getSeconds()}`
                                let [findorderBydate] = await dbsync.execute(`SELECT Id_menu_addor,Name_menu_addor,Quantity_addor,Status_addor,Date_addor FROM addorder WHERE Id_shop_addor=? AND Status_addor!=0 AND Date_addor BETWEEN ? AND ? `, [Idshop, formatdatestart, formatdatestop])
                                // console.log(findorderBydate.length)
                                if (findorderBydate.length > 0) {
                                    for (let i = 0; findorderBydate.length > i; i++) {
                                        findorderBydate[i].Isused = false
                                        findorderBydate[i].Quantity_addor = 1
                                        findorderBydate[i].Date_addor = findorderBydate[i].Date_addor.toISOString().slice(0, 19).replace('T', ' ')
                                        if (findorderBydate.length - 1 === i) {
                                            if (Sortby === "1") {
                                                res.json(findorderBydate)
                                            } else if (Sortby === "2") {
                                                const callfunction = await formatquantity(findorderBydate)
                                                if (typeof callfunction === "object") {
                                                res.json(callfunction.sort((p1, p2) => (p1.Quantity_addor < p2.Quantity_addor) ? 1 : (p1.Quantity_addor > p2.Quantity_addor) ? -1 : 0))
                                                } else if (callfunction === "have some error" || callfunction === "something wrong") {
                                                    res.send("something wrong")
                                                }
                                            } else {
                                                res.send("something wrong")
                                            }
                                        }
                                    }
                                } else if (findorderBydate.length === 0) {
                                    res.send("don't have between date in data")
                                }else{
                                    res.send("something wrong")
                                }

                                // res.json(findorderBydate)
                            } else {
                                res.send("something wrong with your Datestop")
                            }
                        } else {
                            res.send("something wrong with your Datestart")
                        }
                    } else if (checkorderlogshop.length === 0) {
                        res.send("your shop don't have order success yet")
                    } else {
                        res.send("something wrong")
                    }
                } else if (findshop.length === 0) {
                    res.send("this shop don't have in data")
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


const formatquantity = async (data) => {
    try {
        if (data.length > 0) {
            for (let i = 0; data.length > i; i++) {
                for (let o = 0; data.length > o; o++) {
                    if (i === o) {
                        if (data.length - 1 === i && data.length - 1 === o) {
                            const newArr = data.filter(object => {
                                return object.Isused !== true
                            })
                            return newArr
                        }
                    } else if (data[o].Isused === true || data[i].Isused === true) {
                        if (data.length - 1 === i && data.length - 1 === o) {
                            const newArr = data.filter(object => {
                                return object.Isused !== true
                            })
                            return newArr
                        }
                    } else if (data[o].Name_menu_addor === data[i].Name_menu_addor) {
                        data[i].Quantity_addor += 1
                        data[o].Isused = true
                        if (data.length - 1 === i && data.length - 1 === o) {
                            const newArr = data.filter(object => {
                                return object.Isused !== true
                            })
                            return newArr
                        }
                    }
                }
            }
        } else {
            return 'something wrong'
        }
    } catch (err) {
        if (err) {
            return "have some error"
        }
    }
}

module.exports = {findmenuorderlog }










// toISOString().slice(0, 19).replace('T', ' ') // for format date 