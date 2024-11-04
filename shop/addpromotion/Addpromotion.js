const dbsync = require("D:/react_project/ppap/config/datasync")
const random = require('random')
const { parse } = require("uuid")
const { response } = require("express")
const { totalmenuorder, checkmenupromotion, deleteordermenu, editordermenu, checkstoppromotion } = require("../../public/totalmenuorder/totalmenuorder")

const addpromotion = async (req, res) => {
    try {
        let Idshop = req.body.Idshop
        const Nameshop = req.body.Nameshop
        const Pic = req.body.Pic
        const Namepromotion = req.body.Namepromotion
        let Arraymenu = req.body.Arraymenu
        let Totalpurches = req.body.Totalpurches
        const Unitofnumber = req.body.Unitofnumber
        const Discountorgive = req.body.Discountorgive
        const Amountornamemenu = req.body.Amountornamemenu
        let Accumulate = req.body.Accumulate
        let Cumulativeamount = req.body.Cumulativeamount
        const Username = req.body.Username
        let Minstart = req.body.Minstart
        let Hourstart = req.body.Hourstart
        let Minstop = req.body.Minstop
        let Hourstop = req.body.Hourstop
        let Yearstart = req.body.Yearstart
        let Monthstart = req.body.Monthstart
        let Daystart = req.body.Daystart
        let Yearstop = req.body.Yearstop
        let Monthstop = req.body.Monthstop
        let Daystop = req.body.Daystop

        // Arraymenu = JSON.stringify(Arraymenu)
        if (Idshop !== undefined && Nameshop !== undefined && Pic !== undefined && Namepromotion !== undefined && Arraymenu !== undefined && Totalpurches !== undefined && Unitofnumber !== undefined && Discountorgive !== undefined && Amountornamemenu !== undefined && Accumulate !== undefined && Cumulativeamount !== undefined && Username !== undefined && Minstart !== undefined && Hourstart !== undefined && Minstop !== undefined && Hourstop !== undefined && Yearstart !== undefined && Monthstart !== undefined && Daystart !== undefined && Yearstop !== undefined && Monthstop !== undefined && Daystop !== undefined) {
            Idshop = parseInt(Idshop)
            Totalpurches = parseInt(Totalpurches)
            Accmulate = parseInt(Accumulate)
            Cumulativeamount = parseInt(Cumulativeamount)
            Minstart = parseInt(Minstart)
            Hourstart = parseInt(Hourstart)
            Minstop = parseInt(Minstop)
            Hourstop = parseInt(Hourstop)
            Yearstart = parseInt(Yearstart)
            Monthstart = parseInt(Monthstart)
            Daystart = parseInt(Daystart)
            Yearstop = parseInt(Yearstop)
            Monthstop = parseInt(Monthstop)
            Daystop = parseInt(Daystop)
            if (isNaN(Idshop) !== true && isNaN(Totalpurches) !== true && isNaN(Accmulate) !== true && isNaN(Cumulativeamount) !== true && isNaN(Minstart) !== true && isNaN(Hourstart) !== true && isNaN(Minstop) !== true && isNaN(Hourstop) !== true && isNaN(Yearstart) !== true && isNaN(Monthstart) !== true && isNaN(Daystart) !== true && isNaN(Yearstop) !== true && isNaN(Monthstop) !== true && isNaN(Daystop) !== true) {
                const [accesuser] = await dbsync.execute("SELECT Addpro_acc FROM shop_access WHERE Name_usr_acc=? AND Idshop_acc=? ", [Username, Idshop])
                if (accesuser.length == 1) {
                    if (accesuser[0].Addpro_acc == "1") {
                        const [checkshop] = await dbsync.execute("SELECT Id_shop FROM profileshop WHERE Name_shop=? AND Id_shop=?", [Nameshop, Idshop])
                        if (checkshop.length == 1) {
                            const randomint = random.int(100000, 999999)
                            const [insertdata] = await dbsync.execute("INSERT INTO addpromotion (Idshop_promo,Nameshop_promo,Name_promo,Pic_promo,Totalpurches_promo,Unitofnumber_promo,Discountorgive_promo,Amountornamemenu_promo,Accumulate_promo,Cumulativeamount_promo,Usrname_promo,Minstart_promo,Hourstart_promo,Minstop_promo,Hourstop_promo,Yearstart_promo,Monthstart_promo,Daystart_promo,Yearstop_promo,Monthstop_promo,Daystop_promo,Random_promo) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [Idshop, Nameshop, Namepromotion, Pic, Totalpurches, Unitofnumber, Discountorgive, Amountornamemenu, Accumulate, Cumulativeamount, Username, Minstart, Hourstart, Minstop, Hourstop, Yearstart, Monthstart, Daystart, Yearstop, Monthstop, Daystop, randomint])
                            const [showdata] = await dbsync.execute("SELECT Id_promo FROM addpromotion WHERE Idshop_promo=? AND Name_promo=? AND Yearstart_promo=? AND Monthstart_promo=? AND Daystart_promo=? AND Random_promo=?", [Idshop, Namepromotion, Yearstart, Monthstart, Daystart, randomint])
                            if (showdata.length == 1) {
                                const decode = JSON.parse(Arraymenu)
                                const checkarray = Array.isArray(decode)
                                if (checkarray == true) {
                                    // console.log(decode.length >= 1)
                                    if (decode.length >= 1) {
                                        for (let i = 0; i < decode.length; i++) {
                                            if (decode[i].Idmenu !== undefined && decode[i].Namemenu !== undefined && decode[i].Pricemenu !== undefined) {
                                                const Idmenuint = parseInt(decode[i].Idmenu)
                                                const Pricemenu = parseInt(decode[i].Pricemenu)
                                                if (isNaN(Idmenuint) !== true && isNaN(Pricemenu) !== true) {
                                                    const [checkvalue] = await dbsync.execute("SELECT Id_menu FROM addmenu WHERE Id_menu=? AND Id_shop_menu=? AND Name_menu=? AND Status_menu=1", [decode[i].Idmenu, Idshop, decode[i].Namemenu])
                                                    if (checkvalue.length == 1) {
                                                        const [addvalue] = await dbsync.execute("INSERT INTO arraymenupromotion(Id_promo_menupromo,Idmenu_menuprommo,Namemenu_menupromo,Pricemenu_menupromo) VALUES (?,?,?,?)", [showdata[0].Id_promo, decode[i].Idmenu, decode[i].Namemenu, decode[i].Pricemenu])
                                                        if (i == decode.length - 1) {
                                                            res.send("success")
                                                        }
                                                    } else if (checkvalue.length == 0) {
                                                        res.send("hahaha")
                                                    } else {
                                                        res.send("something wrong")
                                                    }
                                                } else {
                                                    res.send("hahaha")
                                                }
                                            } else {
                                                res.send("hahaha")
                                            }
                                        }
                                    } else {
                                        res.send("your array don't have value ")
                                    }
                                } else {
                                    res.send("your value is not array")
                                }
                            } else if (showdata.length == 0) {
                                res.send("something wrong")
                            } else {
                                console.log(showdata)
                                res.send("something wrong")
                            }
                        } else if (checkshop.length == 0) {
                            res.send("you don't have shop in data")
                        } else {
                            res.send("something wrong")
                        }
                    } else if (accesuser[0].Addpro_acc == '0') {
                        res.send("you don't have allowed to add promotion")
                    } else {
                        res.send("something wrong4")
                    }
                } else if (accesuser.length > 1) {
                    res.send("something wrong")
                } else {
                    res.send("you don't have user access in data")
                }

            } else {
                // console.log(Idshop)
                // console.log(Totalpurches)
                // console.log(Accmulate)
                // console.log(Cumulativeamount)
                // console.log(Minstart)
                // console.log(Hourstart)
                // console.log(Yearstart)
                // console.log(Monthstart)
                // console.log(Daystart)
                // console.log(Yearstop)
                // console.log(Monthstop)
                // console.log(Daystop)
                res.send("your values int is null")
            }



        } else {
            res.send()
        }
    } catch (err) {
        if (err.message === "Unexpected token o in JSON at position 1") {
            console.log(err.message)
            res.send("hahaha")
        } else if (err.message === "Unexpected end of JSON input") {
            res.send("hahaha")
        } else if (err.message === "Unexpected token e in JSON at position 0") {
            console.log(err.message)
            res.send("hahaha")
        } else {
            console.log(err)
            res.send("have some error")
        }
    }
}

// this funciton maybe have some error, i'll find error
const showallpromotion = async (req, res) => {
    try {
        let Idshop = req.body.Idshop
        if (Idshop !== undefined) {
            const getdate = new Date()
            const getyear = getdate.getFullYear()
            const getmonth = getdate.getMonth() + 1
            const getday = getdate.getDate()
            const gethour = getdate.getHours()
            const getmin = getdate.getMinutes()
            Idshop = parseInt(Idshop)
            if (isNaN(Idshop) !== true) {
                const [checkshop] = await dbsync.execute("SELECT Name_shop FROM profileshop WHERE Id_shop=?", [Idshop])
                if (checkshop.length == 1) {
                    const [promotion] = await dbsync.execute("SELECT * FROM addpromotion WHERE Idshop_promo=?", [Idshop])
                    if (promotion.length > 0) {
                        // let allvalue = []
                        // let keepmenupromotion = []
                        let valuearray = []
                        let onepromotion = []
                        for (let i = 0; i < promotion.length; i++) {
                            if (getyear > promotion[i].Yearstart_promo) {
                                onepromotion.push(promotion[i])
                                let sendpromo = await checkstoppromotion(onepromotion, getyear, getmonth, getday, gethour, getmin)
                                if (sendpromo === true) {
                                    let sendfunction = await looppromotion(onepromotion, valuearray)
                                    if (typeof sendfunction === "object") {
                                        valuearray = sendfunction
                                        onepromotion = []
                                        if (i == promotion.length - 1) {
                                            res.send(valuearray)
                                        }
                                    } else if (sendfunction == "no") {
                                        onepromotion = []
                                        if (i == promotion.length - 1) {
                                            res.send(valuearray)
                                        }
                                    } else{
                                        res.send("something wrong")
                                    }
                                } else {
                                    onepromotion = []
                                    if (i == promotion.length - 1) {
                                        res.send(valuearray)
                                    }
                                }
                            } else if (getyear == promotion[i].Yearstart_promo) {
                                if (getmonth > promotion[i].Monthstart_promo) {
                                    onepromotion.push(promotion[i])
                                    let sendpromo = await checkstoppromotion(onepromotion, getyear, getmonth, getday, gethour, getmin)
                                    if (sendpromo === true) {
                                        let sendfunction = await looppromotion(onepromotion, valuearray)
                                        // console.log(sendfunction)
                                        if (typeof sendfunction === "object") {
                                            valuearray = sendfunction
                                            onepromotion = []
                                            if (i == promotion.length - 1) {
                                                res.send(valuearray)
                                            }
                                        } else if (sendfunction == "no") {
                                            onepromotion = []
                                            if (i == promotion.length - 1) {
                                                res.send(valuearray)
                                            }
                                        } else{
                                            res.send("something wrong")
                                        }
                                    } else {
                                        onepromotion = []
                                        if (i == promotion.length - 1) {
                                            res.send(valuearray)
                                        }
                                    }
                                } else if (getmonth == promotion[i].Monthstart_promo) {
                                    if (getday > promotion[i].Daystart_promo) {
                                        onepromotion.push(promotion[i])
                                        let sendpromo = await checkstoppromotion(onepromotion, getyear, getmonth, getday, gethour, getmin)
                                        if (sendpromo === true) {
                                            let sendfunction = await looppromotion(onepromotion, valuearray)
                                            if (typeof sendfunction === "object") {
                                                valuearray = sendfunction
                                                onepromotion = []
                                                if (i == promotion.length - 1) {
                                                    res.send(valuearray)
                                                }
                                            } else if (sendfunction == "no") {
                                                onepromotion = []
                                                if (i == promotion.length - 1) {
                                                    res.send(valuearray)
                                                }
                                            } else{
                                                res.send("something wrong")
                                            }
                                        } else {
                                            onepromotion = []
                                            if (i == promotion.length - 1) {
                                                res.send(valuearray)
                                            }
                                        }
                                    } else if (getday == promotion[i].Daystart_promo) {
                                        if (gethour > promotion[i].Hourstart_promo) {
                                            onepromotion.push(promotion[i])
                                            let sendpromo = await checkstoppromotion(onepromotion, getyear, getmonth, getday, gethour, getmin)
                                            if (sendpromo === true) {
                                                let sendfunction = await looppromotion(onepromotion, valuearray)
                                                if (typeof sendfunction === "object") {
                                                    valuearray = sendfunction
                                                    onepromotion = []
                                                    if (i == promotion.length - 1) {
                                                        res.send(valuearray)
                                                    }
                                                } else if (sendfunction == "no") {
                                                    onepromotion = []
                                                    if (i == promotion.length - 1) {
                                                        res.send(valuearray)
                                                    }
                                                } else{
                                                    res.send("something wrong")
                                                }
                                            } else {
                                                onepromotion = []
                                                if (i == promotion.length - 1) {
                                                    res.send(valuearray)
                                                }
                                            }
                                        } else if (gethour == promotion[i].Hourstart_promo) {
                                            if (getmin > promotion[i].Minstart_promo) {
                                                onepromotion.push(promotion[i])
                                                let sendpromo = await checkstoppromotion(onepromotion, getyear, getmonth, getday, gethour, getmin)
                                                if (sendpromo === true) {
                                                    let sendfunction = await looppromotion(onepromotion, valuearray)
                                                    if (typeof sendfunction === "object") {
                                                        valuearray = sendfunction
                                                        onepromotion = []
                                                        if (i == promotion.length - 1) {
                                                            res.send(valuearray)
                                                        }
                                                    } else if (sendfunction == "no") {
                                                        onepromotion = []
                                                        if (i == promotion.length - 1) {
                                                            res.send(valuearray)
                                                        }
                                                    } else{
                                                        res.send("something wrong")
                                                    }
                                                } else {
                                                    onepromotion = []
                                                    if (i == promotion.length - 1) {
                                                        res.send(valuearray)
                                                    }
                                                }
                                            } else if (getmin == promotion[i].Minstart_promo) {
                                                onepromotion.push(promotion[i])
                                                let sendpromo = await checkstoppromotion(onepromotion, getyear, getmonth, getday, gethour, getmin)
                                                if (sendpromo === true) {
                                                    let sendfunction = await looppromotion(onepromotion, valuearray)
                                                    if (typeof sendfunction === "object") {
                                                        valuearray = sendfunction
                                                        onepromotion = []
                                                        if (i == promotion.length - 1) {
                                                            res.send(valuearray)
                                                        }
                                                    } else if (sendfunction == "no") {
                                                        onepromotion = []
                                                        if (i == promotion.length - 1) {
                                                            res.send(valuearray)
                                                        }
                                                    } else{
                                                        res.send("something wrong")
                                                    }
                                                } else {
                                                    onepromotion = []
                                                    if (i == promotion.length - 1) {
                                                        res.send(valuearray)
                                                    }
                                                }
                                            } else {
                                                if (i == promotion.length - 1) {
                                                    res.send(valuearray)
                                                }
                                            }
                                        } else {
                                            if (i == promotion.length - 1) {
                                                res.send(valuearray)
                                            }
                                        }
                                    } else {
                                        if (i == promotion.length - 1) {
                                            res.send(valuearray)
                                        }
                                    }
                                } else {
                                    if (i == promotion.length - 1) {
                                        res.send(valuearray)
                                    }
                                }
                            } else {
                                if (i == promotion.length - 1) {
                                    res.send(valuearray)
                                }
                            }
                        }
                    } else {
                        res.send("this don't have promotion")
                    }
                } else if (checkshop.length == 0) {
                    res.send("you don't have shop in data")
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
        if (err) {
            // console.log(err.message)
            res.send(err)
        }
    }
}

const showsomepromotion = async(req,res) =>{
    let Idshop = req.body.Idshop 
    let Idpromotion = req.body.Idpromotion
    if(Idshop !== undefined && Idpromotion !== undefined){
        Idshop = parseInt(Idshop)
        Idpromotion = parseInt(Idpromotion)
        if(isNaN(Idshop) !== true && isNaN(Idpromotion) !== true){
            const [findshop] = await dbsync.execute("SELECT Id_shop FROM profileshop WHERE Id_shop=?",[Idshop])
            if(findshop.length == 1){
                let value = []
                const [findpromotion] = await dbsync.execute("SELECT * FROM addpromotion WHERE Id_promo=? AND Idshop_promo=?",[Idpromotion,findshop[0].Id_shop])
                if(findpromotion.length == 1){
                    const sendfunction = await looppromotion(findpromotion,value)
                    if(typeof sendfunction == "object"){
                        res.send(sendfunction)
                    }else if(sendfunction == 'no'){
                        res.send("this promotion don't have menu in promotion")
                    }else{
                        res.send("something wrong")
                    }
                }else if(findpromotion.length == 0){
                   res.send("this don't have promotion")
                }else{
                    res.send("something wrong")
                }
            }else if(findshop.length == 0){
                res.send("you don't have shop in data")
            }else{
                res.send("something wrong")
            }
        }else{
            res.send("your values int is null")
        }
    }else{
        res.send()
    }
}

const looppromotion = async (promotion, allvalue) => {
    try {
        // let allvalue = []
        // console.log(typeof allvalue)
        let keepmenupromotion = []
        const [findmenupromotion] = await dbsync.execute("SELECT * FROM arraymenupromotion WHERE Id_promo_menupromo=?", [promotion[0].Id_promo])
        // console.log(findmenupromotion.length)
        // console.log(promotion[0].Id_promo)
        if (findmenupromotion.length > 0) {
            for (let o = 0; findmenupromotion.length > o; o++) {
                const [findmenu] = await dbsync.execute("SELECT * FROM addmenu WHERE Id_menu=? AND Status_menu=1", [findmenupromotion[o].Idmenu_menuprommo])
                if (findmenu.length == 1) {
                    keepmenupromotion.push({ Idmenu: findmenu[0].Id_menu, Namemenu: findmenu[0].Name_menu, Picmenu: findmenu[0].Pic_menu, Pricemenu: findmenu[0].Price_menu, Timemenu: findmenu[0].Time_menu })
                    if (o == findmenupromotion.length - 1) {
                        allvalue.push({ Idpromotion: promotion[0].Id_promo, Namepromotion: promotion[0].Name_promo, Picpromotion: promotion[0].Pic_promo, Totalpurchespromotion: promotion[0].Totalpurches_promo, Unitofnumberpromotion: promotion[0].Unitofnumber_promo, Discountorgivepromotion: promotion[0].Discountorgive_promo, Amountornamemenupromotion: promotion[0].Amountornamemenu_promo, Yearstartpromotion: promotion[0].Yearstart_promo, Monthstartpromotion: promotion[0].Monthstart_promo, Daystartpromotion: promotion[0].Daystart_promo, Hourstartpromotion: promotion[0].Hourstart_promo, Minstartpromotion: promotion[0].Minstart_promo, Yearstoppromotion: promotion[0].Yearstop_promo, Monthstoppromotion: promotion[0].Monthstop_promo, Daystoppromotion: promotion[0].Daystop_promo, Hourstoppromotion: promotion[0].Hourstop_promo, Minstoppromotion: promotion[0].Minstop_promo, menupromotion: keepmenupromotion })
                        keepmenupromotion = []
                        // console.log(allvalue)
                        return allvalue
                    }
                } else {
                    if (o == findmenupromotion.length - 1) {
                        // return "something wrong"
                        return allvalue
                    }
                }
            }
        } else {
            return "no"
        }
    } catch (err) {
        if (err) {
            console.log(err)
            return err
        }
    }
}


module.exports = { addpromotion, showallpromotion, looppromotion,showsomepromotion }


