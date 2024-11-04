const dbsync = require("D:/react_project/ppap/config/datasync")


const log_login = async(req,res) =>{
    try{
        const Ipnet = req.body.Ipnet
        const Typephone = req.body.Typephone
        const Brandphone = req.body.Brandphone
        const Modelphone = req.body.Modelphone
        const Version = req.body.Version
        const Latitude = req.body.Latitude
        const Longitude = req.body.Longitude
        if (Typephone !== undefined && Brandphone !== undefined && Modelphone !== undefined && Version !== undefined && Latitude !== undefined && Longitude !== undefined && Ipnet !== undefined){
            const [sql] = await dbsync.execute("INSERT INTO log_login (Ip_log,Typephone_log,Brand_log,Model_log,Ver_log,Latitude,Longitude) VALUES (?,?,?,?,?,?,?)",[Ipnet,Typephone,Brandphone,Modelphone,Version,Latitude,Longitude])
            res.send("ok")
        }else{
            res.send("lol")
        }
    }catch(err){
        if (err) throw err
    }
}

module.exports = log_login