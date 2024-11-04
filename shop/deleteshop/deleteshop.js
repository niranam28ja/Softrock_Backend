const dbsync = require("D:/react_project/ppap/config/datasync")



const deleteshop = async (req, res) => {
    try {
        let Idshop = req.body.Idshop
        if (Idshop !== undefined) {
            Idshop = parseInt(Idshop)
            if (isNaN(Idshop) !== true) {
                //     const [findsubjecy] = await dbsync.execute("SELECT * FROM menu_subject WHERE Id_shop_")
                // for(let i =0;findsubject.length > i;i++ ){
                //     const [findsub] = await dbsync.execute("SELECT * FROM menu_")
                // }
                // const [findshop] = await dbsync.execute("SELECT Name_shop FROM addmenu WHERE Id_shop=?",[Idshop])
                const [findmenu] = await dbsync.execute("SELECT Id_menu FROM addmenu WHERE Id_shop_menu=?", [Idshop])
                // console.log(findmenu.length)
                for (let i = 0; findmenu.length > i; i++) {
                    const [findsubject] = await dbsync.execute("SELECT * FROM menu_subject WHERE Id_menu_sub=?", [findmenu[i].Id_menu])
                    if (findsubject.length === 0){
                        if (findmenu.length - 1 === i) {
                            dbsync.execute("DELETE FROM profileshop WHERE Id_shop=?",[Idshop])
                            dbsync.execute("DELETE FROM addmenu WHERE Id_shop_menu=?",[Idshop])
                            res.send("success")
                        }
                    }else if (findsubject.length >= 1){
                        for (let o = 0; findsubject.length > o; o++) {
                            dbsync.execute("DELETE FROM menu_option WHERE Id_sub_option=?", [findsubject[o].Id_sub])
                            if (findsubject.length - 1 === o) {  
                              dbsync.execute("DELETE FROM menu_subject WHERE Id_menu_sub=?", [findmenu[i].Id_menu])
                            }
                            if (findsubject.length - 1 === o && findmenu.length - 1 === i) {
                                dbsync.execute("DELETE FROM profileshop WHERE Id_shop=?",[Idshop])
                                dbsync.execute("DELETE FROM addmenu WHERE  Id_shop_menu=?",[Idshop])
                                res.send("success")
                            }
                        }
                    }
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

module.exports = { deleteshop }