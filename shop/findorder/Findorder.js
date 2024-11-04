const { response } = require("express")
const { ResultWithContext } = require("express-validator/src/chain")
const dbsync = require("D:/react_project/ppap/config/datasync")

//for find order shop 
const listordershop = async (req, res) => {
    try {
        let Idshop = req.body.Idshop
        if (Idshop !== undefined) {
            Idshop = parseInt(Idshop)
            if (isNaN(Idshop) !== true) {
                let [findordershop] = await dbsync.execute("SELECT * FROM paysuccess WHERE Id_shop_paysucess=? AND status_paysuccess=1 ORDER BY Datewanttogo_paysuccess", [Idshop])
                if (findordershop.length > 0) {
                    // for loop to check date 
                    for (let i = 0; findordershop.length > i; i++) {
                        // console.log(findordershop[i].Id_usr_paysuccess)
                        const [Teluser] = await dbsync.execute("SELECT Tel_usr FROM users WHERE Id_usr=?",[findordershop[i].Id_usr_paysuccess])
                        // console.log(Teluser.length)
                        const datenow = new Date()
                        let dateorder = new Date(findordershop[i].Datewanttogo_paysuccess)
                        if (dateorder !== null ) {
                            if (Teluser.length === 1){
                                // console.log(findordershop.length)
                                if (dateorder.getFullYear() <= datenow.getFullYear() && dateorder.getMonth() == datenow.getMonth() && dateorder.getDate() <= datenow.getDate()) {
                                    if (dateorder.getMonth() +1 <= datenow.getMonth() +1){
                                        findordershop[i].Datenowornot = "1"
                                        findordershop[i].Tel = Teluser[0].Tel_usr
                                        if (findordershop.length-1 == i){
                                            findordershop.push({Queue:findordershop.length})
                                            res.json(findordershop)
                                            break
                                        }
                                    }else if (dateorder.getMonth() +1 <= datenow.getMonth() +1){
                                        if (dateorder.getDate() <= datenow.getDate()){
                                            findordershop[i].Datenowornot = "1"
                                            findordershop[i].Tel = Teluser[0].Tel_usr
                                            if (findordershop.length-1 == i){
                                                findordershop.push({Queue:findordershop.length})
                                                res.json(findordershop)
                                                break
                                            }
                                        }else if (dateorder.getDate() == datenow.getDate()){
                                            findordershop[i].Datenowornot = "1"
                                            findordershop[i].Tel = Teluser[0].Tel_usr
                                            if (findordershop.length-1 == i){
                                                findordershop.push({Queue:findordershop.length})
                                                res.json(findordershop)
                                                break
                                            }
                                        }else{
                                            findordershop[i].Datenowornot = "2"
                                            findordershop[i].Tel = Teluser[0].Tel_usr
                                            if (findordershop.length - 1 == i) {
                                                findordershop.push({Queue:findordershop.length})
                                                res.json(findordershop)
                                                break
                                            }
                                        }
                                    }else{
                                        findordershop[i].Datenowornot = "2"
                                        findordershop[i].Tel = Teluser[0].Tel_usr
                                        if (findordershop.length - 1 == i) {
                                            findordershop.push({Queue:findordershop.length})
                                            res.json(findordershop)
                                            break
                                        }
                                    }
                                } else {
                                    findordershop[i].Datenowornot = "2"
                                    findordershop[i].Tel = Teluser[0].Tel_usr
                                    if (findordershop.length - 1 == i) {
                                        findordershop.push({Queue:findordershop.length})
                                        res.json(findordershop)
                                        break
                                    }
                                }
                            }else{
                                if (findordershop.length - 1 == i && findordershop.length > 0) {
                                    findordershop.push({Queue:findordershop.length})
                                    res.json(findordershop)
                                    break
                                }else if (findordershop.length - 1 == i && findordershop.length === 0){
                                    res.send("don't have order in this moment")
                                }
                            }
                        } else {
                            if (findordershop.length - 1 == i) {
                                findordershop.push({Queue:findordershop.length})
                                res.json(findordershop)
                                break
                            }
                        }
                    }
                } else {
                    res.send("your shop don't have order in this time")
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
            res.send('have some error')
        }
    }
}

const findshopmenorder = async (req, res) => {
    try {
        let Idshop = req.body.Idshop
        let Idorder = req.body.Idorder
        if (Idshop !== undefined && Idorder !== undefined) {
            Idshop = parseInt(Idshop)
            Idorder = parseInt(Idorder)
            if (isNaN(Idshop) !== true && isNaN(Idorder) !== true) {
                const [findpaysuccess] = await dbsync.execute("SELECT * FROM paysuccess WHERE Id_order_paysuccess=? AND Id_shop_paysucess=? ", [Idorder, Idshop])
                if (findpaysuccess.length == 1) {
                    const fornullvalue = [
                        {
                            "Idsubject": 0,
                            "Namesubject": "0",
                            "Option": [
                                {
                                    "Idoption": 0,
                                    "Nameoption": "0",
                                    "Priceoption": "0"
                                }
                            ]
                        }
                    ]
                    let allvalue = []
                    let keepmenuandsubjectandoption = []
                    let keepsubject = []
                    let keepoption = []
                    let keepsubjectandoption = []
                    const [findorder] = await dbsync.execute("SELECT * FROM addorder WHERE Id_shop_addor=? AND Idorder_addor=? AND Status_addor=2", [Idshop, Idorder])
                    if (findorder.length > 0) {
                        for (let i = 0; i < findorder.length; i++) {
                            const [findsubject] = await dbsync.execute("SELECT * FROM addordersubject WHERE Id_addor_addorsub=?", [findorder[i].Id_addor])
                            if (findsubject.length > 0) {
                                for (let o = 0; o < findsubject.length; o++) {
                                    keepsubject.push({ Idsubject: findsubject[o].Id_sub_addor, Namesubject: findsubject[o].Name_sub_addor })
                                    const [findoption] = await dbsync.execute("SELECT * FROM addorderoption WHERE Id_sub_option_addor=?", [findsubject[o].Id_sub_addor])
                                    if (findoption.length > 0) {
                                        for (let p = 0; p < findoption.length; p++) {
                                            // console.log(i)
                                            keepoption.push({ Idoption: findoption[p].Id_addor_option, Nameoption: findoption[p].Name_option_addor, Priceoption: findoption[p].Price_option_addor })
                                            if (findoption.length - 1 == p) {
                                                keepsubjectandoption.push({ Idsubject: keepsubject[0].Idsubject, Namesubject: keepsubject[0].Namesubject, Option: keepoption })
                                                keepsubject = []
                                                keepoption = []
                                            }
                                            if (findsubject.length - 1 == o && findoption.length - 1 == p) {
                                                // console.log(i)
                                                keepmenuandsubjectandoption.push({ Idmenu: findorder[i].Id_menu_addor, Nememenu: findorder[i].Name_menu_addor,Comment:findorder[i].Comment_addor, Subjectandoption: keepsubjectandoption })
                                                keepsubjectandoption = []
                                            }
                                            if (findsubject.length - 1 == o && findoption.length - 1 == p && findorder.length - 1 == i) {
                                                const [finduser] = await dbsync.execute("SELECT UserName_usr FROM users WHERE Id_usr=?", [findpaysuccess[0].Id_usr_paysuccess])
                                                if (finduser.length == 1) {
                                                    allvalue.push({ Idpaysuccess: findpaysuccess[0].Id_paysuccess, Idorder: findpaysuccess[0].Id_order_paysuccess, Username: finduser[0].UserName_usr, Priceorder: findpaysuccess[0].Pricetotal_paysuccess, Datewanntogo: findpaysuccess[0].Datewanttogo_paysuccess, Menuandsubjectandoption: keepmenuandsubjectandoption })
                                                    res.json(allvalue)
                                                } else {
                                                    res.send("you don't have user in data")
                                                }
                                            }
                                        }
                                    } else {
                                        keepsubject = []
                                        if (findsubject.length - 1 == o) {
                                            // console.log(i)
                                            if (keepsubjectandoption.length > 0) {
                                                keepmenuandsubjectandoption.push({ Idmenu: findorder[i].Id_menu_addor, Nememenu: findorder[i].Name_menu_addor,Comment:findorder[i].Comment_addor, Subjectandoption: keepsubjectandoption })
                                                keepsubjectandoption = []
                                            } else {
                                                keepmenuandsubjectandoption.push({ Idmenu: findorder[i].Id_menu_addor, Nememenu: findorder[i].Name_menu_addor, Subjectandoption: fornullvalue })
                                                keepsubjectandoption = []
                                            }
                                        }
                                        if (findsubject.length - 1 == o && findorder.length - 1 == i) {
                                            const [finduser] = await dbsync.execute("SELECT UserName_usr FROM users WHERE Id_usr=?", [findpaysuccess[0].Id_usr_paysuccess])
                                            if (finduser.length == 1) {
                                                allvalue.push({ Idpaysuccess: findpaysuccess[0].Id_paysuccess, Idorder: findpaysuccess[0].Id_order_paysuccess, Username: finduser[0].UserName_usr, Priceorder: findpaysuccess[0].Pricetotal_paysuccess, Datewanntogo: findpaysuccess[0].Datewanttogo_paysuccess, Menuandsubjectandoption: keepmenuandsubjectandoption })
                                                res.json(allvalue)
                                            } else {
                                                res.send("you don't have user in data")
                                            }
                                        }
                                    }
                                }
                            } else {
                                keepmenuandsubjectandoption.push({ Idmenu: findorder[i].Id_menu_addor, Nememenu: findorder[i].Name_menu_addor,Comment:findorder[i].Comment_addor, Subjectandoption: fornullvalue })
                                if (findorder.length - 1 == i) {
                                    const [finduser] = await dbsync.execute("SELECT UserName_usr FROM users WHERE Id_usr=?", [findpaysuccess[0].Id_usr_paysuccess])
                                    if (finduser.length == 1) {
                                        allvalue.push({ Idpaysuccess: findpaysuccess[0].Id_paysuccess, Idorder: findpaysuccess[0].Id_order_paysuccess, Username: finduser[0].UserName_usr, Priceorder: findpaysuccess[0].Pricetotal_paysuccess, Datewanntogo: findpaysuccess[0].Datewanttogo_paysuccess, Menuandsubjectandoption: keepmenuandsubjectandoption })
                                        res.json(allvalue)
                                    } else {
                                        res.send("you don't have user in data")
                                    }
                                }
                            }
                        }
                    } else if (findorder.length == 0) {
                        res.send("you don't have menu in this order")
                    } else {
                        res.send("something wrong")
                    }
                } else if (findpaysuccess.length == 0) {
                    res.send("you don't have this order in data")
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

// for find order users 
const listorderuser = async (req, res) => {
    try {
        let Iduser = req.body.Iduser
        if (Iduser !== undefined) {
            Iduser = parseInt(Iduser)
            if (isNaN(Iduser) !== true) {
                let [findorderuser] = await dbsync.execute(`SELECT * FROM paysuccess WHERE Id_usr_paysuccess=? AND Status_paysuccess>=2  ORDER BY Datewanttogo_paysuccess DESC`, [Iduser])
                // console.log(findorderuser.length)
                // const foundvalue = findorderuser.find(e => e.Id_order_paysuccess === 61367412493)
                // console.log(foundvalue)
                if (findorderuser.length > 0) {
                    // for loop to check date 
                    for (let i = 0; findorderuser.length > i; i++) {
                        const datenow = new Date()
                        let dateorder = new Date(findorderuser[i].Datewanttogo_paysuccess)
                        // console.log(dateorder)
                        if (dateorder !== null && isNaN(dateorder) !== true) {
                            // console.log(findorderuser[i].Id_order_paysuccess === 61367412493)
                            if (dateorder.getFullYear() <= datenow.getFullYear() && dateorder.getMonth() <= datenow.getMonth() && dateorder.getDate() <= datenow.getDate()) {
                                findorderuser[i].Datewanttogo_paysuccess = dateorder
                                findorderuser[i].Datenowornot = "1"
                                if (findorderuser.length-1 == i){
                                    const sortedDESC = findorderuser.sort(
                                        (objA, objB) => Number(objB.Datewanttogo_paysuccess) - Number(objA.Datewanttogo_paysuccess),
                                      )
                                    res.json(sortedDESC)
                                }
                            } else {
                                findorderuser[i].Datewanttogo_paysuccess = dateorder
                                findorderuser[i].Datenowornot = "2"
                                if (findorderuser.length - 1 == i) {
                                    const sortedDESC = findorderuser.sort(
                                        (objA, objB) => Number(objB.Datewanttogo_paysuccess) - Number(objA.Datewanttogo_paysuccess),
                                      )
                                    res.json(sortedDESC)
                                }
                            }
                        } else {
                            findorderuser[i].Datewanttogo_paysuccess = dateorder
                            if (findorderuser.length - 1 == i) {
                                const sortedDESC = findorderuser.sort(
                                    (objA, objB) => Number(objB.Datewanttogo_paysuccess) - Number(objA.Datewanttogo_paysuccess),
                                  )
                                res.json(sortedDESC)
                            }
                        }
                    }
                } else {
                    res.send("your user don't have order in this time")
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
            res.send('have some error')
        }
    }
}

const findusermenuorder = async (req, res) => {
    try {
        let Iduser = req.body.Iduser
        let Idorder = req.body.Idorder
        if (Iduser !== undefined && Idorder !== undefined) {
            Iduser = parseInt(Iduser)
            Idorder = parseInt(Idorder)
            if (isNaN(Iduser) !== true && isNaN(Idorder) !== true) {
                const [findpaysuccess] = await dbsync.execute("SELECT * FROM paysuccess WHERE Id_order_paysuccess=? AND Id_usr_paysuccess=? ORDER BY Date_paysuccess DESC", [Idorder, Iduser])
                // console.log(findpaysuccess.length)
                if (findpaysuccess.length == 1) {
                    const fornullvalue = [
                        {
                            "Idsubject": 0,
                            "Namesubject": "0",
                            "Option": [
                                {
                                    "Idoption": 0,
                                    "Nameoption": "0",
                                    "Priceoption": "0"
                                }
                            ]
                        }
                    ]
                    let allvalue = []
                    let keepmenuandsubjectandoption = []
                    let keepsubject = []
                    let keepoption = []
                    let keepsubjectandoption = []
                    // don't sure do to add check status 4 // AND Status_addor!=4 // 
                    const [findorder] = await dbsync.execute("SELECT * FROM addorder WHERE Id_usr_addor=? AND Idorder_addor=? AND Status_addor!=1 ", [Iduser, Idorder])
                    if (findorder.length > 0) {
                        for (let i = 0; i < findorder.length; i++) {
                            const [findsubject] = await dbsync.execute("SELECT * FROM addordersubject WHERE Id_addor_addorsub=?", [findorder[i].Id_addor])
                            if (findsubject.length > 0) {
                                for (let o = 0; o < findsubject.length; o++) {
                                    keepsubject.push({ Idsubject: findsubject[o].Id_sub_addor, Namesubject: findsubject[o].Name_sub_addor })
                                    const [findoption] = await dbsync.execute("SELECT * FROM addorderoption WHERE Id_sub_option_addor=?", [findsubject[o].Id_sub_addor])
                                    if (findoption.length > 0) {
                                        for (let p = 0; p < findoption.length; p++) {
                                            // console.log(i)
                                            keepoption.push({ Idoption: findoption[p].Id_addor_option, Nameoption: findoption[p].Name_option_addor, Priceoption: findoption[p].Price_option_addor })
                                            if (findoption.length - 1 == p) {
                                                keepsubjectandoption.push({ Idsubject: keepsubject[0].Idsubject, Namesubject: keepsubject[0].Namesubject, Option: keepoption })
                                                keepsubject = []
                                                keepoption = []
                                            }
                                            if (findsubject.length - 1 == o && findoption.length - 1 == p) {
                                                // console.log(i)
                                                keepmenuandsubjectandoption.push({ Idmenu: findorder[i].Id_menu_addor, Nememenu: findorder[i].Name_menu_addor, Subjectandoption: keepsubjectandoption })
                                                keepsubjectandoption = []
                                            }
                                            if (findsubject.length - 1 == o && findoption.length - 1 == p && findorder.length - 1 == i) {
                                                const [finduser] = await dbsync.execute("SELECT UserName_usr FROM users WHERE Id_usr=?", [findpaysuccess[0].Id_usr_paysuccess])
                                                if (finduser.length == 1) {
                                                    allvalue.push({ Idpaysuccess: findpaysuccess[0].Id_paysuccess, Idorder: findpaysuccess[0].Id_order_paysuccess, Username: finduser[0].UserName_usr, Priceorder: findpaysuccess[0].Pricetotal_paysuccess, Datewanntogo: findpaysuccess[0].Datewanttogo_paysuccess, Menuandsubjectandoption: keepmenuandsubjectandoption })
                                                    res.json(allvalue)
                                                } else {
                                                    res.send("you don't have user in data")
                                                }
                                            }
                                        }
                                    } else {
                                        keepsubject = []
                                        if (findsubject.length - 1 == o) {
                                            // console.log(i)
                                            if (keepsubjectandoption.length > 0) {
                                                keepmenuandsubjectandoption.push({ Idmenu: findorder[i].Id_menu_addor, Nememenu: findorder[i].Name_menu_addor, Subjectandoption: keepsubjectandoption })
                                                keepsubjectandoption = []
                                            } else {
                                                keepmenuandsubjectandoption.push({ Idmenu: findorder[i].Id_menu_addor, Nememenu: findorder[i].Name_menu_addor, Subjectandoption: fornullvalue })
                                                keepsubjectandoption = []
                                            }
                                        }
                                        if (findsubject.length - 1 == o && findorder.length - 1 == i) {
                                            const [finduser] = await dbsync.execute("SELECT UserName_usr FROM users WHERE Id_usr=?", [findpaysuccess[0].Id_usr_paysuccess])
                                            if (finduser.length == 1) {
                                                allvalue.push({ Idpaysuccess: findpaysuccess[0].Id_paysuccess, Idorder: findpaysuccess[0].Id_order_paysuccess, Username: finduser[0].UserName_usr, Priceorder: findpaysuccess[0].Pricetotal_paysuccess, Datewanntogo: findpaysuccess[0].Datewanttogo_paysuccess, Menuandsubjectandoption: keepmenuandsubjectandoption })
                                                res.json(allvalue)
                                            } else {
                                                res.send("you don't have user in data")
                                            }
                                        }
                                    }
                                }
                            } else {
                                keepmenuandsubjectandoption.push({ Idmenu: findorder[i].Id_menu_addor, Nememenu: findorder[i].Name_menu_addor, Subjectandoption: fornullvalue })
                                if (findorder.length - 1 == i) {
                                    const [finduser] = await dbsync.execute("SELECT UserName_usr FROM users WHERE Id_usr=?", [findpaysuccess[0].Id_usr_paysuccess])
                                    if (finduser.length == 1) {
                                        allvalue.push({ Idpaysuccess: findpaysuccess[0].Id_paysuccess, Idorder: findpaysuccess[0].Id_order_paysuccess, Username: finduser[0].UserName_usr, Priceorder: findpaysuccess[0].Pricetotal_paysuccess, Datewanntogo: findpaysuccess[0].Datewanttogo_paysuccess, Menuandsubjectandoption: keepmenuandsubjectandoption })
                                        res.json(allvalue)
                                    } else {
                                        res.send("you don't have user in data")
                                    }
                                }
                            }
                        }
                    } else if (findorder.length == 0) {
                        res.send("you don't have menu in this order")
                    } else {
                        res.send("something wrong")
                    }
                } else if (findpaysuccess.length == 0) {
                    res.send("you don't have this order in data")
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
module.exports = { listordershop, findshopmenorder, listorderuser, findusermenuorder  }


// findordershop[i].Datenowornot = "1"
//                                 if (findordershop.length-1 == i){
//                                     findordershop.push({Queue:findordershop.length})
//                                     res.json(findordershop)
//                                     break
//                                 }