const { response } = require("express")
const { check } = require("express-validator")
const dbsync = require("D:/react_project/ppap/config/datasync")

const addemployee = async (req, res) => {
    try {
        let Idshop = req.body.Idshop
        const Usernameshop = req.body.Usernameshop
        const Employeeusername = req.body.Employeeusername
        const Addmenu = req.body.Addmenu
        const Edit = req.body.Edit
        const Makefood = req.body.Makefood
        const Addemployee = req.body.Addemployee
        const Addpromotion = req.body.Addpromotion
        if (Idshop !== undefined && Usernameshop !== undefined && Employeeusername !== undefined && Addmenu !== undefined && Edit !== undefined && Makefood !== undefined && Addemployee !== undefined && Addpromotion !== undefined) {
            Idshop = parseInt(Idshop)
            if (isNaN(Idshop) !== true) {
                if (Addmenu == "0" || Addmenu == "1") {
                    if (Edit == "0" || Edit == "1") {
                        if (Makefood == "0" || Makefood == "1") {
                            if (Addemployee == "0" || Addemployee == "1") {
                                if (Addpromotion == "0" || Addpromotion == "1") {
                                    const [checkuser] = await dbsync.execute("SELECT Addemployee_acc FROM shop_access WHERE Idshop_acc=? AND Name_usr_acc=?", [Idshop, Usernameshop])
                                    if (checkuser.length == 1) {
                                        if (checkuser[0].Addemployee_acc == "1") {
                                            const [checkuserusr] = await dbsync.execute("SELECT Id_usr FROM users WHERE UserName_usr=?", [Employeeusername])
                                            if (checkuserusr.length == 1) {
                                                const [checkemployee] = await dbsync.execute("SELECT Id_acc FROM shop_access WHERE Idshop_acc=? AND Name_usr_acc=?", [Idshop, Employeeusername])
                                                if (checkemployee.length == 0) {
                                                    const [addemployee] = await dbsync.execute("INSERT INTO shop_access(Addmenu_acc,Edit_acc,Makefood_acc,Addemployee_acc,Addpro_acc,Idshop_acc,Name_usr_acc,Id_usr_acc) VALUES(?,?,?,?,?,?,?,?)", [Addmenu, Edit, Makefood, Addemployee, Addpromotion, Idshop, Employeeusername, checkuserusr[0].Id_usr])
                                                    res.send("seccess")
                                                } else if (checkemployee.length == 1) {
                                                    res.send("you have been add this employee in data")
                                                }else{
                                                    res.send("something wrong")
                                                }
                                            } else if (checkuserusr.length == 0) {
                                                console.log(Employeeusername)
                                                res.send("you don't have user in data")
                                            } else {
                                                res.send("something wrong")
                                            }
                                        } else {
                                            res.send("you don't have access to addemployee")
                                        }
                                    } else if (checkuser.length == 1 && checkuser[0].Status_usr == 4) {
                                        const [checkuserusr] = await dbsync.execute("SELECT Id_usr FROM users WHERE UserName_usr=?", [Employeeusername])
                                        if (checkuserusr.length == 1) {
                                            const [checkemployee] = await dbsync.execute("SELECT Id_acc FROM shop_access WHERE Idshop_acc=? AND Name_usr_acc=?", [Idshop, Employeeusername])
                                            if (checkemployee.length == 0) {
                                                const [addemployee] = await dbsync.execute("INSERT INTO shop_access(Addmenu_acc,Edit_acc,Makefood_acc,Addemployee_acc,Addpro_acc,Idshop_acc,Name_usr_acc,Id_usr_acc) VALUES(?,?,?,?,?,?,?,?)", [Addmenu, Edit, Makefood, Addemployee, Addpromotion, Idshop, Employeeusername, checkuserusr[0].Id_usr])
                                                res.send("seccess")
                                            } else if (checkemployee.length == 1) {
                                                res.send("you have been add this employee in data")
                                            }else{
                                                res.send("something wrong")
                                            }
                                        } else if (checkuserusr.length == 0) {
                                            console.log(Employeeusername)
                                            res.send("you don't have user in data")
                                        } else {
                                            res.send("something wrong")
                                        }
                                    } else if (checkuser.length == 0){
                                        res.send("you don't have access in data")
                                    }else{
                                        res.send("something wrong")
                                    }
                                } else {
                                    res.send("Addpromotion is not 0 or 1")
                                }
                            } else {
                                res.send("Addemployee is not 0 or 1")
                            }
                        } else {
                            res.send("Makefood is not 0 or 1")
                        }
                    } else {
                        res.send("Edit is not 0 or 1")
                    }
                } else {
                    res.send("Addmenu is not 0 or 1")
                }
            } else {
                res.send("your values int is null")
            }
        } else {
            console.log('hi world')
            res.send()
        }
    } catch (err) {
        if (err) {
            res.send("have some error")
            console.log(err)
        }
    }
}
// must to edit allemployee later

module.exports = { addemployee }