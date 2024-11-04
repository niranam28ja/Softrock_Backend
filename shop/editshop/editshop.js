const { user } = require("../../config/config")
const { openshop, closeshop } = require("../closeshoporopenshop/closeshoporopenshop")
const dbsync = require("D:/react_project/ppap/config/datasync")

const editshop = async(req,res) =>{
    try{
        let Id_usr = req.body.Id_usr
        const Token = req.body.Token
        const RealName = req.body.Realname
        const SurName = req.body.Surname
        const PicPayment = req.body.Pic
        let Id_Payment = req.body.Id_Payment
        const Profile = req.body.Profile
        const Background = req.body.Background 
        let Tel = req.body.Tel
        let OpenShop = req.body.Open_shop
        let CloseShop = req.body.Close_shop
        const Lat = req.body.Lat
        const Long = req.body.Long
        if (Id_usr && Token !== undefined && RealName !== undefined &&  SurName !== undefined && Id_Payment !== undefined && PicPayment !== undefined && Profile !== undefined && Background !== undefined && Tel !== undefined && OpenShop !== undefined && CloseShop !== undefined && Lat !== undefined && Long !== undefined){
            Id_usr = parseInt(Id_usr)
            Tel = parseInt(Tel)
            if (isNaN(Id_usr) !== true && isNaN(Tel) !== true){
                // OpenShop = new Date(OpenShop)
                // CloseShop = new Date(CloseShop)
                    const [User] = await dbsync.execute("SELECT * FROM users WHERE Id_usr=? AND Gen_usr=?",[Id_usr,Token])
                        if (User.length === 1){
                           const [Shop] = await dbsync.execute("SELECT Id_shop FROM profileshop WHERE UserName_shop=?",[User[0].UserName_usr])
                           if (Shop.length === 1){
                                Tel = `${0}${Tel}`
                                await dbsync.execute("INSERT INTO log_editprofile_shop (Id_shop_editprofile_shop,UserName_editprofile_shop) VALUES (?,?)",[Shop[0].Id_shop,Id_usr])
                                await dbsync.execute("UPDATE profileshop SET Name_usr_shop=?,Sur_usr_shop=?,Payment_payment_shop=?,Pic_payment_shop=?,Latitude_shop=?,Longitude_shop=?,Profle_shop=?,Bg_shop=?,Tel_shop=?,Open_shop=?,Close_shop=? WHERE UserName_shop=?",[RealName,SurName,Id_Payment,PicPayment,Lat,Long,Profile,Background,Tel,OpenShop,CloseShop,User[0].UserName_usr])
                                res.send("edit profileshop successfully")
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

const showdetailshop = async(req,res) =>{
    try{
        // let Id_admin  = req.body.Id_admin
        let Id_usr = req.body.Id_usr
        const Token = req.body.Token
        let Id_shop = req.body.Id_shop
        if (Id_usr !== undefined && Token !== undefined && Id_shop !== undefined){
            Id_usr = parseInt(Id_usr)
            Id_shop  = parseInt(Id_shop)
            if (isNaN(Id_usr) !== true && isNaN(Id_shop) !== true){
                const [User] = await dbsync.execute("SELECT * FROM users WHERE Id_usr=? AND Gen_usr=?",[Id_usr,Token])
                // console.log(Id_usr)
                // console.log(Token)
                if (User.length === 1){
                    const [Shop] = await dbsync.execute("SELECT * FROM profileshop WHERE Id_shop=? AND UserName_shop=?",[Id_shop,User[0].UserName_usr])
                    if (Shop.length === 1){
                        res.json(Shop)
                    }else{
                        res.send("this shop don't have in data")
                    }
                }else if (User.length === 0){
                    res.send("this user don't have in data")
                }else{
                    res.send("something wrong")
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


const showlogeditprofileshop = async(req,res) =>{
    try{
        const [showlogshopeditprofile] = await dbsync.execute("SELECT * FROM log_editprofile_shop ORDER BY Create_editprofile_shop DESC")
        res.json(showlogshopeditprofile)
    }catch(err){
        if (err){
            console.log(err)
            res.send("have some error")
        }
    }
}


// we must to create new database for keep log 
module.exports = {editshop,showdetailshop,showlogeditprofileshop}