const dbsync = require("D:/react_project/ppap/config/datasync")
const bcrypt = require('bcrypt')


// const salt = bcrypt.genSaltSync(9)
// const hash = bcrypt.hashSync(Pass, salt)
const showuseredit = async (req, res) => {
    try {
        let Iduser = req.body.Iduser
        const Token = req.body.Token
        if (Iduser !== undefined && Token !== undefined) {
            Iduser = parseInt(Iduser)
            if (isNaN(Iduser) !== true) {
                const [finduser] = await dbsync.execute("SELECT Id_usr,Tel_usr,UserName_usr,Password_usr,Pic_usr FROM users WHERE Id_usr=? AND Gen_usr=?", [Iduser, Token])
                if (finduser.length === 1) {
                    res.json(finduser)
                } else if (finduser.length === 0) {
                    res.send("your Id don't have in data")
                } else {
                    res.send("something wrong")
                }
            } else[
                res.send("your value int is null")
            ]
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


const edituser = async (req, res) => {
    try {
        let Iduser = req.body.Iduser
        const Token = req.body.Token
        const Password = req.body.Password
        const Username = req.body.Username
        let Tel = req.body.Tel
        const Pic = req.body.Pic
        if (Iduser !== undefined && Password !== undefined && Username !== undefined && Tel !== undefined && Token !== undefined && Pic !== undefined) {
            Iduser = parseInt(Iduser)
            Tel = parseInt(Tel)
            if (isNaN(Iduser) !== true && isNaN(Tel) !== true) {
                const [checkuser] = await dbsync.execute("SELECT * FROM users WHERE Id_usr=? AND Gen_usr=?", [Iduser, Token])
                if (checkuser.length === 1) {
                    Tel = `${0}${Tel}`
                    const salt = bcrypt.genSaltSync(9)
                    const hash = bcrypt.hashSync(Password, salt)
                    const [updateuser] = await dbsync.execute("UPDATE users SET Tel_usr=?,UserName_usr=?,Password_usr=?,Pic_usr=? WHERE Id_usr=? AND Gen_usr=?", [Tel, Username, hash, Pic, Iduser, Token])
                    res.send("edit profile success")
                } else if (checkuser.length === 0) {
                    res.send("your Id don't have in data")
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


module.exports = { showuseredit, edituser }