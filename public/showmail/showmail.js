const dbsync = require("D:/react_project/ppap/config/datasync")


const showmail = async (req, res) => {
    try {
        let Iduser = req.body.Iduser
        const Token = req.body.Token
        if (Iduser !== undefined && Token !== undefined) {
            Iduser = parseInt(Iduser)
            if (isNaN(Iduser) !== true) {
                const [finduser] = await dbsync.execute("SELECT * FROM users WHERE Id_usr=? AND Gen_usr=?", [Iduser, Token])
                if (finduser.length === 1) {
                    const [findmailuser] = await dbsync.execute("SELECT Subject_noti,Detail_noti,Send_from_noti,Id_order_noti,Status_noti FROM mail_notification WHERE Id_Recive_noti=? ORDER BY Create_noti DESC", [Iduser])
                    if (findmailuser.length > 0) {
                        res.json(findmailuser)
                    } else if (findmailuser.length === 0) {
                        res.send("your mail don't have yet")
                    } else {
                        res.send()
                    }
                } else if (finduser.length === 0) {
                    res.send("this user don't have in data")
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


module.exports = { showmail }