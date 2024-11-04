const dbsync = require("D:/react_project/ppap/config/datasync")
const { distance } = require("D:/react_project/ppap/public/search/search")

const searchstarshop = async (req, res) => {
    try {
        let Lat = req.body.Lat
        let Long = req.body.Long
        if (Lat !== undefined && Long !== undefined) {
            Lat = parseInt(Lat)
            Long = parseInt(Long)
            if (isNaN(Lat) !== true && isNaN(Long) !== true) {
                const [findshop] = await dbsync.execute("SELECT Name_shop,Id_shop,Profle_shop,Latitude_shop,Longitude_shop,Status_shop FROM profileshop WHERE Status_shop!=0")
                if (findshop.length > 0) {
                    for (let i = 0; findshop.length > i; i++) {
                        const [findstarfromuser] = await dbsync.execute("SELECT * FROM star_shop WHERE Id_shop_Star=?", [findshop[i].Id_shop])
                        // console.log(findstarfromuser.length)s
                        if (findstarfromuser.length > 0) {
                            let Starshop = 0
                            for (let o = 0; findstarfromuser.length > o; o++) {
                                Starshop += findstarfromuser[o].Star_taste_Star
                                if (findstarfromuser.length - 1 === o) {
                                    const getdistance = distance(Lat, Long, findshop[i].Latitude_shop, findshop[i].Longitude_shop)
                                    findshop[i].Distance = getdistance
                                    Starshop /= findstarfromuser.length
                                    findshop[i].Star = Starshop
                                    findshop[i].Status = findshop[i].Status_shop
                                }
                                if (findstarfromuser.length - 1 === o && findshop.length - 1 === i) {
                                    res.json(findshop.sort((a, b) => b.Star - a.Star))
                                }
                            }
                        } else {
                            const getdistance = distance(Lat, Long, findshop[i].Latitude_shop, findshop[i].Longitude_shop)
                            findshop[i].Distance = getdistance
                            findshop[i].Star = 0
                            findshop[i].Status = findshop[i].Status_shop
                            if (findshop.length - 1 === i) {
                                res.json(findshop.sort((a, b) => b.Star - a.Star))
                            }
                        }
                    }
                } else if (findshop.length === 0) {
                    res.send("shop don't have in data yet")
                } else {
                    res.send("something wrong")
                }
            } else {
                res.send("your value int is null")
            }
        } else {
            res.send("")
        }
    } catch (err) {
        console.log(err)
        res.send("have some error")
    }

}

module.exports = { searchstarshop }