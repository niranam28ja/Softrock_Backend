const { rmSync } = require("fs")
const dbsync = require("D:/react_project/ppap/config/datasync")


const showallwithdrawshop = async(req,res) =>{
    try{
        let Idshop = req.body.Idshop
        if (Idshop !== undefined){
            Idshop = parseInt(Idshop)
            if (isNaN(Idshop) !== true){
                const [findwithdrawshop] = await dbsync.execute("SELECT * FROM showshopwithdraw WHERE Id_shop_withdraw_shop=? ORDER BY Date_withdraw_shop DESC",[Idshop])
                if (findwithdrawshop.length > 0){
                    // res.json(findwithdrawshop)
                    for (let i = 0; findwithdrawshop.length > i; i++) {
                        const date = findwithdrawshop[i].Date_withdraw_shop
                        findwithdrawshop[i].Date_withdraw_shop = date.toISOString().slice(0, 19).replace('T', ' ')
                        if (findwithdrawshop.length - 1 === i) {
                            res.json(findwithdrawshop)
                        }
                    }
                }else if(findwithdrawshop.length === 0){
                    res.send("this shop don't have withdraw in data")
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

module.exports = {showallwithdrawshop}