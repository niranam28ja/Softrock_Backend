const e = require("express")
const { parse } = require("uuid")
const dbsync = require("D:/react_project/ppap/config/datasync")

const checkaccess = async (req, res) => {
    try {
        let Idshop = req.body.Idshop
        const Usernameshop = req.body.Usernameshop
        if (Idshop !== undefined && Usernameshop !== undefined) {
            Idshop = parseInt(Idshop)
            if (isNaN(Idshop) !== true) {
                const [showaccessuserdata] = await dbsync.execute("SELECT * FROM shop_access WHERE Idshop_acc=? AND Name_usr_acc=?", [Idshop, Usernameshop])
                if (showaccessuserdata.length == 1) {
                    // console.log("sss")
                    res.json(showaccessuserdata)
                } else if (showaccessuserdata.length == 0) {
                    // console.log("www")
                    res.send("you don't have access in data")
                } else {
                    // console.log("sseudb")
                    // console.log(showaccessuserdata.length)
                    res.send("something wrong")
                }
            } else {
                res.send("your values int is null")
            }
        } else {
            // console.log(Idshop)
            // console.log(Usernameshop)
            // console.log('wtf in this world')
            res.send()
        }
    } catch (err) {
        if (err) {
            console.log(err)
            res.send("have some error")
        }
    }
}

module.exports = { checkaccess }