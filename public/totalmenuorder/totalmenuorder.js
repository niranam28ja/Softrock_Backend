const { createSimpleCredentialsProvider } = require("@moneyspace.net/moneyspace-node-js-sdk")
const { Router } = require("express")
const { check } = require("express-validator")
const { ResultWithContext } = require("express-validator/src/chain")
const { parse } = require("uuid")
const dbsync = require("D:/react_project/ppap/config/datasync")
const random = require('random')


 
const totalmenuorder = async (req, res) => {
    try {
        let Iduser = req.body.Iduser
        const Token = req.body.Token
        if (Iduser !== undefined && Token !== undefined) {
            Iduser = parseInt(Iduser)
            if (isNaN(Iduser) !== true) {
                const [checkuser] = await dbsync.execute("SELECT UserName_usr FROM users WHERE Id_usr=? AND Gen_usr=? AND Status_usr != 0", [Iduser, Token])
                if (checkuser.length == 1) {
                    const [checkorder] = await dbsync.execute("SELECT Id_addor,Id_menu_addor,Id_shop_addor,Name_menu_addor,Quantity_addor,Comment_addor FROM addorder WHERE Id_usr_addor=? AND Status_addor=0 AND Idorder_addor=0", [Iduser])
                    if (checkorder.length > 0) {
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
                                                    allvalue.push({ Idorder: checkorder[i].Id_addor, Idmenu: checkorder[i].Id_menu_addor,Idshop:checkorder[i].Id_shop_addor, Pricemenu: getpricemenu[0].Price_menu,Quantity : checkorder[i].Quantity_addor, Picmenu: getpricemenu[0].Pic_menu, Namemenu: checkorder[i].Name_menu_addor, Subjectandioption: valuesubjectandoption, access: null, oldornewvalue: "old" })
                                                    valueoptionforkeep = []
                                                    valuesubjectandoption = []
                                                }
                                                if (i == checkorder.length - 1 && q == valuesubject.length - 1 && p == valueoption.length - 1) {
                                                    // const sendcheckpromotion = checkpromotoion(allvalue)
                                                    // allvalue.push({ sumprice: allsumpricemenu })
                                                    allvalue.push({ originalprice: allsumpricemenu })
                                                    allvalue.push({ discountprice: 0 })
                                                    allvalue.push({ sumprice: allsumpricemenu })
                                                    const sendpromotion = await checkpromotion(allvalue, Iduser, checkorder[i].Id_addor)
                                                    // console.log(sendpromotion)
                                                    if (typeof sendpromotion === 'object') {
                                                        res.json(sendpromotion)
                                                    } else if (sendpromotion == 'no') {
                                                        // console.log("whhh")
                                                        res.status(400).send('something wrong')
                                                    } else if (sendpromotion === "have some err") {
                                                        res.status(400).send("have some err")
                                                    } else {
                                                        res.status(400).send("somthing wrong")
                                                    }
                                                    // res.json(sendpromotion)
                                                    // res.send(allvalue)
                                                }
                                            }
                                        } else {
                                            if (q == valuesubject.length - 1) {
                                                allvalue.push({ Idorder: checkorder[i].Id_addor, Idmenu: checkorder[i].Id_menu_addor,Idshop:checkorder[i].Id_shop_addor, Pricemenu: getpricemenu[0].Price_menu,Quantity : checkorder[i].Quantity_addor,  Picmenu: getpricemenu[0].Pic_menu, Namemenu: checkorder[i].Name_menu_addor, Subjectandioption: valuesubjectandoption, access: null, oldornewvalue: "old" })
                                                valueoptionforkeep = []
                                                valuesubjectandoption = []
                                            }
                                            if (i == checkorder.length - 1 && q == valuesubject.length - 1) {
                                                // allvalue.push({ sumprice: allsumpricemenu })
                                                allvalue.push({ originalprice: allsumpricemenu })
                                                allvalue.push({ discountprice: 0 })
                                                allvalue.push({ sumprice: allsumpricemenu })
                                                const sendpromotion = await checkpromotion(allvalue, Iduser, checkorder[i].Id_addor)
                                                // console.log(sendpromotion)
                                                if (typeof sendpromotion === 'object') {
                                                    res.json(sendpromotion)
                                                } else if (sendpromotion == 'no') {
                                                    // console.log("whhh")
                                                    res.status(400).send('something wrong')
                                                } else if (sendpromotion === "have some err") {
                                                    res.status(400).send("have some err")
                                                } else {
                                                    res.status(400).send("somthing wrong")
                                                }
                                                // res.json(sendpromotion)
                                                // res.send(allvalue)
    
                                            }
                                        }
                                    }
                                } else {
                                    allvalue.push({ Idorder: checkorder[i].Id_addor, Idmenu: checkorder[i].Id_menu_addor,Idshop:checkorder[i].Id_shop_addor, Pricemenu: getpricemenu[0].Price_menu,Quantity : checkorder[i].Quantity_addor,  Picmenu: getpricemenu[0].Pic_menu, Namemenu: checkorder[i].Name_menu_addor, Subjectandioption: null, access: null, oldornewvalue: "old" })
                                    if (i == checkorder.length - 1) {
                                        // allvalue.push({ sumprice: allsumpricemenu })
                                        allvalue.push({ originalprice: allsumpricemenu })
                                        allvalue.push({ discountprice: 0 })
                                        allvalue.push({ sumprice: allsumpricemenu })
                                        const sendpromotion = await checkpromotion(allvalue, Iduser, checkorder[i].Id_addor)
                                        // res.json(sendpromotion)
                                        if (typeof sendpromotion === 'object') {
                                            res.json(sendpromotion)
                                        } else if (sendpromotion == 'no') {
                                            // console.log("whhh")
                                            res.status(400).send('something wrong')
                                        } else if (sendpromotion === "have some err") {
                                            res.status(400).send("have some err")
                                        } else {
                                            res.status(400).send("something wrong")
                                        }
                                    }
                                }
                            }else{
                                if (i == checkorder.length - 1 ) {
                                    // allvalue.push({ sumprice: allsumpricemenu })
                                    allvalue.push({ originalprice: allsumpricemenu })
                                    allvalue.push({ discountprice: 0 })
                                    allvalue.push({ sumprice: allsumpricemenu })
                                    const sendpromotion = await checkpromotion(allvalue, Iduser, checkorder[i].Id_addor)
                                    // console.log(sendpromotion)
                                    if (typeof sendpromotion === 'object') {
                                        res.json(sendpromotion)
                                    } else if (sendpromotion == 'no') {
                                        // console.log("whhh")
                                        res.status(400).send('something wrong')
                                    } else if (sendpromotion === "have some err") {
                                        res.status(400).send("have some err")
                                    } else {
                                        res.status(400).send("somthing wrong")
                                    }
                                    // res.json(sendpromotion)
                                    // res.send(allvalue)

                                }
                            }
                        }
                    } else if (checkorder.length == 0) {
                        res.send("you don't have order in data")
                    } else {
                        res.send("something wrong")
                    }
                } else if (checkuser.length == 0) {
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
        if (err) {
            console.log(err)
            res.send("have some error")
        }
    }
}

const checkpromotion = async (valuearray, Iduser) => {
    // variable
    // Idorder AND && isNaN(Idorder) !== true
    const getdate = new Date()
    const getyear = getdate.getFullYear()
    const getmonth = getdate.getMonth() + 1
    const getday = getdate.getDate()
    const gethour = getdate.getHours()
    const getmin = getdate.getMinutes()
    if (isNaN(Iduser) !== true) {
        const checkarray = Array.isArray(valuearray)
        if (checkarray == true) {
            if (valuearray.length > 0) {
                const checkoriginalprice = valuearray.findIndex(x => x.originalprice !== undefined)
                const checkdiscountprice = valuearray.findIndex(x => x.discountprice !== undefined)
                const checksumprice = valuearray.findIndex(x => x.sumprice !== undefined)
                if (checkoriginalprice > -1 && checkdiscountprice > -1 && checksumprice > -1) {
                    if (isNaN(valuearray[checkoriginalprice].originalprice) !== true && isNaN(valuearray[checkdiscountprice].discountprice) !== true && isNaN(valuearray[checksumprice].sumprice) !== true) {
                        let x = 0
                        x += 3
                        let array = 0
                        for (let i = 0; valuearray.length > i; i++) {
                            if (valuearray[i].Idorder !== undefined && valuearray[i].Idmenu !== undefined && valuearray[i].Namemenu !== undefined && valuearray[i].Picmenu !== undefined && valuearray[i].Pricemenu !== undefined && valuearray[i].Subjectandioption !== undefined && valuearray[i].access !== undefined) {
                                x += 1
                                if (x == valuearray.length) {
                                    const lengthofvaluearray = valuearray.length
                                    for (let o = 0; lengthofvaluearray > o; o++) {
                                        // console.log(valuearray[2])
                                        if (o !== checkoriginalprice && o !== checkdiscountprice && o !== checksumprice) {
                                            if (valuearray[o].access !== "success" && valuearray[o].access === null && valuearray[o].oldornewvalue === "old") {
                                                const [checkpromotion] = await dbsync.execute("SELECT Id_promo_menupromo FROM arraymenupromotion WHERE Idmenu_menuprommo=? AND Namemenu_menupromo=?", [valuearray[o].Idmenu, valuearray[o].Namemenu])
                                                if (checkpromotion.length > 0) {
                                                    for (let z = 0; z < checkpromotion.length; z++) {
                                                        const [findpromotion] = await dbsync.execute("SELECT  Id_promo,Idshop_promo,Nameshop_promo,Name_promo,Totalpurches_promo,Unitofnumber_promo,Discountorgive_promo,Amountornamemenu_promo,Accumulate_promo,Cumulativeamount_promo,Usrname_promo,Minstart_promo,Hourstart_promo,Minstop_promo,Hourstop_promo,Yearstart_promo,Monthstart_promo,Daystart_promo,Yearstop_promo,Monthstop_promo,Daystop_promo FROM addpromotion WHERE Id_promo=?", [checkpromotion[z].Id_promo_menupromo])
                                                        if (findpromotion.length == 1) {
                                                            if (getyear > findpromotion[0].Yearstart_promo) {
                                                                let sendpromo = await checkstoppromotion(findpromotion, getyear, getmonth, getday, gethour, getmin)
                                                                if (sendpromo === true) {
                                                                    let sendfunction = await checkmenupromotion(valuearray, Iduser, findpromotion[0].Id_promo)
                                                                    if (typeof sendfunction === "object") {
                                                                        valuearray = sendfunction
                                                                        if (o == valuearray.length - 1 && z == checkpromotoion.length - 1) {
                                                                            return valuearray
                                                                        }
                                                                    } else if (sendfunction == "no") {
                                                                        return "no"
                                                                    } else {
                                                                        return "something wrong"
                                                                    }
                                                                } else {
                                                                    if (o == valuearray.length - 1 && z == checkpromotion.length - 1) {
                                                                        return valuearray
                                                                    }
                                                                }
                                                            } else if (getyear == findpromotion[0].Yearstart_promo) {
                                                                if (getmonth > findpromotion[0].Monthstart_promo) {
                                                                    let sendpromo = await checkstoppromotion(findpromotion, getyear, getmonth, getday, gethour, getmin)
                                                                    // console.log(sendpromo == true)
                                                                    if (sendpromo === true) {
                                                                        let sendfunction = await checkmenupromotion(valuearray, Iduser, findpromotion[0].Id_promo)
                                                                        if (typeof sendfunction === "object") {
                                                                            array = sendfunction
                                                                            if (o == valuearray.length - 1 && z == checkpromotoion.length - 1) {
                                                                                return array
                                                                            }
                                                                        } else if (sendfunction == "no") {
                                                                            if (o == valuearray.length - 1 && z == checkpromotoion.length - 1) {
                                                                                return array
                                                                            }
                                                                        } else {
                                                                            return "something wrong"
                                                                        }
                                                                    } else {
                                                                        if (o == valuearray.length - 1 && z == checkpromotion.length - 1) {
                                                                            return valuearray
                                                                        }
                                                                    }
                                                                } else if (getmonth == findpromotion[0].Monthstart_promo) {
                                                                    if (getday > findpromotion[0].Daystart_promo) {
                                                                        let sendpromo = await checkstoppromotion(findpromotion, getyear, getmonth, getday, gethour, getmin)
                                                                        if (sendpromo === true) {
                                                                            let sendfunction = checkmenupromotion(valuearray, Iduser, findpromotion[0].Id_promo)
                                                                            if (typeof sendfunction === "object") {
                                                                                valuearray = sendfunction
                                                                                if (o == valuearray.length - 1 && z == checkpromotoion.length - 1) {
                                                                                    return valuearray
                                                                                }
                                                                            } else if (sendfunction == "no") {
                                                                                return "no"
                                                                            } else {
                                                                                return "something wrong"
                                                                            }
                                                                        } else {
                                                                            if (o == valuearray.length - 1 && z == checkpromotion.length - 1) {
                                                                                return valuearray
                                                                            }
                                                                        }
                                                                    } else if (getday == findpromotion[0].Daystart_promo) {
                                                                        if (gethour > findpromotion[0].Hourstart_promo) {
                                                                            let sendpromo = await checkstoppromotion(findpromotion, getyear, getmonth, getday, gethour, getmin)
                                                                            if (sendpromo === true) {
                                                                                let sendfunction = checkmenupromotion(valuearray, Iduser, findpromotion[0].Id_promo)
                                                                                if (typeof sendfunction === "object") {
                                                                                    valuearray = sendfunction
                                                                                    if (o == valuearray.length - 1 && z == checkpromotoion.length - 1) {
                                                                                        return valuearray
                                                                                    }
                                                                                } else if (sendfunction == "no") {
                                                                                    return "no"
                                                                                } else {
                                                                                    return "something wrong"
                                                                                }
                                                                            } else {
                                                                                if (o == valuearray.length - 1 && z == checkpromotion.length - 1) {
                                                                                    return valuearray
                                                                                }
                                                                            }
                                                                        } else if (gethour == findpromotion[0].Hourstart_promo) {
                                                                            if (getmin > findpromotion[0].Minstart_promo) {
                                                                                let sendpromo = await checkstoppromotion(findpromotion, getyear, getmonth, getday, gethour, getmin)
                                                                                if (sendpromo === true) {
                                                                                    let sendfunction = checkmenupromotion(valuearray, Iduser, findpromotion[0].Id_promo)
                                                                                    if (typeof sendfunction === "object") {
                                                                                        valuearray = sendfunction
                                                                                        if (o == valuearray.length - 1 && z == checkpromotoion.length - 1) {
                                                                                            return valuearray
                                                                                        }
                                                                                    } else if (sendfunction == "no") {
                                                                                        return "no"
                                                                                    } else {
                                                                                        return "something wrong"
                                                                                    }
                                                                                } else {
                                                                                    if (o == valuearray.length - 1 && z == checkpromotion.length - 1) {
                                                                                        return valuearray
                                                                                    }
                                                                                }
                                                                            } else if (getmin == findpromotion[0].Minstart_promo) {
                                                                                let sendpromo = await checkstoppromotion(findpromotion, getyear, getmonth, getday, gethour, getmin)
                                                                                if (sendpromo === true) {
                                                                                    let sendfunction = checkmenupromotion(valuearray, Iduser, findpromotion[0].Id_promo)
                                                                                    if (typeof sendfunction === "object") {
                                                                                        valuearray = sendfunction
                                                                                        if (o == valuearray.length - 1 && z == checkpromotoion.length - 1) {
                                                                                            return valuearray
                                                                                        }
                                                                                    } else if (sendfunction == "no") {
                                                                                        return "no"
                                                                                    } else {
                                                                                        return "something wrong"
                                                                                    }
                                                                                } else {
                                                                                    if (o == valuearray.length - 1 && z == checkpromotion.length - 1) {
                                                                                        return valuearray
                                                                                    }
                                                                                }
                                                                            } else {
                                                                                if (o == valuearray.length - 1 && z == checkpromotion.length - 1) {
                                                                                    return valuearray
                                                                                }
                                                                            }
                                                                        } else {
                                                                            if (o == valuearray.length - 1 && z == checkpromotion.length - 1) {
                                                                                return valuearray
                                                                            }
                                                                        }
                                                                    } else {
                                                                        if (o == valuearray.length - 1 && z == checkpromotion.length - 1) {
                                                                            return valuearray
                                                                        }
                                                                    }
                                                                } else {
                                                                    if (o == valuearray.length - 1 && z == checkpromotion.length - 1) {
                                                                        return valuearray
                                                                    }
                                                                }
                                                            } else {
                                                                if (o == valuearray.length - 1 && z == checkpromotoion.length - 1) {
                                                                    return valuearray
                                                                }
                                                            }
                                                        } else {
                                                            if (o == valuearray.length - 1 && z == checkpromotoion.length - 1) {
                                                                return valuearray
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    if (o == valuearray.length - 1) {
                                                        return valuearray
                                                    }
                                                }
                                            } else {
                                                if (o == valuearray.length - 1) {
                                                    return valuearray
                                                }
                                            }
                                        } else {
                                            // it do in here
                                            // console.log(o)
                                            if (o == valuearray.length - 1) {
                                                return valuearray
                                            }
                                        }
                                    }
                                } else {
                                    if (i == valuearray.length - 1) {
                                        return "no"
                                    }
                                }
                            } else {
                                if (i == valuearray.length - 1) {
                                    return "no"
                                }
                            }
                        }
                    } else {
                        return "no"
                    }
                } else {
                    return "no"
                }
            } else {
                return "no"
            }
        } else {
            return "no"
        }

    } else {
        return "no"
    }
}

const checkstoppromotion = async (findpromotion, getyear, getmonth, getday, gethour, getmin) => {
    // let sendfunction = checkmenupromotion(valuearray, Iduser, findpromotion[0].Id_promo)
    //             if (typeof sendfunction === "object") {
    //                 valuearray = sendfunction
    //                 if (o == valuearray.length - 1 && z == checkpromotoion.length - 1) {
    //                     return valuearray
    //                 }
    //             } else if (sendfunction == "no") {
    //                 return "no"
    //             } else {
    //                 return "something wrong"
    //             }
    try {
        // console.log(findpromotion[0].Id_promo)
        // console.log(getyear)
        if (typeof findpromotion == 'object') {
            // console.log(findpromotion.length)
            if (getyear < findpromotion[0].Yearstop_promo) {
                return true
            } else if (getyear == findpromotion[0].Yearstop_promo) {
                if (getmonth < findpromotion[0].Monthstop_promo) {
                    return true
                } else if (getmonth == findpromotion[0].Monthstop_promo) {
                    if (getday < findpromotion[0].Daystop_promo) {
                        return true
                    } else if (getday == findpromotion[0].Daystop_promo) {
                        if (gethour < findpromotion[0].Hourstop_promo) {
                            return true
                        } else if (gethour == findpromotion[0].Hourstop_promo) {
                            if (getmin < findpromotion[0].Minstop_promo) {
                                return true
                            } else if (getmin == findpromotion[0].Minstop_promo) {
                                return true
                            } else {
                                return 'no'
                            }
                        } else {
                            return 'no'
                        }
                    } else {
                        return 'no'
                    }
                } else {
                    return 'no'
                }
            } else {
                return 'no'
            }
        } else {
            return 'no'
        }
    } catch (err) {
        if (err) {
            console.log(err)
            return 'no'
        }
    }
}

const checkmenupromotion = async (array, Iduser, Idpromotion) => {
    // fail variable 
    // && isNaN(Idorder) !== true    and have seome value Idorder
    try {
        const checkarray = Array.isArray(array)
        if (checkarray == true) {
            const checkoriginalprice = array.findIndex(x => x.originalprice !== undefined)
            const checkdiscountprice = array.findIndex(x => x.discountprice !== undefined)
            const checksumprice = array.findIndex(x => x.sumprice !== undefined)
            if (checkoriginalprice > -1 && checkdiscountprice > -1 && checksumprice > -1) {
                if (isNaN(Iduser) !== true && isNaN(Idpromotion) !== true) {
                    if (array.length - 3 >= 1) {
                        const [checkorder] = await dbsync.execute("SELECT Id_usr_addor,Id_shop_addor FROM addorder WHERE Id_usr_addor=?", [Iduser])
                        if (checkorder.length > 0) {
                            const [checkuser] = await dbsync.execute("SELECT UserName_usr FROM users WHERE Id_usr=?", [checkorder[0].Id_usr_addor])
                            if (checkuser.length == 1 && checkorder[0].Id_usr_addor == Iduser) {
                                const [checkpromotion] = await dbsync.execute("SELECT Id_promo,Idshop_promo,Name_promo,Totalpurches_promo,Unitofnumber_promo,Discountorgive_promo,Amountornamemenu_promo FROM addpromotion WHERE Id_promo=?", [Idpromotion])
                                if (checkpromotion.length == 1) {
                                    const [checkvaluearraymenupromotion] = await dbsync.execute("SELECT * FROM arraymenupromotion WHERE Id_promo_menupromo=?", [checkpromotion[0].Id_promo])
                                    if (checkvaluearraymenupromotion.length > 0) {
                                        let pricevalue = 0
                                        let logvalue = []
                                        const lengtharraymenu = array.length
                                        let w = 0
                                        for (let i = 0; i < checkvaluearraymenupromotion.length; i++) {
                                            // console.log(checkpromotion[0].Id_promo)
                                            for (let p = 0; p < lengtharraymenu; p++) {
                                                // console.log(checkvaluearraymenupromotion.length)
                                                if (array[p].Idorder !== undefined && array[p].Idmenu !== undefined && array[p].Namemenu !== undefined && array[p].Picmenu !== undefined && array[p].Pricemenu !== undefined && array[p].Subjectandioption !== undefined && array[p].access !== undefined && array[p].oldornewvalue !== undefined) {
                                                    if (array[p].oldornewvalue == "old" && p !== checkoriginalprice && p !== checkdiscountprice && p !== checksumprice && array[p].access == null) {
                                                        if (array[p].Namemenu == checkvaluearraymenupromotion[i].Namemenu_menupromo && array[p].Idmenu == checkvaluearraymenupromotion[i].Idmenu_menuprommo) {
                                                            w += 1
                                                            logvalue.push(p)
                                                            pricevalue += array[p].Pricemenu
                                                            array[p].access = "success"
                                                            // console.log(pricevalue)
                                                            // console.log(w == checkvaluearraymenupromotion.length)
                                                            if (array[p].Subjectandioption !== null) {
                                                                let lengthsubject = array[p].Subjectandioption
                                                                if (lengthsubject.length > 0) {
                                                                    for (let y = 0; lengthsubject.length > y; y++) {
                                                                        for (let n = 0; lengthsubject[y].Option.length > n; n++) {
                                                                            if (lengthsubject[y].Option[n].Price_option_addor !== undefined) {
                                                                                let changpricetonumber = parseInt(lengthsubject[y].Option[n].Price_option_addor)
                                                                                pricevalue = parseInt(pricevalue)
                                                                                if (isNaN(changpricetonumber) !== true && typeof changpricetonumber === 'number' && typeof pricevalue === 'number') {
                                                                                    pricevalue += changpricetonumber
                                                                                    // console.log(pricevalue)
                                                                                }
                                                                            } else {
                                                                            }
                                                                        }
                                                                    }
                                                                } else { }
                                                            }
                                                            if (w == checkvaluearraymenupromotion.length) {
                                                                if (checkpromotion[0].Unitofnumber_promo == "บาท") {
                                                                    // console.log(checkpromotion[0].Totalpurches_promo)
                                                                    if (pricevalue >= checkpromotion[0].Totalpurches_promo) {
                                                                        if (checkpromotion[0].Discountorgive_promo == "ลด") {
                                                                            let disprice = parseInt(checkpromotion[0].Amountornamemenu_promo)
                                                                            if (isNaN(disprice) !== true) {
                                                                                array[checkdiscountprice].discountprice += disprice
                                                                                // array[checksumprice].sumprice = array[checkoriginalprice].originalprice - checkpromotion[0].Amountornamemenu_promo
                                                                                array[checksumprice].sumprice = array[checkoriginalprice].originalprice - array[checkdiscountprice].discountprice
                                                                                return array
                                                                            } else {
                                                                                if (logvalue.length > 0) {
                                                                                    const lengthlog = logvalue.length
                                                                                    for (let c = 0; c < lengthlog; c++) {
                                                                                        array[logvalue[c]].access = null
                                                                                        pricevalue = 0
                                                                                        if (c == lengthlog - 1) {
                                                                                            logvalue = []
                                                                                            array[checksumprice].sumprice = array[checkoriginalprice].originalprice - array[checkdiscountprice].discountprice
                                                                                            return array
                                                                                        }
                                                                                    }
                                                                                } else {
                                                                                    array[checksumprice].sumprice = array[checkoriginalprice].originalprice - array[checkdiscountprice].discountprice
                                                                                    return array
                                                                                }
                                                                            }
                                                                        } else if (checkpromotion[0].Discountorgive_promo == "แถม") {
                                                                            const [checkvaluemenu] = await dbsync.execute("SELECT Id_menu,Pic_menu,Name_menu,Price_menu FROM addmenu WHERE Id_shop_menu=? AND Name_menu=?", [checkpromotion[0].Idshop_promo, checkpromotion[0].Amountornamemenu_promo])
                                                                            if (checkvaluemenu.length == 1) {
                                                                                const randomint = random.int(1000000000, 9999999999)
                                                                                array.push({ Idorder: randomint, Idmenu: checkvaluemenu[0].Id_menu, Namemenu: checkvaluemenu[0].Name_menu, Picmenu: checkvaluemenu[0].Pic_menu, Pricemenu: checkvaluemenu[0].Price_menu, Subjectandioption: null, access: "success", oldornewvalue: 'new' })
                                                                                array[checksumprice].sumprice = array[checkoriginalprice].originalprice - array[checkdiscountprice].discountprice
                                                                                return array
                                                                            } else {
                                                                                if (logvalue.length > 0) {
                                                                                    const lengthlog = logvalue.length
                                                                                    for (let c = 0; c < lengthlog; c++) {
                                                                                        array[logvalue[c]].access = null
                                                                                        pricevalue = 0
                                                                                        if (c == lengthlog - 1) {
                                                                                            logvalue = []
                                                                                            array[checksumprice].sumprice = array[checkoriginalprice].originalprice - array[checkdiscountprice].discountprice
                                                                                            return array
                                                                                        }
                                                                                    }
                                                                                } else {
                                                                                    array[checksumprice].sumprice = array[checkoriginalprice].originalprice - array[checkdiscountprice].discountprice
                                                                                    return array
                                                                                }
                                                                            }
                                                                        } else {
                                                                            if (logvalue.length > 0) {
                                                                                const lengthlog = logvalue.length
                                                                                for (let c = 0; c < lengthlog; c++) {
                                                                                    array[logvalue[c]].access = null
                                                                                    pricevalue = 0
                                                                                    if (c == lengthlog - 1) {
                                                                                        logvalue = []
                                                                                        array[checksumprice].sumprice = array[checkoriginalprice].originalprice - array[checkdiscountprice].discountprice
                                                                                        return array
                                                                                    }
                                                                                }
                                                                            } else {
                                                                                array[checksumprice].sumprice = array[checkoriginalprice].originalprice - array[checkdiscountprice].discountprice
                                                                                return array
                                                                            }
                                                                        }
                                                                    } else {
                                                                        if (logvalue.length > 0) {
                                                                            const lengthlog = logvalue.length
                                                                            for (let c = 0; c < lengthlog; c++) {
                                                                                array[logvalue[c]].access = null
                                                                                pricevalue = 0
                                                                                if (c == lengthlog - 1) {
                                                                                    logvalue = []
                                                                                    array[checksumprice].sumprice = array[checkoriginalprice].originalprice - array[checkdiscountprice].discountprice
                                                                                    return array
                                                                                }
                                                                            }
                                                                        } else {
                                                                            array[checksumprice].sumprice = array[checkoriginalprice].originalprice - array[checkdiscountprice].discountprice
                                                                            return array
                                                                        }
                                                                    }
                                                                } else {
                                                                    if (logvalue.length > 0) {
                                                                        const lengthlog = logvalue.length
                                                                        for (let c = 0; c < lengthlog; c++) {
                                                                            array[logvalue[c]].access = null
                                                                            pricevalue = 0
                                                                            if (c == lengthlog - 1) {
                                                                                logvalue = []
                                                                                array[checksumprice].sumprice = array[checkoriginalprice].originalprice - array[checkdiscountprice].discountprice
                                                                                return array
                                                                            }
                                                                        }
                                                                    } else {
                                                                        array[checksumprice].sumprice = array[checkoriginalprice].originalprice - array[checkdiscountprice].discountprice
                                                                        return array
                                                                    }
                                                                }
                                                            } else if (w !== checkvaluearraymenupromotion.length && i == checkvaluearraymenupromotion.length - 1) {
                                                                if (logvalue.length > 0) {
                                                                    const lengthlog = logvalue.length
                                                                    for (let c = 0; c < lengthlog; c++) {
                                                                        array[logvalue[c]].access = null
                                                                        pricevalue = 0
                                                                        if (c == lengthlog - 1) {
                                                                            logvalue = []
                                                                            array[checksumprice].sumprice = array[checkoriginalprice].originalprice - array[checkdiscountprice].discountprice
                                                                            return array
                                                                        }
                                                                    }
                                                                } else {
                                                                    array[checksumprice].sumprice = array[checkoriginalprice].originalprice - array[checkdiscountprice].discountprice
                                                                    return array
                                                                }
                                                            }
                                                            // console.log(array[p])
                                                            p = array.length - 1
                                                        } else {
                                                            if (i == checkvaluearraymenupromotion.length - 1 && p == lengtharraymenu - 1 && logvalue.length > 0) {
                                                                const lengthlog = logvalue.length
                                                                for (let c = 0; c < lengthlog; c++) {
                                                                    array[logvalue[c]].access = null
                                                                    pricevalue = 0
                                                                    if (c == lengthlog - 1) {
                                                                        logvalue = []
                                                                        array[checksumprice].sumprice = array[checkoriginalprice].originalprice - array[checkdiscountprice].discountprice
                                                                        return array
                                                                    }
                                                                }
                                                            } else if (i == checkvaluearraymenupromotion.length - 1 && p == lengtharraymenu - 1) {
                                                                array[checksumprice].sumprice = array[checkoriginalprice].originalprice - array[checkdiscountprice].discountprice
                                                                return array
                                                            }
                                                        }
                                                    } else {

                                                        if (i == checkvaluearraymenupromotion.length - 1 && p == lengtharraymenu - 1 && logvalue.length > 0) {
                                                            const lengthlog = logvalue.length
                                                            for (let c = 0; c < lengthlog; c++) {
                                                                array[logvalue[c]].access = null
                                                                pricevalue = 0
                                                                if (c == lengthlog - 1) {
                                                                    logvalue = []
                                                                    array[checksumprice].sumprice = array[checkoriginalprice].originalprice - array[checkdiscountprice].discountprice
                                                                    return array
                                                                }
                                                            }
                                                        } else if (i == checkvaluearraymenupromotion.length - 1 && p == lengtharraymenu - 1) {
                                                            array[checksumprice].sumprice = array[checkoriginalprice].originalprice - array[checkdiscountprice].discountprice
                                                            return array
                                                        }
                                                    }
                                                } else if (p == checkoriginalprice || p == checkdiscountprice || p == checksumprice) {
                                                    if (i == checkvaluearraymenupromotion.length - 1 && p == lengtharraymenu - 1 && logvalue.length > 0) {
                                                        const lengthlog = logvalue.length
                                                        for (let c = 0; c < lengthlog; c++) {
                                                            array[logvalue[c]].access = null
                                                            pricevalue = 0
                                                            if (c == lengthlog - 1) {
                                                                logvalue = []
                                                                array[checksumprice].sumprice = array[checkoriginalprice].originalprice - array[checkdiscountprice].discountprice
                                                                return array
                                                            }
                                                        }
                                                    } else if (i == checkvaluearraymenupromotion.length - 1 && p == lengtharraymenu - 1) {
                                                        array[checksumprice].sumprice = array[checkoriginalprice].originalprice - array[checkdiscountprice].discountprice
                                                        return array
                                                    }
                                                }
                                                // else if() {
                                                //     return "no"
                                                // }
                                                else {
                                                    // console.log(array[p])
                                                    return "no"
                                                }
                                            }
                                        }
                                    } else {
                                        return array
                                    }
                                } else {
                                    return "no"
                                }
                            } else {
                                return "no"
                            }
                        } else {
                            return "no"
                        }
                    } else {
                        return "no"
                    }
                } else {
                    return "no"
                }
            } else {
                return "no"
            }
        } else {
            return "no"
        }
    } catch (err) {
        if (err) {
            console.log(err)
            return "something error"
        }
    }
}

// variable 
// oldornewvalue

// delete ordermenu
const deleteordermenu = async (req, res) => {
    try {
        let Idorder = req.body.Idorder
        const Nameuser = req.body.Nameuser
        const Token = req.body.Token
        // console.log(Idorder)
        if (Idorder !== undefined && Nameuser !== undefined && Token !== undefined) {
            Idorder = parseInt(Idorder)
            if (isNaN(Idorder) !== true ) {
                const [findorder] = await dbsync.execute("SELECT * FROM addorder WHERE Id_addor=?", [Idorder])
                if (findorder.length == 1) {
                    const [finduser] = await dbsync.execute("SELECT * FROM users WHERE UserName_usr=? AND Gen_usr=?", [Nameuser, Token])
                    if (finduser.length == 1) {
                        if (findorder[0].Id_usr_addor == finduser[0].Id_usr) {
                            const [findsubject] = await dbsync.execute("SELECT * FROM addordersubject WHERE Id_addor_addorsub=?", [findorder[0].Id_addor])
                            if (findsubject.length >= 1) {
                                for (let i = 0; i < findsubject.length; i++) {
                                    const [findorderoption] = await dbsync.execute("SELECT * FROM addorderoption WHERE Id_sub_option_addor=?", [findsubject[i].Id_sub_addor])
                                    if (findorderoption.length >= 1) {
                                        await dbsync.execute("DELETE FROM addordersubject WHERE Id_sub_addor=?", [findsubject[i].Id_sub_addor])
                                        await dbsync.execute("DELETE FROM addorderoption WHERE Id_sub_option_addor=?", [findsubject[i].Id_sub_addor])
                                        if (i == findsubject.length - 1) {
                                            await dbsync.execute("DELETE FROM addorder WHERE Id_addor=?", [findorder[0].Id_addor])
                                            res.send("delete success")
                                        }
                                    } else if (findorderoption.length == 0) {
                                        await dbsync.execute("DELETE FROM addordersubject WHERE Id_sub_addor=?", [findsubject[i].Id_sub_addor])
                                        if (i == findsubject.length - 1) {
                                            await dbsync.execute("DELETE FROM addorder WHERE Id_addor=?", [findorder[0].Id_addor])
                                            res.send("delete success")
                                        }
                                    } else {
                                        if (i == findsubject.length - 1) {
                                            await dbsync.execute("DELETE FROM addorder WHERE Id_addor=?", [findorder[0].Id_addor])
                                            res.send("delete success")
                                        }
                                    }
                                }
                            } else if (findsubject.length == 0) {
                                await dbsync.execute("DELETE FROM addorder WHERE Id_addor=?", [findorder[0].Id_addor])
                                res.send("delete success")
                            } else {
                                res.send("something wrong")
                            }
                        } else {
                            res.send("this order don't match in your data")
                        }
                    } else if (finduser.length == 0) {
                        res.send("you don't have user in data")
                    } else {
                        res.send("something wrong")
                    }
                } else if (findorder.length == 0) {
                    res.send("you don't have this order in data")
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
            console.log(err)
            res.send("have some error")
        }
    }
}


const editordermenu = async (req, res) => {
    try {
        let Idorder = req.body.Idorder
        const Nameuser = req.body.Nameuser
        const Token = req.body.Token
        if (Idorder !== undefined && Nameuser !== undefined && Token !== undefined) {
            Idorder = parseInt(Idorder)
            if (isNaN(Idorder) !== true) {
                const [findorder] = await dbsync.execute("SELECT * FROM addorder WHERE Id_addor=?", [Idorder])
                if (findorder.length == 1) {
                    const [finduser] = await dbsync.execute("SELECT * FROM users WHERE UserName_usr=? AND Gen_usr=?", [Nameuser, Token])
                    if (finduser.length == 1) {
                        if (findorder[0].Id_usr_addor == finduser[0].Id_usr) {
                            const [findsubject] = await dbsync.execute("SELECT * FROM addordersubject WHERE Id_addor_addorsub=?", [findorder[0].Id_addor])
                            let allvalue = []
                            if (findsubject.length >= 1) {
                                let valuesubandoption = []
                                for (let i = 0; i < findsubject.length; i++) {
                                    const [findoption] = await dbsync.execute("SELECT * FROM addorderoption WHERE Id_sub_option_addor=?", [findsubject[i].Id_sub_addor])
                                    if (findoption.length > 0) {
                                        valuesubandoption.push({ Namesubject: findsubject[i].Name_sub_addor, Option: findoption })
                                        if (i == findsubject.length - 1) {
                                            const [sendordermenu] = await dbsync.execute("SELECT Id_menu,Pic_menu,Name_menu,Price_menu FROM addmenu WHERE Id_menu=?", [findorder[0].Id_menu_addor])
                                            if (sendordermenu.length == 1) {
                                                allvalue.push({ Idorder: findorder[0].Id_addor, Idmenu: sendordermenu[0].Id_menu, Pricemenu: sendordermenu[0].Price_menu, Picmenu: sendordermenu[0].Pic_menu, Namemenu: sendordermenu[0].Name_menu, Subjectandioption: valuesubandoption, access: null, oldornewvalue: "old" })
                                                res.send(allvalue)
                                            } else if (sendordermenu.length == 0) {
                                                res.send("something wrong")
                                            } else {
                                                res.send("something wrong")
                                            }
                                        }
                                    } else {
                                        if (i == findsubject.length - 1) {
                                            const [sendordermenu] = await dbsync.execute("SELECT Id_menu,Pic_menu,Name_menu,Price_menu FROM addmenu WHERE Id_menu=?", [findorder[0].Id_menu_addor])
                                            if (sendordermenu.length == 1) {
                                                allvalue.push({ Idorder: findorder[0].Id_addor, Idmenu: sendordermenu[0].Id_menu, Pricemenu: sendordermenu[0].Price_menu, Picmenu: sendordermenu[0].Pic_menu, Namemenu: sendordermenu[0].Name_menu, Subjectandioption: valuesubandoption, access: null, oldornewvalue: "old" })
                                                res.send(allvalue)
                                            } else if (sendordermenu.length == 0) {
                                                res.send("something wrong")
                                            } else {
                                                res.send("something wrong")
                                            }
                                        }
                                    }
                                }
                            } else if (findsubject.length == 0) {
                                const [sendordermenu] = await dbsync.execute("SELECT Id_menu,Pic_menu,Name_menu,Price_menu FROM addmenu WHERE Id_menu=?", [findorder[0].Id_menu_addor])
                                if (sendordermenu.length == 1) {
                                    allvalue.push({ Idorder: findorder[0].Id_addor, Idmenu: sendordermenu[0].Id_menu, Pricemenu: sendordermenu[0].Price_menu, Picmenu: sendordermenu[0].Pic_menu, Namemenu: sendordermenu[0].Name_menu, Subjectandioption: null, access: null, oldornewvalue: "old" })
                                    res.send(allvalue)
                                } else if (sendordermenu.length == 0) {
                                    res.send("something wrong")
                                } else {
                                    res.send("something wrong")
                                }
                            } else {
                                res.send("something wrong")
                            }
                        } else {
                            res.send("this order don't match in your data")
                        }
                    } else if (finduser.length == 0) {
                        res.send("you don't have user in data")
                    } else {
                        res.send("something wrong")
                    }
                } else if (findorder.length == 0) {
                    res.send("you don't have this order in data")
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
            console.log(err)
            res.send("have some error")
        }
    }
}

module.exports = { totalmenuorder, checkpromotion, checkmenupromotion, deleteordermenu, editordermenu, checkstoppromotion }






// test somt