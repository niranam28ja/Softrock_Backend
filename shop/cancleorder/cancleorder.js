const { user } = require("../../config/config")
const dbsync = require("D:/react_project/ppap/config/datasync")
const line = require("@line/bot-sdk")
const dotenv = require("dotenv")
dotenv.config()


const client = new line.Client({
    channelAccessToken: process.env.Longlivedtoken,
    channelSecret: process.env.Channelsecret
})


const cancleorder = async(req,res) =>{
    try{
        let Id_order = req.body.Id_order
        let Id_shop = req.body.Id_shop
        if (Id_order !== undefined && Id_shop !== undefined ){
            Id_order = parseInt(Id_order)
            Id_shop = parseInt(Id_shop)
            if (isNaN(Id_order) !== true && isNaN(Id_shop) !== true){
                const [Order] = await dbsync.execute("SELECT * FROM paysuccess WHERE Id_order_paysuccess=? AND Id_shop_paysucess=? AND Status_paysuccess=1",[Id_order,Id_shop])
                if (Order.length  === 1){
                    const [Shop] = await dbsync.execute("SELECT Name_shop FROM profileshop WHERE Id_shop=?",[Order[0].Id_shop_paysucess])
                    await dbsync.execute("UPDATE paysuccess SET Status_paysuccess=5 WHERE Id_order_paysuccess=? AND Id_shop_paysucess=?",[Id_order,Id_shop])
                    await dbsync.execute("INSERT INTO cancle_order (Id_order_cancle,Id_shop_cancle,Id_usr_cancle) VALUES (?,?,?) ",[Order[0].Id_order_paysuccess,Order[0].Id_shop_paysucess,Order[0].Id_usr_paysuccess])
                    await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["shop", `ยกเลิก Order เลขที่ ${Order[0].Id_order_paysuccess} จากทางร้าน ${Shop[0].Name_shop} เวลา ${new Date().toDateString} ระบบกำลังทำเรื่องคืนเงินให้คุณในขณะนี้`, Order[0].Id_shop_paysucess, 'shop', Order[0].Id_usr_paysuccess, Order[0].Id_order_paysuccess, 1])
                    const [User] = await dbsync.execute("SELEECT Id_line_usr FROM users WHERE Id_usr=?",[Order[0].Id_usr_paysuccess])
                    if (User.length === 1 && user[0] !== undefined){
                        if (User[0].Id_line_usr != 0){
                            const sms = [{
                                type: 'text',
                                text: `ยกเลิก Order เลขที่ ${Order[0].Id_order_paysuccess} จากทางร้าน ${Shop[0].Name_shop} เวลา ${new Date().toDateString} ระบบกำลังทำเรื่องคืนเงินให้คุณในขณะนี้`
                            }]
                            const sendm = await client.pushMessage(User[0].Id_line_usr, sms)
                            res.send("cancle order success")
                        }else{
                            res.send("cancle order success")
                        }
                    }else{
                        res.send("cancle order success")
                    }
                }else{
                    res.send("this order don't have in data")
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

const showcancleorderrequest = async(req,res) =>{
    try{
        let Id_admin = req.body.Id_admin
        const Token = req.body.Token
        if (Id_admin !== undefined && Token !== undefined){
           Id_admin = parseInt(Id_admin)
           if (isNaN(Id_admin) !== true){
                const [Admin] = await dbsync.execute("SELECT * FROM users WHERE Id_usr=? AND Gen_usr=? AND Status_usr=9",[Id_admin,Token])
                if (Admin.length === 1){
                    const [LogCanclrOrder] = await dbsync.execute("SELECT * FROM cancle_order WHERE Status_cancle=0")
                    res.send(LogCanclrOrder)
                }else if (Admin.length === 0){
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


const allowcancleorder  = async(req,res) =>{
    try{
        let Id_admin = req.body.Id_admin
        const Token = req.body.Token
        let Id_cancleorder = req.body.Id_cancleorder
        if (Id_admin !== undefined && Token !== undefined && Id_cancleorder !== undefined){
            Id_admin = parseInt(Id_admin)
            Id_cancleorder = parseInt(Id_cancleorder)
            if (isNaN(Id_admin) !== true && isNaN(Id_cancleorder) !== true){
                const [Admin] = await dbsync.execute("SELECT * FROM users WHERE Id_usr=? AND Gen_usr=? AND Status_usr=9",[Id_admin,Token])
                if (Admin.length === 1){
                    const [CancleOrder] = await dbsync.execute("SELECT * FROM cancle_order WHERE Id_cancle_order=? AND Status_cancle=0",[Id_cancleorder])
                    if (CancleOrder.lengtn === 1){
                        await dbsync.execute("UPDATE cancle_order SET Status_cancle=1 WHERE Id_cancle_order=?",[Id_cancleorder])
                        await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["Softrock",`ทางเราได้คืนเงินของท่านเป็นที่เรียบร้อย`, 82, 'Softrock', CancleOrder[0].Id_usr_cancle, 0, 1])
                        const [User] = await dbsync.execute("SELECT Id_line_usr FROM users WHERE Id_usr=?",[CancleOrder[0].Id_usr_cancle])
                        if (User.length === 1 && User[0] !== undefined){
                            if (User[0].Id_line_usr != 0){
                                const sms = [{
                                    type: 'text',
                                    text: `ทางเราได้คืนเงินของท่านเป็นที่เรียบร้อย`
                                }]
                                const sendm = await client.pushMessage(User[0].Id_line_usr, sms)
                                res.send("cancleorder success")
                            }else{
                                res.send("cancleorder success")
                            }
                        }else{
                            res.send("cancleorder success")
                        }
                    }else{
                        res.send("this cancle order don't have in data")
                    }
                }else if (Admin.length === 0){
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
module.exports = {cancleorder,showcancleorderrequest,allowcancleorder}