const dbsync = require("D:/react_project/ppap/config/datasync")


const closeshop = async (req, res) => {
    try {
        let Idshop = req.body.Idshop
        let Iduser = req.body.Iduser
        if (Idshop !== undefined && Iduser !== undefined){
            Idshop = parseInt(Idshop)
            Iduser = parseInt(Iduser)
            if (isNaN(Idshop) !== true && isNaN(Iduser) !== true){
                const [finduser] = await dbsync.execute("SELECT UserName_usr FROM users WHERE Id_usr=?",[Iduser])
                if (finduser.length === 1){
                    const [findshop] = await dbsync.execute("SELECT Name_shop FROM profileshop WHERE Id_shop=? AND UserName_shop=?",[Idshop,finduser[0].UserName_usr])
                    if (findshop.length === 1){
                        dbsync.execute("UPDATE profileshop SET Status_shop=2 WHERE Id_shop=?",[Idshop])
                        dbsync.execute("UPDATE addmenu SET Status_menu=2 WHERE Id_shop_menu=?",[Idshop])
                        res.send("close shop success")
                    }else if (findshop.length === 0){
                        res.send("this idshop don't have in data or this user in not a owner")
                    }else{
                        res.send("something wrong")
                    }
                }else if (finduser.length === 0){
                    res.send("your iduser don't have in data")
                }else{
                    res.send("something wrong")
                }
            }else{
                res.send("your value int is null")
            }
        }else{
            res.send()
        }
    } catch (err) {
        if (err) {
            console.log(err)
            res.send("have some error")
        }
    }
}


const openshop = async (req, res) => {
    try {
        let Idshop = req.body.Idshop
        let Iduser = req.body.Iduser
        if (Idshop !== undefined && Iduser !== undefined){
            Idshop = parseInt(Idshop)
            Iduser = parseInt(Iduser)
            if (isNaN(Idshop) !== true && isNaN(Iduser) !== true){
                const [finduser] = await dbsync.execute("SELECT UserName_usr FROM users WHERE Id_usr=?",[Iduser])
                if (finduser.length === 1){
                    const [findshop] = await dbsync.execute("SELECT Name_shop FROM profileshop WHERE Id_shop=? AND UserName_shop=?",[Idshop,finduser[0].UserName_usr])
                    if (findshop.length === 1){
                        dbsync.execute("UPDATE profileshop SET Status_shop=1 WHERE Id_shop=?",[Idshop])
                        dbsync.execute("UPDATE addmenu SET Status_menu=1 WHERE Id_shop_menu=?",[Idshop])
                        res.send("open shop success")
                    }else if (findshop.length === 0){
                        res.send("this idshop don't have in data")
                    }else{
                        res.send("something wrong")
                    }
                }else if (finduser.length === 0){
                    res.send("your iduser don't have in data or this user in not a owner")
                }else{
                    res.send("something wrong")
                }
            }else{
                res.send("your value int is null")
            }
        }else{
            res.send()
        }
    } catch (err) {
        if (err) {
            console.log(err)
            res.send("have some error")
        }
    }
}

module.exports = { closeshop,openshop }