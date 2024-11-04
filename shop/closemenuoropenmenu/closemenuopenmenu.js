const dbsync = require("D:/react_project/ppap/config/datasync")



const closemenu = async(req,res) =>{
    try{
        let Id_user = req.body.Id_user 
        const Token = req.body.Token
        let Id_shop = req.body.Id_shop
        let Id_menu = req.body.Id_menu 
        if (Id_user !== undefined && Token !== undefined && Id_shop !== undefined && Id_menu !== undefined){
            Id_user = parseInt(Id_user)
            Id_shop = parseInt(Id_shop)
            Id_menu = parseInt(Id_menu)
            if (isNaN(Id_user) !== true && isNaN(Id_shop) !== true && isNaN(Id_menu) !== true){
                const [user] = await dbsync.execute("SELECT * FROM users WHERE Id_usr=? AND Gen_usr=?",[Id_user,Token])
                if (user.length === 1){
                    const [shop] = await dbsync.execute("SELECT * FROM profileshop WHERE UserName_shop=? AND Id_shop=?",[user[0].UserName_usr,Id_shop])
                    if (shop.length === 1){
                        const [menu] = await dbsync.execute("SELECT * FROM addmenu WHERE Id_menu=? AND Id_shop_menu=?",[Id_menu,Id_shop])
                        if (menu.length === 1){
                            await dbsync.execute("UPDATE addmenu SET Status_menu=? WHERE Id_menu=? AND Id_shop_menu=?",[2,Id_menu,Id_shop])
                            res.send("close menu success")
                        }else{
                            res.send("this menu don't have in this shop")
                        }
                    }else{
                        res.send("this shop don't have in data")
                    }
                }else{
                    res.send("this user don't have in data")
                }
            }else{
                res.send("your value int is null")
            }
        }else{
            res.send()
        }
    }catch(err){
        if (err){
            console.log(err)
            res.send("have some error")
        }
    }
}

const openmenu  = async(req,res) =>{
    try{
        let Id_user = req.body.Id_user 
        const Token = req.body.Token
        let Id_shop = req.body.Id_shop
        let Id_menu = req.body.Id_menu 
        if (Id_user !== undefined && Token !== undefined && Id_shop !== undefined && Id_menu !== undefined){
            Id_user = parseInt(Id_user)
            Id_shop = parseInt(Id_shop)
            Id_menu = parseInt(Id_menu)
            if (isNaN(Id_user) !== true && isNaN(Id_shop) !== true && isNaN(Id_menu) !== true){
                const [user] = await dbsync.execute("SELECT * FROM users WHERE Id_usr=? AND Gen_usr=?",[Id_user,Token])
                if (user.length === 1){
                    const [shop] = await dbsync.execute("SELECT * FROM profileshop WHERE UserName_shop=? AND Id_shop=?",[user[0].UserName_usr,Id_shop])
                    if (shop.length === 1){
                        const [menu] = await dbsync.execute("SELECT * FROM addmenu WHERE Id_menu=? AND Id_shop_menu=?",[Id_menu,Id_shop])
                        if (menu.length === 1){
                            await dbsync.execute("UPDATE addmenu SET Status_menu=? WHERE Id_menu=? AND Id_shop_menu=?",[1,Id_menu,Id_shop])
                            res.send("open menu success")
                        }else{
                            res.send("this menu don't have in this shop")
                        }
                    }else{
                        res.send("this shop don't have in data")
                    }
                }else{
                    res.send("this user don't have in data")
                }
            }else{
                res.send("your value int is null")
            }
        }else{
            res.send()
        }
    }catch(err){
        if (err){
            console.log(err)
            res.send("have some error")
        }
    }
}

module.exports = {closemenu,openmenu}