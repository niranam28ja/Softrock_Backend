const dbsync = require("D:/react_project/ppap/config/datasync")
// const { showpartner } = require("../regispartner/registerpartner")
const line = require("@line/bot-sdk")
const dotenv = require("dotenv")
dotenv.config()

const client = new line.Client({
    channelAccessToken: process.env.Longlivedtoken,
    channelSecret: process.env.Channelsecret
})



const withdrawpartnerrequest = async (req, res) => {
    try {
        let Iduser = req.body.Iduser
        let Amount = req.body.Amount
        if (Iduser !== undefined && Amount !== undefined) {
            Iduser = parseInt(Iduser)
            Amount = parseFloat(Amount)
            if (isNaN(Iduser) !== true && isNaN(Amount) !== true) {
                if (Amount > 0) {
                    const [findpartnerwithdraw] = await dbsync.execute("SELECT * FROM totalwithdraw_partner WHERE Id_usr_total_partner=?", [Iduser])
                    if (findpartnerwithdraw.length === 1) {
                        if (findpartnerwithdraw[0].Amount_total_partner >= Amount) {
                            const minustotal = findpartnerwithdraw[0].Amount_total_partner - Amount
                            if (minustotal >= 0) {
                                const [requestpartnerwithdraw] = await dbsync.execute("INSERT INTO showpartnerwithdrawrequest (Id_usr_partner_withdraw,Amount_partner_withdraw,Status_partner_withdraw) VALUES (?,?,0)", [findpartnerwithdraw[0].Id_usr_total_partner, Amount])
                                const [updateTotalpartner] = await dbsync.execute("UPDATE totalwithdraw_partner SET Amount_total_partner=? WHERE Id_total_partner=?",[minustotal,findpartnerwithdraw[0].Id_total_partner])
                                res.send("success")
                            } else {
                                res.send("something wrong")
                            }
                        } else {
                            res.send("you Amount is more than your Total")
                        }
                    }else {
                        res.send("something wrong")
                    }
                } else {
                    res.send("your amount must to more than 0")
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

const showwithdrawpartnerrequest = async(req,res) =>{
    try{
        const [findpartnerwithdrawrequest] = await dbsync.execute("SELECT * FROM showpartnerwithdrawrequest ORDER BY Date_partner_withdraw")
        if (findpartnerwithdrawrequest.length > 0){
            res.json(findpartnerwithdrawrequest)
        }else{
            res.send("don't have partner request yet")
        }
    }catch(err){
        if (err){
            console.log(err)
            res.send("have some error")
        }
    }
}

const allowwithdrawpartnerrequest = async(req,res) =>{
    try{
        let Idadmin = req.body.Idadmin
        let Idpartner = req.body.Idpartner
        let Iduser = req.body.Iduser
        if (Idadmin !== undefined && Idpartner !== undefined && Iduser !== undefined){
            Idadmin = parseInt(Idadmin)
            Idpartner = parseInt(Idpartner)
            Iduser = parseInt(Iduser)
            if (isNaN(Idadmin) !== true && Idpartner !== true && isNaN(Iduser) !== true){
                const [checkadmin] = await dbsync.execute("SELECT * FROM users WHERE Id_usr=? AND Status_usr=9",[Idadmin])
                if (checkadmin.length === 1){
                    const [checkpartnerwithdraw] = await dbsync.execute("SELECT * FROM totalwithdraw_partner WHERE Id_usr_total_partner=?",[Iduser])
                    if (checkpartnerwithdraw.length === 1){
                           const [FindPartnerWithdraw] = await dbsync.execute("SELECT Amount_partner_withdraw FROM showpartnerwithdrawrequest WHERE Id_partner_withdraw=? AND Id_usr_partner_withdraw=?",[Idpartner,Iduser])
                           if (FindPartnerWithdraw.length === 1){
                                await dbsync.execute("UPDATE showpartnerwithdrawrequest SET Status_partner_withdraw=1 WHERE Id_partner_withdraw=? AND Id_usr_partner_withdraw=?",[Idpartner,Iduser])
                                const [Finduser] = await dbsync.execute("SELECT UserName_usr,Id_line_usr FROM users WHERE Id_usr=?",[checkpartnerwithdraw[0].Id_usr_total_partner])     
                                if (Finduser.length === 1){
                                    await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?)", ['Softrock',`คำขอถอนเงินของคุณ ${Finduser[0].UserName_usr} จำนวน ${FindPartnerWithdraw[0].Amount_partner_withdraw} อนุมัติเรียบร้อยครับ วันที่ ${new Date().toLocaleString()}`, Idadmin, 'Softrock', checkpartnerwithdraw[0].Id_usr_total_partner, "Don't have Idorder", 1])
                                if (Finduser[0].Id_line_usr != 0){
                                        const sms = [{
                                            type: 'text',
                                            text: `คำขอถอนเงินของคุณ ${Finduser[0].UserName_usr} จำนวน ${FindPartnerWithdraw[0].Amount_partner_withdraw} อนุมัติเรียบร้อยครับ วันที่ ${new Date().toLocaleString()}`
                                        }]
                                        const sendm = await client.pushMessage(Finduser[0].Id_line_usr, sms)
                                        res.status(200).send("success")
                                    }else{
                                        res.status(200).send("success")
                                }
                                }else{
                                    res.send("success")
                                }   
                           }else{
                                res.send("this withdrawrequest don't have data")
                           }                    
                    }else{
                        res.send("something wrong")
                    }
                }else if (checkadmin.length === 0){
                    res.send("this admin user don't have in data")
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
        if (er){
            console.log(err)
            res.send("have some error")
        }
    }
}

const showwithdraw = async(req,res) =>{
    try{
        let IdPartner = req.body.Id_partner 
        const Token = req.body.Token
        if (IdPartner !== undefined && Token !== undefined){
            IdPartner = parseInt(IdPartner)
            if (isNaN(IdPartner) !== true){
                const [User] = await dbsync.execute("SELECT UserName_usr FROM users WHERE Id_usr=? AND Gen_usr=?",[IdPartner,Token])
                if (User.length === 1){
                    const [Partner] = await dbsync.execute("SELECT Id_partner FROM partner WHERE Id_usr_partner=?",[IdPartner])
                    const [ShowPartnerWithdraw] = await dbsync.execute("SELECT * FROM totalwithdraw_partner WHERE Id_usr_total_partner=?",[IdPartner])
                    if (Partner.length === 1 && ShowPartnerWithdraw.length === 1){
                        res.json(ShowPartnerWithdraw)
                    }else{
                        res.send("this partner don't have in data")
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

module.exports = { withdrawpartnerrequest,allowwithdrawpartnerrequest,showwithdrawpartnerrequest,showwithdraw }