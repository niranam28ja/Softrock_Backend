const dbsync = require("D:/react_project/ppap/config/datasync")


const checkAccesspartner = async(req,res) =>{
    try{
        const [FindPartner] = await dbsync.execute("SELECT Id_usr_partner FROM partner")
        if (FindPartner.length < 200 ){
            res.send("Partner can register")
        }else if (FindPartner.length >= 200){
            res.send("Unable to apply for a partner because 200 people have already applied")
        }else{
            res.send("something wrong")
        }
    }catch(err){
        if (err){
            console.log(err)
            res.send("have some error")
        }
    }
}

module.exports = {checkAccesspartner}