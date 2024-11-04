const dbsync = require("D:/react_project/ppap/config/datasync")


const addcreditcard = async(req,res) =>{
    try{
        const Username = req.body.Username
        const Token = req.body.Token
        let Cardnum = req.body.Cardnum
        let Expirationdate = req.body.Expirationdate
        let Backnumbercard = req.body.Backnumbercard
        const Firstname = req.body.Firstname
        const Lastname = req.body.Lastname
        if (Username !== undefined && Token !== undefined && Cardnum !== undefined && Expirationdate !== undefined && Backnumbercard !== undefined && Firstname !== undefined && Lastname !== undefined){
            Cardnum = parseInt(Cardnum)
            Expirationdate = parseInt(Expirationdate)
            Backnumbercard = parseInt(Backnumbercard)
            if (isNaN(Cardnum) !== true && isNaN(Expirationdate) !== true && isNaN(Backnumbercard) !== undefined){
                    const [checkuser] = await dbsync.execute("SELECT Id_usr FROM users WHERE UserName_usr=? AND Gen_usr=?",[Username,Token])
                    if (checkuser.length == 1){
                            const [addcreditcard] = await dbsync.execute("INSERT INTO addcreditcard (Idusr_credit,Gen_usr_credit,Cardnum_credit,Expiration_credit,Backnum_credit,Firstname_credit,Lastname_credit) VALUES(?,?,?,?,?,?,?)",[checkuser[0].Id_usr,Token,Cardnum,Expirationdate,Backnumbercard,Firstname,Lastname])
                            res.send("success")
                    }else if(checkuser.length ==0){
                        res.send("you don't have user in data")
                    }else{
                        res.send("something wrong")
                    }
            }else{
                res.send("your values int is null")
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



module.exports = {addcreditcard}
