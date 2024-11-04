const dbsync = require("D:/react_project/ppap/config/datasync")
const { distance } = require("D:/react_project/ppap/public/search/search")

const searchhitshop = async (req, res) => {
    try {
        let Lat = req.body.Lat
        let Long = req.body.Long
        if (Lat !== undefined && Long !== undefined) {
            Lat = parseInt(Lat)
            Long = parseInt(Long)
            if (isNaN(Lat) !== true && isNaN(Long) !== true) {
                const [findmenuhit] = await dbsync.execute("SELECT Id_shop_addor FROM addorder WHERE Status_addor=4")
                if (findmenuhit.length > 0) {
                    findmenuhit.forEach(obj => {
                        obj.Count = 0
                    })
                    const sum = findmenuhit.reduce((acc, cur) => {
                        const found = acc.find(val => val.Id_shop_addor === cur.Id_shop_addor)
                        if (found) {
                            found.Count += 1
                        }
                        else {
                            acc.push({ ...cur, Count: Number(cur.Count) })
                        }
                        return acc
                    }, [])
                    for (let i = 0; sum.length > i; i++) {
                        const [findpicshop] = await dbsync.execute("SELECT Name_shop,Profle_shop,Latitude_shop,Longitude_shop,Status_shop FROM profileshop WHERE Id_shop=? AND Status_shop!=0", [sum[i].Id_shop_addor])
                        if (findpicshop.length === 1) {
                            const getdistance = distance(Lat, Long, Number(findpicshop[0].Latitude_shop), Number(findpicshop[0].Longitude_shop))
                            // console.log(Number(findpicshop[0].Latitude_shop))
                            sum[i].Name_shop = findpicshop[0].Name_shop
                            sum[i].Distance = getdistance
                            sum[i].Pic = findpicshop[0].Profle_shop
                            sum[i].Status = findpicshop[0].Status_shop
                            if (sum.length - 1 === i) {
                                res.json(sum.sort((a, b) => b.Count - a.Count))
                            }
                        } else {
                            if (sum.length - 1 === i) {
                                res.json(sum.sort((a, b) => b.Count - a.Count))
                            }
                        }
                    }
                } else if (findmenuhit.length === 0) {
                    res.send("don't have shop done yet")
                } else {
                    res.send("something wrong")
                }
            } else {
                res.send("your value int is null")
            }
        } else {
            res.send
        }
    } catch (err) {
        if (err) {
            console.log(err)
            res.send("have some error")
        }
    }
}

const searchhitmenu = async (req, res) => {
    try {
        let Lat = req.body.Lat
        let Long = req.body.Long
        if (Lat !== undefined && Long !== undefined) {
            Lat = parseInt(Lat)
            Long = parseInt(Long)
            if (isNaN(Lat) !== true && isNaN(Long) !== true) {
                const [findmenuhit] = await dbsync.execute("SELECT Id_menu_addor,Name_menu_addor FROM addorder WHERE Status_addor=4")
                if (findmenuhit.length > 0) {
                    findmenuhit.forEach(obj => {
                        obj.Count = 0
                    })
                    const sum = findmenuhit.reduce((acc, cur) => {
                        const found = acc.find(val => val.Name_menu_addor === cur.Name_menu_addor)
                        if (found) {
                            found.Count += 1
                        }
                        else {
                            acc.push({ ...cur, Count: Number(cur.Count) })
                        }
                        return acc
                    }, [])
                    for (let i = 0; sum.length > i; i++) {
                        const [findpicmenu] = await dbsync.execute("SELECT Id_shop_menu,Pic_menu,Price_menu,Status_menu FROM addmenu WHERE Name_menu=?", [sum[i].Name_menu_addor])
                        if (findpicmenu.length === 1) {
                            const [finddetailshop] = await dbsync.execute("SELECT Id_shop,Name_shop,Latitude_shop,Longitude_shop FROM profileshop WHERE Id_shop=? AND Status_shop!=0",[findpicmenu[0].Id_shop_menu])
                            sum[i].Price = findpicmenu[0].Price_menu
                            sum[i].Distance = null
                            sum[i].Pic = findpicmenu[0].Pic_menu
                            sum[i].Status = findpicmenu[0].Status_menu
                            if (finddetailshop.length === 1){
                                sum[i].NameShop = finddetailshop[0].Name_shop
                                sum[i].IdShop = finddetailshop[0].Id_shop
                                const getdistance = distance(Lat, Long, finddetailshop[0].Latitude_shop, finddetailshop[0].Longitude_shop)
                                sum[i].Distance = getdistance
                            }
                            if (sum.length - 1 === i) {
                                res.json(sum.sort((a, b) => b.Count - a.Count))
                            }
                        } else {
                            if (sum.length - 1 === i) {
                                res.json(sum.sort((a, b) => b.Count - a.Count))
                            }
                        }
                    }
                } else if (findmenuhit.length === 0) {
                    res.send("don't have order done yet")
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

module.exports = { searchhitshop, searchhitmenu }