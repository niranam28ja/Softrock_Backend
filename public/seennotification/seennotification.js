const { rmSync } = require("fs")
const dbsync = require("D:/react_project/ppap/config/datasync")



const seennotification = async(req,res) =>{
    try{
        let IdNotification = req.body.Id_notification
        if (IdNotification !== undefined){
            IdNotification = parseInt(IdNotification)
            if (isNaN(IdNotification) !== true){
                const [Notification] = await dbsync.execute("SELECT * FROM mail_notification WHERE Id_noti=? AND Status_noti=1",[IdNotification])
                if (Notification.length === 1){
                    await dbsync.execute("UPDATE mail_notification SET Status_noti=2 WHERE Id_noti=?",[IdNotification])
                    res.send("success")
                }else{
                    res.send("this notification don't have in data")
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


module.exports = {seennotification}