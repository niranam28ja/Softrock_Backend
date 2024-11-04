const dbsync = require("D:/react_project/ppap/config/datasync")

const givestar = async (req, res) => {
    try {
        let Star_taste = req.body.Star_taste
        let Star_fast = req.body.Star_fast
        let Iduser = req.body.Iduser
        const Token = req.body.Token
        let Idshop = req.body.Idshop
        if (Star_taste !== undefined && Star_fast !== undefined && Iduser !== undefined && Token !== undefined && Idshop !== undefined) {
            Star_taste = parseInt(Star_taste)
            Star_fast = parseInt(Star_fast)
            Iduser = parseInt(Iduser)
            Idshop = parseInt(Idshop)
            if (isNaN(Star_taste) !== true && isNaN(Star_fast) !== true && isNaN(Iduser) !== true && isNaN(Idshop) !== true) {
                if (Star_taste <= 5 && Star_taste >= 0 && Star_fast <= 5 && Star_fast >= 0) {
                    const [findshop] = await dbsync.execute("SELECT Id_shop,Name_shop FROM profileshop WHERE Id_shop=?", [Idshop])
                    if (findshop.length === 1) {
                        const [finduser] = await dbsync.execute("SELECT Id_usr,UserName_usr FROM users WHERE Id_usr=? AND Gen_usr=?", [Iduser, Token])
                        if (finduser.length === 1) {
                            const [findorder] = await dbsync.execute("SELECT * FROM paysuccess WHERE Id_shop_paysucess=? AND Id_usr_paysuccess=? AND Status_paysuccess=3", [Idshop, Iduser])
                            if (findorder.length > 0) {
                                const [pushstar] = await dbsync.execute("INSERT INTO star_shop (Star_taste_Star,Star_fast_Star,Id_usr_Star,Name_usr_Star,Id_shop_Star,Name_shop_Star) VALUES (?,?,?,?,?,?)", [Star_taste,Star_fast, finduser[0].Id_usr, finduser[0].UserName_usr, findshop[0].Id_shop, findshop[0].Name_shop])
                                res.send("give star success")
                            } else if (findorder.length === 0) {
                                res.send("this user didn't have pay this shop yet")
                            } else {
                                res.send("something wrong")
                            }
                        } else if (finduser.length === 0) {
                            res.send("this user don't have in data")
                        } else {
                            res.send("something wrong")
                        }
                    } else {
                        res.send("this shop don't have in data")
                    }
                } else {
                    res.send("your star must have less than 5 but more than 0")
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


module.exports = { givestar }