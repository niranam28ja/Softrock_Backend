const { discountBalance } = require("../../public/showadvertising/showadvertising")
const { findusermenuorder } = require("../../shop/findorder/Findorder")
const { registerEmail } = require("../register/Regis")
const dbsync = require("D:/react_project/ppap/config/datasync")


const successfullyordered = async (req, res) => {
    try {
        let Idorder = req.body.Idorder
        if (Idorder !== undefined) {
            Idorder = parseInt(Idorder)
            if (isNaN(Idorder) !== true) {
                const [findorder] = await dbsync.execute("SELECT * FROM paysuccess WHERE Id_order_paysuccess=? AND Status_paysuccess=2", [Idorder])
                if (findorder.length == 1) {
                    const [UpdateStatusorder] = await dbsync.execute("UPDATE paysuccess SET Status_paysuccess=3 WHERE Id_order_paysuccess=?", [Idorder])
                    const [UpdateStatusMenuorder] = await dbsync.execute("UPDATE addorder SET Status_addor=4 WHERE Idorder_addor=?", [Idorder])
                    // const updatewithdraw = await updateTotalwithdraw(findorder[0].Pricetotal_paysuccess, findorder[0].Id_shop_paysucess)
                    const [findshop] = await dbsync.execute("SELECT Name_shop FROM profileshop WHERE Id_shop=?", [findorder[0].Id_shop_paysucess])
                    if (findshop.length === 1) {
                        await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?,?)", [findorder[0].UserName_usr_paysuccess, `Order ${findorder[0].Id_order_paysuccess} ของคุณเสร็จแล้ว สามารถรับอาหารได้ตอนนี้ ${new Date()}`, findorder[0].Id_usr_paysuccess, "user", findorder[0].Id_shop_paysucess, findorder[0].Id_order_paysuccess, 1])
                        // await dbsync.execute("INSERT INTO user_finish VALUES (?)",[findorder[0].Id_usr_paysuccess])
                        const [User] = await dbsync.execute("SELECT Id_line_usr FROM users WHERE Id_usr=?",[findorder[0].Id_shop_paysucess])
                        if (User.length === 1 && User[0] !== undefined){
                            if (User[0].Id_line_usr != 0){
                                const sms = [{
                                    type: 'text',
                                    text: `คุณได้รับอาหารเป็นที่เรียบร้อย ขอบคุณที่ใช้บริการ`
                                }]
                                const sendm = await client.pushMessage(User[0].Id_line_usr, sms)
                                const [FindOwnShop] = await dbsync.execute("SELECT UserName_shop FROM profileshop WHERE Id_shop=?",[findorder[0].Id_shop_paysucess])
                                if (FindOwnShop.length == 1){
                                    const [FindUserOwnShop] = await dbsync.execute("SELECT Id_line_usr FROM users WHERE UserName_usr=?",[FindOwnShop[0].UserName_shop])
                                    if (FindUserOwnShop.length === 1 && FindUserOwnShop[0] !== undefined){
                                        if (FindUserOwnShop[0].Id_line_usr != 0){
                                            const SendToOwnShop = [{
                                                type: 'text',
                                                text: `ออเดอร์ ${findorder[0].Id_order_paysuccess} ลูกค้าได้รับอาหารเป็นที่เรียบร้อย`
                                            }]
                                            const sendm = await client.pushMessage(FindUserOwnShop[0].Id_line_usr, sms)
                                            res.send("success")
                                        }else{
                                            res.send("success")
                                        }
                                    }else{
                                        res.send("success")
                                    }
                                }else{
                                    res.send("success")
                                }
                            }else{
                                res.send("success")
                            }
                        }else{
                            res.send("success")
                        }
                    } else {
                        res.send("something wrong")
                    }
                } else if (findorder.length === 0) {
                    res.send("you don't have this order in data")
                } else {
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

const updateTotalwithdraw = async (detailshop, detailorder) => {
    try {
        // check data in two parametor
        if (detailshop.length === 1 && detailorder.length === 1) {
            let Idorder = detailorder[0].Id_order_paysuccess
            let Amount = detailorder[0].Pricetotal_paysuccess
            let Star_use = detailorder[0].Star_use_paysuccess
            let Idshop = detailorder[0].Id_shop_paysucess
            let StatusOrder = detailorder[0].Status_paysuccess
            if (Idorder !== undefined && Amount !== undefined && Star_use !== undefined && Idshop !== undefined) {
                // check value inside 
                if (StatusOrder == "1") {
                    const [Getlogstar] = await dbsync.execute("SELECT * FROM star_log WHERE Id_order_starlog=?", [Idorder])
                    if (Getlogstar.length === 1) {
                        const [findpartnerinShopData] = await dbsync.execute("SELECT Id_partner_shop FROM profileshop WHERE Id_shop=?", [Idshop])
                        if (findpartnerinShopData.length === 1) {
                            let IdPartner = findpartnerinShopData[0].Id_partner_shop
                            if (IdPartner == 0) {
                                const [findShopWithdraw] = await dbsync.execute("SELECT Amount_Total_withdraw FROM totalwithdraw_shop WHERE Id_shop_Total_withdraw=?", [Idshop])
                                if (findShopWithdraw.length === 1) {
                                    const AmountShop = findShopWithdraw[0].Amount_Total_withdraw
                                    const DiscountShop = Number((Amount + Star_use) * (90 / 100)) + Number(AmountShop)
                                    // console.log(DiscountShop)
                                    await dbsync.execute("UPDATE totalwithdraw_shop SET Amount_Total_withdraw=? WHERE Id_shop_Total_withdraw=?", [DiscountShop, Idshop])
                                    return "success"
                                } else {
                                    return "something wrong"
                                }
                            } else if (IdPartner > 0) {
                                const [findPartnerWithdraw] = await dbsync.execute("SELECT Amount_total_partner FROM totalwithdraw_partner WHERE Id_usr_total_partner=?", [IdPartner])
                                if (findPartnerWithdraw.length === 1) {
                                    const [findShopWithdraw] = await dbsync.execute("SELECT Amount_Total_withdraw FROM totalwithdraw_shop WHERE Id_shop_Total_withdraw=?", [Idshop])
                                    if (findShopWithdraw.length === 1) {
                                       const [Partner] = await dbsync.execute("SELECT Rank_partner FROM partner WHERE Id_usr_partner=?",[IdPartner])
                                       if (Partner.length === 1){
                                            if (Partner[0].Rank_partner  == 1){
                                                const AmountPartner = findPartnerWithdraw[0].Amount_total_partner
                                                const AmountShop = findShopWithdraw[0].Amount_Total_withdraw
                                                const DiscountShop = Number((Amount + Star_use) * (90 / 100)) + Number(AmountShop)
                                                const DiscountPartner = Number((Amount) * (1 / 100)) + Number(AmountPartner)
                                                // console.log(DiscountShop)
                                                // console.log(DiscountPartner)
                                                await dbsync.execute("UPDATE totalwithdraw_shop SET Amount_Total_withdraw=? WHERE Id_shop_Total_withdraw=?", [DiscountShop, Idshop])
                                                await dbsync.execute("UPDATE totalwithdraw_partner SET Amount_total_partner=? WHERE Id_usr_total_partner=?", [DiscountPartner, IdPartner])
                                                return "success"
                                            }else if (Partner[0].Rank_partner == 2){
                                                const AmountPartner = findPartnerWithdraw[0].Amount_total_partner
                                                const AmountShop = findShopWithdraw[0].Amount_Total_withdraw
                                                const DiscountShop = Number((Amount + Star_use) * (90 / 100)) + Number(AmountShop)
                                                const DiscountPartner = Number((Amount) * (1.5 / 100)) + Number(AmountPartner)
                                                // console.log(DiscountShop)
                                                // console.log(DiscountPartner)
                                                await dbsync.execute("UPDATE totalwithdraw_shop SET Amount_Total_withdraw=? WHERE Id_shop_Total_withdraw=?", [DiscountShop, Idshop])
                                                await dbsync.execute("UPDATE totalwithdraw_partner SET Amount_total_partner=? WHERE Id_usr_total_partner=?", [DiscountPartner, IdPartner])
                                                return "success"
                                            }else{
                                                return "something wrong"
                                            }
                                       }else{
                                            return "something wrong"
                                       }
                                    } else {
                                        return "something wrong"
                                    }
                                } else if (findPartnerWithdraw.length === 0) {
                                    return "this partner don't have in data"
                                } else {
                                    return "something wrong"
                                }
                            } else {
                                return "something wrong"
                            }
                        } else {
                            return "don't have this shop in data"
                        }
                    } else {
                        return "don't have this order in Star_log"
                    }
                } else {
                    return "this order has been success by shop"
                }
            } else {
                return "something wrong"
            }
        } else {
            return "something wrong"
        }
    } catch (err) {
        if (err) {
            console.log(err)
            return "have some error"
        }
    }
}



module.exports = { successfullyordered, updateTotalwithdraw }
// AND Status_partner!=0

// const [findlistTotalwithdraw] = await dbsync.execute("SELECT * FROM totalwithdraw_shop WHERE Id_shop_Total_withdraw=?",[Idshop])
//             if (findlistTotalwithdraw.length == 1){
//               let AllAmount = findlistTotalwithdraw[0].Amount_Total_withdraw + Amount
//               if (isNaN(AllAmount) !== true){
//                 await dbsync.execute("UPDATE totalwithdraw_shop SET Amount_Total_withdraw=? WHERE Id_shop_Total_withdraw=?",[AllAmount,Idshop])
//                 return "success"
//               }else{
//                 return "something wrong"
//               }
//             }else if (findlistTotalwithdraw.length == 0){
//                 await dbsync.execute("INSERT INTO totalwithdraw_shop (Id_shop_Total_withdraw,Amount_Total_withdraw) VALUES (?,?)",[Idshop,Amount])
//                 return "success"
//             }else{
//                 console.log("oos")
//                 return "something wrong"
//             }


// if (updatewithdraw === 'success') {
//     const [findshop] = await dbsync.execute("SELECT Name_shop FROM profileshop WHERE Id_shop=?", [findorder[0].Id_shop_paysucess])
//     if (findshop.length === 1) {
//         await dbsync.execute("INSERT INTO mail_notification (Subject_noti,Detail_noti,Id_send_noti,Send_from_noti,Id_Recive_noti,Id_order_noti,Status_noti) VALUES (?,?,?,?,?,?)", [findorder[0].UserName_usr_paysuccess, `${Idorder} ${findorder[0].Datewanttogo_paysuccess}`, findorder[0].Id_usr_paysuccess, "user", findorde[0].Id_shop_paysucess, findorder[0].Id_order_paysuccess, 1])
//         res.send("success")
//     } else {
//         res.send("something wrong")
//     }
// } else if (updatewithdraw === "something wrong") {
//     res.send("something wrong")
// } else if (updatewithdraw === "have some error") {
//     res.send("have some error")
// } else {
//     res.send("something wrong")
// }


// Amount = parseInt(Amount)
// Idshop = parseInt(Idshop)
// Idorder = parseInt(Idorder)
// if (isNaN(Amount) !== true && isNaN(Idshop) !== true && isNaN(Idorder) !== true) {
//     // i must to this function again
//     // this function will use
//     const [shop] = await dbsync.execute("SELECT * FROM profileshop WHERE Id_shop=?", [Idshop])
//     if (shop.length === 1) {
//         const [pp] = await pp
//     } else {
//         return "something wrong"
//     }
// } else {
//     return "your value int is null"
// }