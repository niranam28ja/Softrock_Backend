const { jar } = require("request")
const dbsync = require("D:/react_project/ppap/config/datasync")



const showadvertising = async (req, res) => {
    try {
        const Province = req.body.Province
        // const District = req.body.District
        // const Subdistrict = req.body.Subdistrict
        let Iduser = req.body.Iduser
        const Token = req.body.Token
        const typesend = "home page"
        if (Province !== undefined && Token !== undefined && Iduser !== undefined) {
            Iduser = parseInt(Iduser)
            if (isNaN(Iduser) !== true) {
                const [finduser] = await dbsync.execute("SELECT * FROM users WHERE Id_usr=?", [Iduser])
                if (finduser.length === 1) {
                    const [findadsByProvince] = await dbsync.execute("SELECT Id_ads,Province_ads,Pic_ads,Balance_ads,Discount_perseen_ads,Seen_ads,Id_shop_ads FROM advertising WHERE Province_ads=? AND Status_ads=1 AND Typesend_ads=? ORDER BY Discount_perseen_ads ASC", [Province, typesend])
                    //Id_shop_ads
                    if (findadsByProvince.length > 0) {
                        let valueads = []
                        for (let i = 0; findadsByProvince.length > i; i++) {
                            const [findNameAndIdshop] = await dbsync.execute("SELECT Name_shop,Id_shop,Status_shop FROM profileshop WHERE Id_shop=? AND Status_shop!=0", [findadsByProvince[i].Id_shop_ads])
                            if (findNameAndIdshop.length === 1) {
                                for (let i = 0; findadsByProvince.length > i; i++) {
                                    if (valueads.length >= 20 && i - 1 === 20) {
                                        res.json(valueads)
                                        break
                                    } else {
                                        let seen = findadsByProvince[i].Seen_ads
                                        let balance = findadsByProvince[i].Balance_ads
                                        seen += 1
                                        balance -= findadsByProvince[i].Discount_perseen_ads
                                        // Balance_ads=? and balance discount if users click 1 time
                                        await dbsync.execute("UPDATE advertising SET Seen_ads=?  WHERE Id_ads=?", [seen, findadsByProvince[i].Id_ads])
                                        valueads.push({ Province: findads[i].Province_ads, Pic: findads[i].Pic_ads, Id_shop: findadsByProvince[i].Id_shop_ads,Nameshop:findNameAndIdshop[0].Name_shop })
                                        if (findadsByProvince.length - 1 === i) {
                                            res.json(valueads)
                                        }
                                    }
                                }
                            } else {
                                if (i - 1 == 20) {
                                    res.json(valueads)
                                }
                            }
                        }
                    } else if (findadsByProvince.length === 0) {
                        const [findads] = await dbsync.execute("SELECT Id_ads,Province_ads,Pic_ads,Balance_ads,Discount_perseen_ads,Seen_ads,Id_shop_ads FROM advertising WHERE Status_ads=1 AND Typesend_ads=? ORDER BY Discount_perseen_ads ASC", [typesend])
                        if (findads.length > 0) {
                            let valueads = []
                            for (let i = 0; findads.length > i; i++) {
                                const [findNameAndIdshop] = await dbsync.execute("SELECT Name_shop,Id_shop FROM profileshop WHERE Id_shop=?", [findads[i].Id_shop_ads])
                                if (findNameAndIdshop.length === 1) {
                                    for (let i = 0; findads.length > i; i++) {
                                        if (valueads.length >= 20 && i - 1 === 20) {
                                            res.json(valueads)
                                            break
                                        } else {
                                            let seen = findads[i].Seen_ads
                                            let balance = findads[i].Balance_ads
                                            seen += 1
                                            balance -= findads[i].Discount_perseen_ads
                                            // Balance_ads=? and balance discount if users click 1 time
                                            await dbsync.execute("UPDATE advertising SET Seen_ads=?  WHERE Id_ads=?", [seen, findads[i].Id_ads])
                                            // console.log("eee")
                                            valueads.push({ Province: findads[i].Province_ads, Pic: findads[i].Pic_ads, Id_shop: findads[i].Id_shop_ads,Nameshop:findNameAndIdshop[0].Name_shop })
                                            if (findads.length - 1 === i) {
                                                res.json(valueads)
                                            }
                                        }
                                    }
                                } else {
                                    if (i - 1 == 20) {
                                        res.json(valueads)
                                    }
                                }
                            }
                        } else if (findads.length === 0) {
                            res.send("don't have advertising yet")
                        } else {
                            res.send("something wrong")
                        }
                    } else {
                        res.send("something wrong")
                    }
                } else if (finduser.length === 0) {
                    res.send("this user don't have in data")
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

const discountBalance = async (req, res) => {
    try {
        let Iduser = req.body.Iduser
        const Token = req.body.Token
        let Idads = req.body.Idads
        if (Iduser !== undefined && Token !== undefined && Idads !== undefined) {
            Iduser = parseInt(Iduser)
            Idads = parseInt(Idads)
            if (isNaN(Iduser) !== true && isNaN(Idads) !== true) {
                const [user] = await dbsync.execute("SELECT Id_usr FROM users WHERE Id_usr=? AND Gen_usr=?", [Iduser, Token])
                if (user.length === 1) {
                    const [advertising] = await dbsync.execute("SELECT Id_ads,Balance_ads FROM advertising WHERE Id_ads=?", [Idads])
                    if (advertising.length === 1) {
                        if (advertising[0].Balance_ads >= 0.5) {
                            const minusBalance = advertising[0].Balance_ads - 0.5
                            await dbsync.execute("UPDATE advertising SET Balance_ads=? WHERE Id_ads=?", [minusBalance, Idads])
                            res.send("discount success")
                        } else {
                            res.send("this advertising don't have enough total in data")
                        }
                    } else if (advertising.length === 0) {
                        res.send("this advertising don't have in data")
                    } else {
                        res.send("something wrong")
                    }
                } else if (user.length === 0) {
                    res.send("this user don't have in data")
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



module.exports = { showadvertising, discountBalance }

