const dbsync = require("D:/react_project/ppap/config/datasync")

const editpartner = async(req,res) =>{
    try{
        let Id_usr = req.body.Id_usr
        const Token = req.body.Token
        // let Id_partner = req.body.Id_partner
        const Realname = req.body.Realname
        const Surname = req.body.Surname
        let Tel = req.body.Tel
        const PicPayment = req.body.PicPayment
        let IdPayment = req.body.IdPayment
        // console.log(IdPayment)
        if (Id_usr !== undefined && Token !== undefined && Realname !== undefined && Surname !== undefined && Tel !== undefined && PicPayment !== undefined && IdPayment !== undefined){
            Id_usr = parseInt(Id_usr)
            Tel = parseInt(Tel)
            // IdPayment = parseInt(IdPayment)
            // console.log(IdPayment)
            // && isNaN(IdPayment) !== undefined
            if (isNaN(Id_usr) !== true && isNaN(Tel) !== true ) {
                const [UserAdmin] = await dbsync.execute("SELECT * FROM users WHERE Id_usr=? AND Gen_usr=?",[Id_usr,Token])
                if (UserAdmin.length === 1){
                    Tel = `${0}${Tel}`
                    await dbsync.execute("INSERT INTO log_editprofile_partner (Id_parner,UserName_editprofile_partner) VALUES (?,?)",[Id_usr,UserAdmin[0].UserName_usr])
                    await dbsync.execute("UPDATE partner SET PhoneNumber_device_partner=?,Name_partner=?,Lastname_partner=?,Pic_Payment_partner=?,Id_Payment_partner=?  WHERE Id_usr_partner=?",[Tel,Realname,Surname,PicPayment,IdPayment,Id_usr])
                    res.send("edit success")
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

const showprofilepartner = async(req,res) =>{
    try{
        let Id_usr = req.body.Id_usr
        const Token = req.body.Token
        // let Id_partner = req.body.Id_partner
        if (Id_usr !== undefined && Token !== undefined){
           Id_usr = parseInt(Id_usr)
           if (isNaN(Id_usr) !== true){
            const [User] = await dbsync.execute("SELECT * FROM users WHERE Id_usr=? AND Gen_usr=?",[Id_usr,Token])
            if (User.length === 1){
                const [Partner] = await dbsync.execute("SELECT * FROM partner WHERE Id_usr_partner=?",[Id_usr])
                if (Partner.length === 1){
                    res.json(Partner)
                }else if (Partner.length === 0){
                    res.send("this partner don't have in data")
                }else{
                    res.send("something wrong")
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
            res.send
        }
    }catch(err){
        if (err){
            console.log(err)
            res.send("have some error")
        }
    }
}

const showlogeditprofilepartner = async(req,res) =>{
    try{
        const [showlogshopeditprofile] = await dbsync.execute("SELECT * FROM log_editprofile_partner ORDER BY Create_editprofile DESC")
        console.log("whatt")
        res.json(showlogshopeditprofile)

    }catch(err){
        if (err){
            console.log(err)
            res.send("have some error")
        }
    }
}

// we must to create new database for keep log 
module.exports = {editpartner,showprofilepartner,showlogeditprofilepartner}