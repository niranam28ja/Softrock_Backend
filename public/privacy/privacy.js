const dbsync = require("D:/react_project/ppap/config/datasync")


const privacy = async(req,res) =>{
    try{
        const [showpdpaprivacy] = await dbsync.execute("SELECT Text_pdpa FROM pdpa WHERE Id_pdpa=1")
        const trimString = showpdpaprivacy[0].Text_pdpa
        // res.send(trimString.trim())
        res.send(trimString)
    }catch(err){
        if (err){
            console.log(err)
            res.send(err)
        }
    }
}

module.exports = {privacy}