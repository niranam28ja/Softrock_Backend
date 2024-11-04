const dbsync = require("D:/react_project/ppap/config/datasync")




const showallwithdrawpartner = async(req,res) =>{
    try{
        let Idpartner = req.body.Idpartner
        if (Idpartner !== undefined){
            Idpartner = parseInt(Idpartner)
            if (isNaN(Idpartner) !== true){
                const [findwithdrawpartner] = await dbsync.execute("SELECT * FROM showpartnerwithdrawrequest WHERE Id_usr_partner_withdraw=? ORDER BY Date_partner_withdraw DESC",[Idpartner])
                if (findwithdrawpartner.length > 0){
                    // res.json(findwithdrawpartner)
                    for (let i = 0; findwithdrawpartner.length > i; i++) {
                        const date = findwithdrawpartner[i].Date_partner_withdraw
                        findwithdrawpartner[i].Date_partner_withdraw = date.toISOString().slice(0, 19).replace('T', ' ')
                        if (findwithdrawpartner.length - 1 === i) {
                            res.json(findwithdrawpartner)
                        }
                    }
                }else if(findwithdrawpartner.length === 0){
                    res.send("this partner don't have withdraw in data")
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


module.exports = {showallwithdrawpartner}