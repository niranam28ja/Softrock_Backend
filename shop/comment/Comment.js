const { parse } = require("dotenv")
const { rmSync } = require("fs")
const dbsync = require("D:/react_project/ppap/config/datasync")
const { start } = require("repl")
const { devNull } = require("os")


const commentshop = async (req, res) => {
    try {
        let Iduser = req.body.Iduser
        let Idshop = req.body.Idshop
        let Idorder = req.body.Idorder
        let Star_cookingSpeed = req.body.Star_cookingSpeed
        let Star_Taste = req.body.Star_Taste
        const Comment = req.body.Comment
        if (Iduser !== undefined && Idshop !== undefined && Idorder !== undefined && Star_cookingSpeed !== undefined && Star_Taste !== undefined && Comment !== undefined) {
            const [checkuser] = await dbsync.execute("SELECT * FROM users WHERE Id_usr=? ", [Iduser])
            if (checkuser.length == 1) {
                const [checkshop] = await dbsync.execute("SELECT Name_shop FROM profileshop WHERE Id_shop=?", [Idshop])
                if (checkshop.length == 1) {
                    Star_cookingSpeed = Number(parseFloat(Star_cookingSpeed).toFixed(1))
                    Star_Taste = Number(parseFloat(Star_Taste).toFixed(1))
                    Idshop = parseInt(Idshop)
                    Iduser = parseInt(Iduser)
                    if (isNaN(Star_cookingSpeed) !== true && isNaN(Star_Taste) !== true && isNaN(Idshop) !== true && isNaN(Iduser) !== true) {
                        if (Star_cookingSpeed <= 5 && Star_cookingSpeed >= 0 && Star_Taste <= 5 && Star_Taste >= 0) {
                           const [Star_log] = await dbsync.execute("SELECT * FROM star_log WHERE Id_order_starlog=? AND Status_starlog=0",[Idorder])
                        //    console.log("pp")
                           if (Star_log.length === 1){
                            // console.log(Star_log[0].Amount_starlog)
                            // console.log(checkuser[0].Star_usr)
                            let Star = Star_log[0].Amount_starlog + checkuser[0].Star_usr
                            // console.log(Star)
                            const [findLogComment] = await dbsync.execute("SELECT * FROM comment_log WHERE Id_shop_log=? AND Name_shop_log=?", [Idshop, checkshop[0].Name_shop])
                            if (findLogComment.length == 1) {
                                await dbsync.execute("UPDATE users SET Star_usr=? WHERE Id_usr=? AND Gen_usr=?",[Star,Iduser,checkuser[0].Gen_usr])
                                await dbsync.execute("UPDATE star_log SET Status_starlog=1 WHERE Id_order_starlog=?",[Idorder])
                                await dbsync.execute(`UPDATE comment_log SET Star_fastmake_shop_log=?,Star_taste_shop_log=?,Total_Usr_log=?,Status_log=1 WHERE Id_shop_log=? AND Name_shop_log=?`, [findLogComment[0].Star_fastmake_shop_log + Star_cookingSpeed, findLogComment[0].Star_taste_shop_log + Star_Taste, findLogComment[0].Total_Usr_log + 1,Idshop, checkshop[0].Name_shop])
                                await dbsync.execute("INSERT INTO comment_shop (Id_usr_comment_shop,UserName_usr_comment_shop,Star_fastmake_comment_shop,Star_taste_comment_shop,Comment_comment_shop,Id_shop_comment_shop,Nameshop_comment_shop) VALUES (?,?,?,?,?,?,?)", [Iduser, checkuser[0].UserName_usr, Star_cookingSpeed, Star_Taste, Comment,Idshop, checkshop[0].Name_shop])
                                res.send("success")
                            } else if (findLogComment.length == 0) {
                                await dbsync.execute("UPDATE users SET Star_usr=? WHERE Id_usr=? AND Gen_usr=?",[Star,Iduser,checkuser[0].Gen_usr])
                                await dbsync.execute("UPDATE star_log SET Status_starlog=1 WHERE Id_order_starlog=?",[Idorder])
                                await dbsync.execute("INSERT INTO comment_log (Id_shop_log,Name_shop_log,Star_fastmake_shop_log,Star_taste_shop_log,Total_Usr_log,Status_log) VALUES (?,?,?,?,?,1)", [checkshop[0].Id_shop, checkshop[0].Name_shop, Star_cookingSpeed, Star_Taste, 1])
                                await dbsync.execute("INSERT INTO comment_shop (Id_usr_comment_shop,UserName_usr_comment_shop,Star_fastmake_comment_shop,Star_taste_comment_shop,Comment_comment_shop,Id_shop_comment_shop,Nameshop_comment_shop) VALUES (?,?,?,?,?,?,?)", [Iduser, checkuser[0].UserName_usr, Star_cookingSpeed, Star_Taste, Comment,Idshop, checkshop[0].Name_shop])
                                res.send("success")
                            } else {
                                res.send('something wrong')
                            }
                           }else{
                            // console.log("eee")
                            res.send("this order has been commented")
                           }
                        } else {
                            res.send("something wrong")
                        }
                    } else {
                        res.send("your value int is null")
                    }
                } else if (checkshop.length == 0) {
                    res.send("you don't this shop in data")
                } else {
                    res.send("something wrong")
                }
            } else if (checkuser.length == 0) {
                res.send("you don't have this Username in data")
            } else {
                res.send("something wrong")
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

const showStatusorder = async(req,res) =>{
    try{
        let Id_order = req.body.Id_order
        if (Id_order !== undefined){
            Id_order = parseInt(Id_order)
            if (isNaN(Id_order) !== true){
                const [sendStatusOrder] = await dbsync.execute("SELECT Status_paysuccess FROM paysuccess WHERE Id_order_paysuccess=?",[Id_order])
                res.json(sendStatusOrder)
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

module.exports = { commentshop,showStatusorder } 