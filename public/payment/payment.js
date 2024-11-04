const { user } = require("../../config/config")
const { givestar } = require("../../shop/givestarshop/givestarshop")
const dbsync = require("D:/react_project/ppap/config/datasync")
const line = require("@line/bot-sdk")
const dotenv = require("dotenv")
dotenv.config() // config file .env
// config line 
const client = new line.Client({
    channelAccessToken: process.env.Longlivedtoken,
    channelSecret: process.env.Channelsecret
})


const payment = async(req,res) =>{
    try{
        let IdUser = req.body.Iduser
        const UserName = req.body.Username
        const TokenUser = req.body.TokenUser
        let DatePayment  =req.body.DatePayment
        let TotalPayment = req.body.Totalpayment
        // console.log(DatePayment)
        const PicPayment = req.body.PicPayment
        // console.log(TotalPayment)
        if (IdUser !== undefined && UserName !== undefined && TokenUser !== undefined && DatePayment !== undefined && TotalPayment !== undefined && PicPayment !== undefined){
            IdUser = parseInt(IdUser)
            TotalPayment = parseInt(TotalPayment)
            if (isNaN(IdUser) !== true && isNaN(TotalPayment) !== true){
                DatePayment =  new Date(DatePayment)
                if (isNaN(DatePayment) !== true && DatePayment !== null){
                    const [User]  = await dbsync.execute(`SELECT * FROM users WHERE Id_usr=? AND Gen_usr=?`,[IdUser,TokenUser])
                    if (User.length === 1){
                        await dbsync.execute("INSERT INTO credit_payment (Id_usr_payment,Pic_payment,Total_payment,Status_payment,Date_total_payment) VALUES (?,?,?,?,?)",[IdUser,PicPayment,TotalPayment,0,DatePayment])
                        res.send("success")
                    }else{
                        res.send("this user don't have in data")
                    }
                }else{
                    res.send("your type date is wrong")
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


const showpaymentRequest = async(req,res) =>{
    try{
        let Id_admin = req.body.Id_admin
        const Token = req.body.Token
        if (Id_admin !== undefined && Token !== undefined){
            Id_admin = parseInt(Id_admin)
            if (isNaN(Id_admin) !== true){
                const [ShowCreditpayment] = await dbsync.execute("SELECT * FROM credit_payment ORDER BY Create_payment DESC")
                res.json(ShowCreditpayment)
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


const allowpayment = async(req,res) =>{
    try{
        let IdAdmin = req.body.IdAdmin
        const Token = req.body.Token
        let IdPayment = req.body.IdPayment
        if (IdAdmin !== undefined && Token !== undefined && IdPayment !== undefined){
            IdAdmin = parseInt(IdAdmin)
            IdPayment = parseInt(IdPayment)
            if (isNaN(IdAdmin) !== true && isNaN(IdPayment) !== true){
                const [Admin] = await dbsync.execute("SELECT * FROM users WHERE Id_usr=? AND Gen_usr=? AND Status_usr=9",[IdAdmin,Token])
                if (Admin.length === 1){
                    const [Payment] = await dbsync.execute("SELECT * FROM credit_payment WHERE Id_payment=? AND Status_payment=0",[IdPayment])
                    if (Payment.length === 1){
                        const [User] = await dbsync.execute("SELECT Id_line_usr,Total_payment_usr,Star_usr FROM users WHERE Id_usr=?",[Payment[0].Id_usr_payment])
                        if (User.length === 1){
                            let Total = User[0].Total_payment_usr
                            let GiveStarUser = Math.floor(Payment[0].Total_payment / 100)
                            let Stargive = Math.floor(Payment[0].Total_payment / 100)
                            GiveStarUser += User[0].Star_usr
                            Total += Payment[0].Total_payment
                            await dbsync.execute("UPDATE credit_payment SET Status_payment=1 WHERE Id_payment=?",[IdPayment])
                            await dbsync.execute("UPDATE users SET Total_payment_usr=?,Star_usr=? WHERE Id_usr=?  ",[Total,GiveStarUser,Payment[0].Id_usr_payment])
                            await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["Softrock", `ระบบได้ทำการอนุมัติการเติมเงินของคุณจำนวน ${Payment[0].Total_payment} บาท และคุณได้โบนัสเพื่มจำนวน ${Stargive} ดาว`, 82, 'Softrock', Payment[0].Id_usr_payment, "don't have order", 1])
                            if (User[0].Id_line_usr != 0){
                                const sms = [{
                                    type: 'text',
                                    text: `ระบบได้ทำการอนุมัติการเติมเงินของคุณจำนวน ${Payment[0].Total_payment} บาท และคุณได้โบนัสเพื่มจำนวน ${Stargive} ดาว`
                                }]
                                const sendm = await client.pushMessage(User[0].Id_line_usr, sms)
                                res.send("allow payment success")
                            }else{
                                res.send("allow payment success")    
                            }
                        }else{
                            res.send("this user don't have in data")
                        }
                    }else{
                        res.send("this payment don't have in data")
                    }
                }else{
                    res.send("this admin don't have in data")
                }
            }else{
                res.send("your value int is null")
            }
        }else{
            res.send()
        }
    }catch(err){
        console.log(err)
        res.send("have some error")
    }
}


// do notification 

module.exports = {payment,showpaymentRequest,allowpayment}



// let Total = Admin[0].Total_payment_usr
// console.log(Total)







