const dbsync = require("D:/react_project/ppap/config/datasync")
const dotenv = require("dotenv")
const line = require("@line/bot-sdk")
dotenv.config()

const client = new line.Client({
    channelAccessToken: process.env.Longlivedtoken,
    channelSecret: process.env.Channelsecret
})


const allowpartner = async (req, res) => {
    try {
        let Id_admin = req.body.Id_admin
        let Id_usr_partner = req.body.Id_usr_partner
        if (Id_admin !== undefined && Id_usr_partner !== undefined) {
            Id_admin = parseInt(Id_admin)
            Id_usr_partner = parseInt(Id_usr_partner)
            if (isNaN(Id_admin) !== true && isNaN(Id_usr_partner) !== true) {
                const [checkadmin] = await dbsync.execute(`SELECT UserName_usr FROM users WHERE Id_usr=${Id_admin} AND Status_usr = 9`)
                if (checkadmin.length === 1) {
                    const [findpartner] = await dbsync.execute("SELECT * FROM partner WHERE Id_usr_partner=?", [Id_usr_partner])
                    const [finduserpartner] = await dbsync.execute(`SELECT UserName_usr,Id_line_usr,Status_usr FROM users WHERE Id_usr=${Id_usr_partner}`)
                    if (findpartner.length === 1) {
                        if (finduserpartner[0].Status_usr == 1) {
                            const [updatestatus] = await dbsync.execute(`UPDATE partner SET Status_partner=${1}  WHERE Id_usr_partner=${Id_usr_partner}`)
                            const [updatestatususer] = await dbsync.execute(`UPDATE users SET Status_usr=4 WHERE Id_usr=${Id_usr_partner}`)
                            const [insertpartnerwithdraw] = await dbsync.execute("INSERT INTO totalwithdraw_partner (Id_partner_total,Id_usr_total_partner,Amount_total_partner) VALUES (?,?,0)",[findpartner[0].Id_partner,findpartner[0].Id_usr_partner])
                            await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["Softrock", `ระบบได้ทำการอนุมัติการร่วมเป็น partner ของคุณ ${findpartner[0].Name_partner} เรียบร้อยแล้ว`, 82, 'Softrock', findpartner[0].Id_usr_partner, "don't have order", 1])
                            if (finduserpartner[0].Id_line_usr != 0){
                                const sms = [{
                                    type: 'text',
                                    text: `ระบบได้ทำการอนุมัติการร่วมเป็น partner ของคุณ ${findpartner[0].Name_partner} เรียบร้อยแล้ว`
                                }]
                                const sendm = await client.pushMessage(finduserpartner[0].Id_line_usr, sms)
                                res.send("success")
                            }else{
                                res.send("success")
                            }
                        } else if (finduserpartner[0].Status_usr == 2 || finduserpartner[0].Status_usr == 3) {
                            const [updatestatus] = await dbsync.execute(`UPDATE partner SET Status_partner=${1}  WHERE Id_usr_partner=${Id_usr_partner}`)
                            const [updatestatususer] = await dbsync.execute(`UPDATE users SET Status_usr=5 WHERE Id_usr=${Id_usr_partner}`)
                            const [insertpartnerwithdraw] = await dbsync.execute("INSERT INTO totalwithdraw_partner (Id_partner_total,Id_usr_total_partner,Amount_total_partner) VALUES (?,?,0)",[findpartner[0].Id_partner,findpartner[0].Id_usr_partner])
                            await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", ["Softrock", `ระบบได้ทำการอนุมัติการร่วมเป็น partner ของคุณ ${findpartner[0].Name_partner} เรียบร้อยแล้ว`, 82, 'Softrock', findpartner[0].Id_usr_partner, "don't have order", 1])
                            if (finduserpartner[0].Id_line_usr != 0){
                                const sms = [{
                                    type: 'text',
                                    text: `ระบบได้ทำการอนุมัติการร่วมเป็น partner ของคุณ ${findpartner[0].Name_partner} เรียบร้อยแล้ว`
                                }]
                                const sendm = await client.pushMessage(finduserpartner[0].Id_line_usr, sms)
                                res.send("success")
                            }else{
                                res.send("success")
                            }
                        }else if(finduserpartner[0].Status_usr == 4 || finduserpartner[0].Status_usr == 5){
                            res.send("this user has been partner")
                        }else{
                            // console.log(findpartner[0].Status_usr)
                            res.send("something wrong")
                        }
                    } else if (findpartner.length === 0) {
                        res.send("your Iduser type wrong")
                    } else {
                        // console.log(findpartner.length)
                        // console.log("what the world ")
                        res.send("something wrong")
                    }
                } else if (checkadmin.length === 0) {
                    res.send("this user not admin")
                } else {
                    // console.log("eepiof")
                    res.send("something wrong")
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

const allowpartnerrequest = async(req,res) => {
    try{
        const [showpartnerrequest] = await dbsync.execute("SELECT Id_usr_partner,UserName_usr_partner,Name_partner,Province_partner FROM partner WHERE Status_partner=0 ORDER BY Date_partner")
        if (showpartnerrequest.length > 0){
            res.json(showpartnerrequest)
        }else {
            res.send("don't have partner request yet")
        }
    }catch(err){
        if (err){
            console.log(err)
            res.send("have some error")
        }
    }
}


module.exports = { allowpartner, allowpartnerrequest }