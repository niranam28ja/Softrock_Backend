const { version } = require("uuid")
const dbsync = require("D:/react_project/ppap/config/datasync")


const updateversion = async (req, res) => {
    try {
        const System = req.body.System
        let Version = req.body.Version
        let Id_admin = req.body.Id_admin
        const Token = req.body.Token
        if (System !== undefined && Version !== undefined && Id_admin !== undefined && Token !== undefined) {
            Version = parseFloat(Version).toFixed(2)
            Id_admin = parseInt(Id_admin)
            console.log(Version)
            if (isNaN(Version) !== true && isNaN(Id_admin) !== true) {
                const [checkadmin] = await dbsync.execute("SELECT Id_usr FROM users WHERE Id_usr=? AND Gen_usr=?",[Id_admin,Token])
                if (checkadmin.length === 1){
                    const [findsystem] = await dbsync.execute("SELECT Id FROM version WHERE System=?",[System])
                    if (findsystem.length >= 1){
                        await dbsync.execute("UPDATE version SET Version=? WHERE System=?",[Version,System])
                        res.send("update version success")
                    }else if (findsystem.length === 0){
                        res.send("this system don't have in data")
                    }else{
                        res.send("something wrong")
                    }
                }else if(checkadmin.length === 0){
                    res.send("this user admin don't have in data")
                }else{
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


module.exports = { updateversion }