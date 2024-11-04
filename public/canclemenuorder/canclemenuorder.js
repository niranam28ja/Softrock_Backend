const dbsync = require("D:/react_project/ppap/config/datasync")


// this link nothing to use 
const canclemenuorder = async(req,res) =>{
    try{
        let Id_order = req.body.Id_order
        let Id_usr = req.body.Id_usr
        let Id_menuorder = req.body.Id_menuorder
        if (Id_order !== undefined && Id_usr !== undefined && Id_menuorder !== undefined){
            Id_order = parseInt(Id_order)
            Id_usr = parseInt(Id_usr)
            Id_menuorder = parseInt(Id_menuorder)
            if (isNaN(Id_order) !== true && isNaN(Id_usr) !== true && isNaN(Id_menuorder) !== true){
                const [OrderData] = await dbsync.execute("SELECT * FROM paysuccess WHERE Id_order_paysuccess=? AND Id_usr_paysuccess=?",[Id_order,Id_usr])
                if (OrderData.length === 1){
                    const [MenuOrder] = await dbsync.execute("SELECT * FROM addorder WHERE Idorder_addor=? AND Id_addor=?",[Id_order,Id_menuorder])
                    if (MenuOrder.length === 1){
                        await dbsync.execute("DELETE FROM addorder WHERE Id_addor=?",[Id_menuorder])
                        res.send('delete menu success')
                    }else if (MenuOrder.length === 0){
                        res.send("this menu don't have in order")
                    }
                }else if (OrderData.length === 0){
                    res.send("this order don't have in data")
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

module.exports = {canclemenuorder}