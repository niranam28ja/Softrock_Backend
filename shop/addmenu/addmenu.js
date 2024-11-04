// const express = require("express")
const { json } = require("body-parser")
const e = require("express")
const { response } = require("express")
const { check } = require("express-validator")
const { showcategory, showmenuUsecatfind } = require("../../public/showshopandmenu/Showshopandmenu")
const dbsync = require("D:/react_project/ppap/config/datasync")


const addmenu = async (req, res) => {
    try {
        let Idshop = req.body.Idshop
        let Iduser = req.body.Iduser
        const Pic = req.body.Pic
        const Name = req.body.Name
        let Price = req.body.Price
        let Time = req.body.Time
        const Gen = req.body.Gen
        const Category = req.body.Category
        if (Idshop !== undefined && Pic !== undefined && Name !== undefined && Price !== undefined && Time !== undefined && Gen !== undefined && Iduser !== undefined && Category !== undefined) {
            Idshop = parseInt(Idshop)
            Price = parseInt(Price)
            Time = parseInt(Time)
            Iduser = parseInt(Iduser)
            // console.log(Idshop)
            // console.log(Price)
            // console.log(Time)
            // console.log(Iduser)
            if (isNaN(Idshop) !== true && isNaN(Price) !== true && isNaN(Time) !== true && isNaN(Iduser) !== true && typeof Pic === "string" && typeof Name === "string" && typeof Gen === "string") {
                const [SQL] = await dbsync.execute("SELECT Gen_usr FROM users")
                // console.log(SQL)
                const csql = SQL.some(SQL => SQL.Gen_usr === Gen)
                if (csql === true) {
                    const [data] = await dbsync.execute("SELECT Id_shop FROM profileshop")
                    const cdata = data.some(data => data.Id_shop === Idshop)
                    if (cdata === true) {
                        const [sname] = await dbsync.execute("SELECT Name_menu FROM addmenu WHERE Id_shop_menu=?", [Idshop])
                        const cshop = sname.some(pp => pp.Name_menu === Name)
                        if (cshop === true) {
                            res.send("you Name menu used")
                        } else {
                            const [sdata] = await dbsync.execute("SELECT Id_usr, UserName_usr FROM users WHERE Gen_usr=?", [Gen])
                            // console.log(sdata[0],Id)
                            if (Iduser == sdata[0].Id_usr) {
                                const [showshop] = await dbsync.execute("SELECT Name_shop FROM profileshop WHERE Id_shop=?", [Idshop])
                                if (showshop.length >= 1) {
                                    const [rows] = await dbsync.execute("INSERT INTO addmenu (Id_shop_menu,Name_shop_menu,Pic_menu,Name_menu,Price_menu,Category_menu,Time_menu,Idusr_menu,Status_menu) VALUES (?,?,?,?,?,?,?,?,0)", [Idshop, showshop[0].Name_shop, Pic, Name, Price, Category, Time, sdata[0].Id_usr])
                                    const [sid] = await dbsync.execute("SELECT Id_menu FROM addmenu WHERE Id_shop_menu=? AND Name_menu=?", [Idshop, Name])
                                    res.json(sid[0].Id_menu)
                                } else {
                                    // console.log("efefefef")
                                    res.send("your idshop is not match")
                                }
                            } else {
                                // console.log("[[][;")
                                res.send("your name don't have in data")
                            }
                        }
                    } else {
                        // console.log("pp;[]]")
                        res.send("your idshop is not match")
                    }
                } else {
                    // console.log("]][asd.")
                    res.send("Gen wrong")
                }
            } else {
                // console.log("]],,l;")
                // console.log(Idshop)
                // console.log(Price)
                // console.log(Time)
                // console.log(Iduser)
                res.send("your values int is null")
            }

        } else {
            res.send("NO!!")
        }
    } catch (err) {
        if (err) {
            throw err
        }
    }
}

const addcategory = async (req, res) => {
    try {
        let Idshop = req.body.Idshop
        const Nameshop = req.body.Nameshop
        const Namecategory = req.body.Namecategory
        if (Idshop !== undefined && Nameshop !== undefined && Namecategory !== undefined) {
            Idshop = parseInt(Idshop)
            if (isNaN(Idshop) !== true) {
                const [showshop] = await dbsync.execute("SELECT Id_shop,Name_shop FROM profileshop WHERE Id_shop=? AND Name_shop=?", [Idshop, Nameshop])
                if (showshop.length == 1) {
                    const [showcat] = await dbsync.execute("SELECT * FROM category WHERE Id_shop_cat=? AND Name_shop_cat=?", [Idshop, Nameshop])
                    const ccat = showcat.some(pp => pp.Name_cat == Namecategory)
                    if (ccat === true) {
                        res.send("name category has been used")
                    } else {
                        const [addcat] = await dbsync.execute("INSERT INTO category (Id_shop_cat,Name_shop_cat,Name_cat) VALUES (?,?,?)", [Idshop, Nameshop, Namecategory])
                        res.send("success")
                    }
                } else if (showshop.length >= 2) {
                    res.send("something wrong")
                } else {
                    res.send("your don't have value shop")
                }
            } else {
                res.send("your values int is null")
            }
        } else {
            res.send()
        }
    } catch (err) {
        if (err) throw err
    }
}

const deletecategory = async (req, res) => {
    let Idcategory = req.body.Idcategory
    let Idshop = req.body.Idshop
    const Username = req.body.Username
    if (Idcategory !== undefined && Idshop !== undefined && Username !== undefined) {
        Idcategory = parseInt(Idcategory)
        Idshop = parseInt(Idshop)
        if (isNaN(Idcategory) !== undefined && isNaN(Idshop) !== true) {
            const [showcat] = await dbsync.execute("SELECT * FROM category WHERE Id_cat=? AND Id_shop_cat=?", [Idcategory, Idshop])
            if (showcat.length == 1) {
                const [showacc] = await dbsync.execute("SELECT * FROM shop_access WHERE Idshop_acc=? AND Name_usr_acc=?", [Idshop, Username])
                if (showacc.length == 1) {
                    if (showacc[0].Edit_acc == "1") {
                        const [deletecat] = await dbsync.execute("DELETE FROM category WHERE Name_cat=?", [showcat[0].Name_cat])
                        const [deletemenu] = await dbsync.execute("DELETE FROM addmenu WHERE Category_menu=?", [showcat[0].Name_cat])
                        res.send("success")
                    } else {
                        res.send("you don't have access to edit")
                    }
                } else if (showacc.length == 0) {
                    res.send("you don't have value user access")
                } else {
                    res.send("something wrong")
                }
            } else if (showcat.length == 0) {
                res.send("don't have value")
            } else {
                res.send("something wrong")
            }
        } else {
            res.send("your values int is null")
        }
    } else {
        res.send()
    }
}

const addsub = async (req, res) => {
    try {
        const Name = req.body.Name
        let Id_menu = req.body.Id_menu
        let Type = req.body.Type
        if (Name !== undefined && Id_menu !== undefined && Type !== undefined) {
            Id_menu = parseInt(Id_menu)
            Type = parseInt(Type)
            if (isNaN(Id_menu) !== true && isNaN(Type) !== true && typeof Name === "string") {
                const [srow] = await dbsync.execute("SELECT Id_menu FROM addmenu")
                const csrow = srow.some(srow => srow.Id_menu === Id_menu)
                if (csrow === true) {
                    const [sname] = await dbsync.execute("SELECT Name_sub FROM menu_subject WHERE Id_menu_sub=?", [Id_menu])
                    const cName = sname.some(pp => pp.Name_sub === Name)
                    if (cName === true) {
                        res.send("Name sub used")
                        console.log("Name sub used")
                    } else {
                        if (Type === 1 || Type === 2) {
                            const font = "_"
                            const [ssub] = await dbsync.execute("INSERT INTO menu_subject (Name_sub,Id_menu_sub,Type_sub) VALUES (?,?,?)", [Name, Id_menu, Type])
                            const [sid] = await dbsync.execute("SELECT Id_sub FROM menu_subject WHERE Id_menu_sub=? AND Name_sub=?", [Id_menu, Name])
                            const [iop] = await dbsync.execute("INSERT INTO menu_option (Name_option,Price_option,Id_sub_option,Type_option) VALUES (?,0,?,1)", [font, sid[0].Id_sub])
                            res.json(sid[0].Id_sub)
                        } else {
                            res.send("your type wrong")
                        }
                    }
                } else {
                    res.send("Idmenu is not match")
                    console.log("Idmenu is not match")
                }
            } else {
                res.send("your values int is null")
            }
        } else {
            res.send()
        }
    } catch (err) {
        if (err) throw err
    }
}

const addoption = async (req, res) => {
    try {
        const Name = req.body.Name
        let Price = req.body.Price
        let Id_sub = req.body.Id_sub
        let Type = req.body.Type
        if (Name !== undefined && Id_sub !== undefined && Type !== undefined && Price !== undefined) {
            Price = parseInt(Price)
            Id_sub = parseInt(Id_sub)
            Type = parseInt(Type)
            if (isNaN(Id_sub) !== true && isNaN(Id_sub) !== true && isNaN(Type) !== true && typeof Name === "string") {
                const [ssubid] = await dbsync.execute("SELECT Id_sub FROM menu_subject")
                const csubid = ssubid.some(pp => pp.Id_sub === Id_sub)
                if (csubid === true) {
                    const [sName] = await dbsync.execute("SELECT Name_option FROM menu_option WHERE Id_sub_option=?", [Id_sub])
                    const cname = sName.some(pp => pp.Name_option === Name)
                    if (cname === true) {
                        res.send("Name option used")
                    } else {
                        if (Type === 1 || Type === 2) {
                            const font = "_"
                            const [iop] = await dbsync.execute("INSERT INTO menu_option (Name_option,Price_option,Id_sub_option,Type_option)  VALUES (?,?,?,?)", [Name, Price, Id_sub, Type])
                            // const [delect] = await dbsync.execute("DELETE FROM menu_option WHERE Name_option=? AND Id_sub_option=?",[font,Id_sub])
                            const [sid] = await dbsync.execute("SELECT Id_option FROM menu_option WHERE Id_sub_option=? AND Name_option=? ", [Id_sub, Name])
                            res.json(sid[0].Id_option)
                        } else {
                            res.send("your type wrong")
                        }
                    }
                } else {
                    res.send("Id sub not match")
                }
            } else {
                res.send("your values int is null")
                // console.log(Price)
                // console.log(Id_sub)
                // console.log(Type)
            }
        } else {
            res.send()
        }
    } catch (err) {
        if (err) throw err
    }
}


const editmenu = async (req, res) => {
    try {
        const Username = req.body.Username
        let Idshop = req.body.Idshop
        let Iduser = req.body.Iduser
        let Idmenu = req.body.Idmenu
        const Pic = req.body.Pic
        let Price = req.body.Price
        let Time = req.body.Time
        if (Username !== undefined && Idshop !== undefined && Iduser !== undefined && Pic !== undefined && Price !== undefined && Time !== undefined) {
            Idshop = parseInt(Idshop)
            Iduser = parseInt(Iduser)
            Idmenu = parseInt(Idmenu)
            Price = parseInt(Price)
            Time = parseInt(Time)
            if (isNaN(Idshop) !== true && isNaN(Iduser) !== true && isNaN(Idmenu) !== true && isNaN(Price) !== true && isNaN(Time) !== true) {
                const [showaccess] = await dbsync.execute("SELECT * FROM shop_access WHERE Name_usr_acc=? AND Id_usr_acc=? AND Idshop_acc=?", [Username, Iduser, Idshop])
                if (showaccess.length == 1) {
                    if (showaccess[0].Edit_acc == 1) {
                        const [update] = await dbsync.execute("UPDATE addmenu SET Pic_menu=?,Price_menu=?,Time_menu=? WHERE Id_menu=? AND Id_shop_menu=?", [Pic, Price, Time, Idmenu, Idshop])
                        res.send("edit success")
                    } else if (showaccess[0].Edit_acc == 0) {
                        res.send("you don't have access to delete")
                    } else {
                        res.send("something wrong")
                    }
                } else {
                    res.send("you don't have values in data")
                }
            } else {
                res.send("your values int is null")
            }
        } else {
            res.send("")
        }
    } catch (err) {
        if (err) throw err
    }
}

const deletesub = async (req, res) => {
    try {
        const Username = req.body.Username
        const Idshop = req.body.Idshop
        const Iduser = req.body.Iduser
        let Idmenu = req.body.Idmenu
        let Idsubject = req.body.Idsubject
        if (Username !== undefined && Idshop !== undefined && Iduser !== undefined && Idmenu !== undefined && Idsubject !== undefined) {
            const [showaccess] = await dbsync.execute("SELECT * FROM shop_access WHERE Name_usr_acc=? AND Id_usr_acc=? AND Idshop_acc=?", [Username, Iduser, Idshop])
            // console.log(showaccess.length)
            if (showaccess.length == 1) {
                if (showaccess[0].Edit_acc == 1) {
                    Idsubject = parseInt(Idsubject)
                    Idmenu = parseInt(Idmenu)
                    if (isNaN(Idsubject) !== true && isNaN(Idmenu) !== true) {
                        const [removesub] = await dbsync.execute("DELETE FROM menu_subject WHERE Id_sub=? AND Id_menu_sub=?", [Idsubject, Idmenu])
                        const [removeoption] = await dbsync.execute("DELETE FROM menu_option WHERE Id_sub_option=?", [Idsubject])
                        res.send("delete success")
                    } else {
                        res.send("your values int is null")
                    }
                } else if (showaccess[0].Edit_acc == 0) {
                    res.send("you don't have access to delete")
                } else {
                    res.send("something wrong")
                }
            } else if (showaccess.length >= 2) {
                res.send("something wrong")
            } else if (showaccess.length <= 0) {
                res.send("you don't have values in data")
            } else {
                res.send("something wrong")
            }
        } else {
            res.send()
        }
    } catch (err) {
        if (err) throw err
    }
}

const deleteoption = async (req, res) => {
    try {
        const Username = req.body.Username
        const Idshop = req.body.Idshop
        const Iduser = req.body.Iduser
        let Idsubject = req.body.Idsubject
        let Idoption = req.body.Idoption
        if (Username !== undefined && Idshop !== undefined && Iduser !== undefined && Idsubject !== undefined && Idoption !== undefined) {
            const [showaccess] = await dbsync.execute("SELECT * FROM shop_access WHERE Name_usr_acc=? AND Id_usr_acc=? AND Idshop_acc=?", [Username, Iduser, Idshop])
            if (showaccess.length == 1) {
                if (showaccess[0].Edit_acc == 1) {
                    Idsubject = parseInt(Idsubject)
                    Idoption = parseInt(Idoption)
                    if (isNaN(Idsubject) !== true && isNaN(Idoption) !== true) {
                        const [checkvlaues] = await dbsync.execute("SELECT * FROM menu_option WHERE Id_sub_option=?", [Idsubject])
                        if (checkvlaues.length >= 2) {
                            const [removesub] = await dbsync.execute("DELETE FROM menu_option WHERE Id_sub_option=? AND Id_option=?", [Idsubject, Idoption])
                            res.send("delete success")
                        } else if (checkvlaues.length <= 1) {
                            res.send("")
                        }
                    } else {
                        res.send("your values int is null")
                    }
                } else if (showaccess[0].Edit_acc == 0) {
                    res.send("you don't have access to delete")
                } else {
                    res.send("something wrong")
                }
            } else if (showaccess.length >= 2) {
                res.send("something wrong")
            } else if (showaccess.length <= 0) {
                res.send("you don't have values in data")
            } else {
                res.send("something wrong")
            }
        } else {
            res.send()
        }
    } catch (err) {
        if (err) throw err
    }
}

const confirmmenu = async (req, res) => {
    // console.log("hello worlddd")
    let Id_shop = req.body.Id_shop
    let Id_menu = req.body.Id_menu
    if (Id_menu !== undefined && Id_shop !== undefined) {
        Id_shop = parseInt(Id_shop)
        Id_menu = parseInt(Id_menu)
        if (isNaN(Id_shop) !== true && isNaN(Id_menu) !== true) {
            const [cstatus] = await dbsync.execute("SELECT Id_menu FROM addmenu WHERE Id_menu=?",[Id_menu])
            // const cst = cstatus.some(pp => pp.Id_menu === Id_menu)
            if (cstatus.length === 1) {
                const [cst] = await dbsync.execute("SELECT Id_shop FROM profileshop WHERE Id_shop=?",[Id_shop])
                // const ccst = cst.some(pp => pp.Id_shop === Id_shop)
                const [showmenu] = await dbsync.execute("SELECT * FROM addmenu WHERE Id_menu=? AND Id_shop_menu=?", [Id_menu, Id_shop])
                if (showmenu.length >= 1) {
                    if (cst.length === 1) {
                        const [insert] = await dbsync.execute("UPDATE addmenu SET Status_menu=1 WHERE Id_menu=? AND Id_shop_menu=?", [Id_menu, Id_shop])
                        // const [is] = await dbsync.execute("UPDATE menu_subject SET Status_sub=1 WHERE Id_menu_sub=?",[Id_menu])
                        const [getsub] = await dbsync.execute("SELECT * FROM menu_subject WHERE Id_menu_sub=?", [Id_menu])
                        if (getsub.length > 0){
                            for (let i = 0; i < getsub.length; i++) {
                                const [updatestatussub] = await dbsync.execute("UPDATE menu_subject SET Status_sub=1 WHERE Id_sub=?", [getsub[i].Id_sub])
                                const [showop] = await dbsync.execute("SELECT * FROM menu_option WHERE Id_sub_option=?", [getsub[i].Id_sub])
                                if (showop.length > 0){
                                    for (let o = 0; o < showop.length; o++) {
                                        const [updatestatusoption] = await dbsync.execute("UPDATE menu_option SET Status_option=1 WHERE Id_sub_option=?", [getsub[i].Id_sub])
                                        if (showop.length <= 1) {
                                            const [deletesub] = await dbsync.execute("DELETE FROM menu_subject WHERE Id_sub=?", [getsub[i].Id_sub])
                                            const [deleteoption] = await dbsync.execute("DELETE FROM menu_option WHERE Id_sub_option=?", [getsub[i].Id_sub])
                                        }
                                        if (i == getsub.length - 1 && o == showop.length - 1) {
                                            res.send("success")
                                        }
                                    }
                                }else{
                                    if (i == getsub.length - 1) {
                                        res.send("success")
                                    }
                                }
                            }
                        }else{
                            res.send("success")
                        }
                    } else {
                        res.send("your idshop wrong")
                    }
                } else {
                    res.send("you don't link Idmenu and Idshop")
                }
            } else {
                res.send("your idmenu wrong")
            }
        } else {
            res.send("your values int is null")
        }
    } else {
        res.send()
    }
}


const getmenu = async (req, res) => {
    try {
        var valuesmenu = []
        var valuessub = []
        var valuesoption = []
        var keepsubandoption = []
        var allmenu = []
        // let x = 0
        // console.log()
        // const Idmenu = req.body.Idmenu
        let Idmenu = req.body.Idmenu
        if (Idmenu !== undefined) {
            const [sidmenu] = await dbsync.execute("SELECT * FROM addmenu WHERE Id_menu=?", [Idmenu])
            Idmenu = parseInt(Idmenu)
            if (isNaN(Idmenu) !== true) {
                if (sidmenu.length === 1) {
                    // const [smenu] = await dbsync.execute("SELECT * FROM addmenu WHERE Id_menu=?",[Idmenu])
                    const [ssub] = await dbsync.execute("SELECT * FROM menu_subject WHERE Id_menu_sub=?", [sidmenu[0].Id_menu])
                    if (ssub.length === 0) {
                        allmenu.push({ id: sidmenu[0].Id_menu, pic: sidmenu[0].Pic_menu, name: sidmenu[0].Name_menu, price: sidmenu[0].Price_menu, time: sidmenu[0].Time_menu })
                        res.send(allmenu)
                    }
                    for (let i = 0; i < ssub.length; i++) {
                        valuessub.push({ id: ssub[i].Id_sub, name: ssub[i].Name_sub, type: ssub[i].Type_sub })
                        const [soption] = await dbsync.execute("SELECT * FROM menu_option WHERE Id_sub_option=?", [ssub[i].Id_sub])
                        if (soption.length === 0) {
                            //  keepsubandoption.push({id:valuessub[0].id,name:valuessub[0].name,type:valuessub[0].type,option:null})
                            //  valuessub = []
                            //  res.send("hi")
                            res.send("no option")
                        }
                        for (let o = 0; o < soption.length; o++) {
                            valuesoption.push({ id: soption[o].Id_option, name: soption[o].Name_option, price: soption[o].Price_option, id_sub_option: soption[o].Id_sub_option })
                            if (o === soption.length - 1) {
                                keepsubandoption.push({ id: valuessub[0].id, name: valuessub[0].name, type: valuessub[0].type, option: valuesoption })
                                valuessub = []
                                valuesoption = []
                            }
                            if (o === soption.length - 1 && i === ssub.length - 1) {
                                allmenu.push({ id: sidmenu[0].Id_menu, pic: sidmenu[0].Pic_menu, name: sidmenu[0].Name_menu, price: sidmenu[0].Price_menu, time: sidmenu[0].Time_menu, subject: keepsubandoption })
                                res.json(allmenu)
                                valuessub = []
                                valuesoption = []
                                keepsubandoption = []
                            }
                        }
                    }
                } else {
                    res.send("your Id fail")
                }
            } else {
                res.send("your values int is null")
            }
        } else {
            res.send("your body Idmenu wrong")
        }
        // const rowsts = JSON.stringify(rows)
        // const [rows] = await dbsync.execute("SELECT profileshop.Id_shop_au,year.Year FROM profileshop,year WHERE year.Id=18")
    } catch (err) {
        if (err) throw err
    }
}

const getmenushop = async (req, res) => {
    try {
        let Idshop = req.body.Idshop
        if (Idshop !== undefined) {
            Idshop = parseInt(Idshop)
            if (isNaN(Idshop) !== true) {
                const [findmenu] = await dbsync.execute("SELECT Id_menu,Pic_menu,Name_menu,Price_menu,Time_menu,Status_menu FROM addmenu WHERE Status_menu!=0 AND  Id_shop_menu=?", [Idshop])
                if (findmenu.length >= 1) {
                    res.send(findmenu)
                } else {
                    res.send("you don't have menu in your shop")
                }
            } else {
                res.send("your values int is null")
            }
        } else {
            res.send()
        }
    } catch (err) {
        if (err) throw err
    }
}

const searchmenupro = async (req, res) => {
    const Name_shop = req.body.Name_shop
    let Id_shop = req.body.Id_shop
    if (Name_shop !== undefined && Id_shop !== undefined) {
        Id_shop = parseInt(Id_shop)
        if (isNaN(Id_shop) !== true) {
            const [checkvalueshop] = await dbsync.execute("SELECT Id_shop FROM profileshop WHERE Name_shop=? AND Id_shop=?", [Name_shop, Id_shop])
            if (checkvalueshop.length == 1) {
                const [findvaluemenu] = await dbsync.execute("SELECT Id_menu,Name_menu,Pic_menu,Price_menu FROM addmenu WHERE Status_menu=1 AND Id_shop_menu=? AND Name_shop_menu=?", [Id_shop, Name_shop])
                if (findvaluemenu.length >= 1 ){
                    res.json(findvaluemenu)
                }else if (findvaluemenu,length == 0){
                    res.send("your shop don't have value menu")
                }else{
                    res.send("something wrong")
                }
            } else if (checkvalueshop == 0) {
                res.send("you don't have shop")
            } else if (checkvalueshop < 0 || checkvalueshop > 1) {
                res.send("something wrong")
            } else {
                res.send("something wrong")
            }
        } else {
            res.send("your value int is null")
        }

    } else {
        res.send()
    }
}


module.exports = { addmenu, addcategory, deletecategory, getmenu, editmenu, addsub, addoption, deletesub, deleteoption, confirmmenu, getmenushop,searchmenupro }