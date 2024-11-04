const { response } = require("express");
const dbsync = require("../../config/datasync");
const { closeshop } = require("../../shop/closeshoporopenshop/closeshoporopenshop");

const showshoppartner = async (req, res) => {
    try {
        let Idpartner = req.body.Idpartner
        if (Idpartner !== undefined) {
            Idpartner = parseInt(Idpartner)
            if (isNaN(Idpartner) !== true) {
                const [findpartner] = await dbsync.execute("SELECT * FROM partner WHERE Id_usr_partner=?", [Idpartner])
                if (findpartner.length === 1) {
                    if (findpartner[0].Status_partner == 1) {
                        const [findshopBypartner] = await dbsync.execute("SELECT Name_shop,Id_shop,Province_shop FROM profileshop WHERE Id_partner_shop=? AND Status_shop=1", [Idpartner])
                        // console.log(findshopBypartner.length)
                        if (findshopBypartner.length > 0) {
                            let totalwithdrawshopWithpartner = 0
                            let value_shop = []
                            for (let i = 0; findshopBypartner.length > i; i++) {
                                const [findWithdrawshop] = await dbsync.execute("SELECT * FROM totalwithdraw_shop WHERE Id_shop_Total_withdraw=?", [findshopBypartner[i].Id_shop])
                                // console.log(findWithdrawshop.length)
                                if (findWithdrawshop.length == 1) {
                                    totalwithdrawshopWithpartner += Number(findWithdrawshop[0].Amount_Total_withdraw)
                                    value_shop.push({Id_Total_withdraw:findWithdrawshop[0].Id_Total_withdraw,Id_shop_Total_withdraw:findWithdrawshop[0].Id_shop_Total_withdraw,Name_shop:findshopBypartner[i].Name_shop,Province_shop:findshopBypartner[i].Province_shop,Amount_Total_withdraw:findWithdrawshop[0].Amount_Total_withdraw,Date_Update_Total_withdraw:findWithdrawshop[0].Date_Update_Total_withdraw})
                                    if (findshopBypartner.length - 1 == i) {
                                        res.json({
                                            Total: (Number(totalwithdrawshopWithpartner) * Number(100 / 90)).toFixed(2),
                                            ShopWithpartner: value_shop
                                        })
                                    }
                                } else {
                                    if (findshopBypartner.length - 1 === i) {
                                      if (value_shop.length > 0){
                                            res.json({
                                                Total: (Number(totalwithdrawshopWithpartner) * Number(100 / 90)).toFixed(2),
                                                ShopWithpartner: value_shop
                                            })
                                        }else{
                                            // console.log(value_shop)
                                            // console.log("hi")
                                            res.send("something wrong")
                                        }
                                    }
                                }
                            }
                        } else if (findshopBypartner.length === 0) {
                            res.send("your don't have shop link your partner")
                        } else {
                            // console.log("what the world ")
                            res.send("something wrong")
                        }
                    } else if (findpartner[0].Status_partner == 0) {
                        res.send("your partner didn't verify yet")
                    } else {
                        // console.log("whattt")
                        res.send("something wrong")
                    }
                } else if (findpartner.length == 0) {
                    res.send("you don't have this partner in data")
                } else {
                    // console.log("opopo")
                    res.send("something wrong")
                }
            } else {
                res.send("your value int is null")
            }
        }
    } catch (err) {
        if (err) {
            console.log(err)
            res.send("have some error")
        }
    }
}


module.exports = { showshoppartner }



