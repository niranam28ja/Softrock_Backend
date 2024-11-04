const { login } = require("../../users/login/Login")
const { getdis } = require("../getprovinces/getprovince")
const dbsync = require("D:/react_project/ppap/config/datasync")


const searchmenu = async (req, res) => {
    try {
        const Username = req.body.Username
        const Gen = req.body.Gen
        const findfood = req.body.findfood
        const Province = req.body.Province
        let lat1 = req.body.Lat
        let long1 = req.body.Long
        if (Username !== undefined && Gen !== undefined && findfood !== undefined && Province !== undefined && lat1 !== undefined && long1 !== undefined) {
            lat1 = parseFloat(lat1)
            long1 = parseFloat(long1)
            if (isNaN(lat1) !== true && isNaN(long1) !== true) {
                const [checkusers] = await dbsync.execute("SELECT Id_usr,Gen_usr FROM users WHERE UserName_usr=? AND Gen_usr=?", [Username, Gen])
                // console.log(checkusers)
                if (checkusers.length == 1) {
                    if (checkusers[0].Gen_usr != 0) {
                        if (Province === "ใกล้ฉัน") {
                            const [values] = await dbsync.execute(`SELECT * FROM addmenu WHERE Name_menu LIKE '%${findfood}%' AND Status_menu!=0`)
                            let valuefood = []
                            if (values.length >= 1) {
                                for (let i = 0; i < values.length; i++) {
                                    const [valuesshop] = await dbsync.execute("SELECT Id_shop,Province_shop,Latitude_shop,Longitude_shop FROM profileshop WHERE Id_shop=? AND Status_shop=1", [values[i].Id_shop_menu])
                                    if (valuesshop.length == 0) {

                                    } else if (valuesshop.length == 1) {
                                        let lat2 = parseFloat(valuesshop[0].Latitude_shop)
                                        let long2 = parseFloat(valuesshop[0].Longitude_shop)
                                        if (isNaN(lat2) !== true && isNaN(long2) !== true) {
                                            const getdistance = distance(lat1, long1, lat2, long2)
                                            valuefood.push({ valuefood: values[i], valueshop: valuesshop[0], distance: getdistance })
                                        } else {

                                        }
                                    }
                                    if (i == values.length - 1) {
                                        const newvalue = valuefood.sort((a, b) => {
                                            return a.distance - b.distance
                                        })
                                        res.send(newvalue)
                                        // res.send(valuefood)
                                    }
                                }
                            } else {
                                res.send(values)
                            }
                        } else {
                            const [values] = await dbsync.execute(`SELECT * FROM addmenu WHERE Name_menu LIKE '%${findfood}%' AND Status_menu=1`)
                            let valuefood = []
                            if (values.length >= 1) {
                                for (let i = 0; i < values.length; i++) {
                                    const [valuesshop] = await dbsync.execute("SELECT Id_shop,Province_shop,Latitude_shop,Longitude_shop FROM profileshop WHERE Id_shop=? AND Status_shop=1", [values[i].Id_shop_menu])
                                    if (valuesshop.length == 0) {

                                    } else if (valuesshop[0].Province_shop === Province) {
                                        let lat2 = parseFloat(valuesshop[0].Latitude_shop)
                                        let long2 = parseFloat(valuesshop[0].Longitude_shop)

                                        if (isNaN(lat2) !== true && isNaN(long2) !== true) {
                                            const getdistance = distance(lat1, long1, lat2, long2)
                                            valuefood.push({ valuefood: values[i], valueshop: valuesshop[0], distance: getdistance })
                                        } else {

                                        }
                                    }
                                    if (i == values.length - 1) {
                                        const newvalue = valuefood.sort((a, b) => {
                                            return a.distance - b.distance
                                        })
                                        res.send(newvalue)
                                    }
                                }
                            } else {
                                res.send(values)
                            }
                        }
                    } else {
                        res.send("you don't have login")
                    }
                } else if (checkusers.length >= 2) {
                    res.send("something wrong")
                } else {
                    res.send("you don't have values in data")
                }
            } else {
                res.send("your values int is null")
            }
        } else {
            res.send("")
        }
    } catch (err) {
        if (err) throw err
    }

}

const searchshop = async (req, res) => {
    try {
        const Username = req.body.Username
        const Gen = req.body.Gen
        const findshop = req.body.findshop
        const Province = req.body.Province
        let lat1 = req.body.Lat
        let long1 = req.body.Long
        if (Username !== undefined && Gen !== undefined && findshop !== undefined && Province !== undefined && lat1 !== undefined && long1 !== undefined) {
            lat1 = parseFloat(lat1)
            long1 = parseFloat(long1)
            if (isNaN(lat1) !== true && isNaN(long1) !== true) {
                const [checkusers] = await dbsync.execute("SELECT Id_usr,Gen_usr FROM users WHERE UserName_usr=? AND Gen_usr=?", [Username, Gen])
                // console.log(checkusers)
                if (checkusers.length == 1) {
                    if (checkusers[0].Gen_usr != 0) {
                        if (Province === "ใกล้ฉัน") {
                            const [values] = await dbsync.execute(`SELECT Id_shop,Name_shop,Profle_shop,Latitude_shop,Longitude_shop,Status_shop FROM profileshop WHERE Name_shop LIKE '%${findshop}%' AND Status_shop!=0 AND Status_shop!=2`)
                            // console.log(values.length)
                            const valuefood = []
                            for (let i = 0; i < values.length; i++) {
                                let lat2 = parseFloat(values[i].Latitude_shop)
                                let long2 = parseFloat(values[i].Longitude_shop)
                                if (isNaN(lat2) !== true && isNaN(long2) !== undefined) {
                                    const getdistance = distance(lat1, long1, lat2, long2)
                                    valuefood.push({ valueshop: values[i], distance: getdistance })
                                } else {

                                }
                                if (i == values.length - 1) {
                                    const newvalue = valuefood.sort((a, b) => {
                                        return a.distance - b.distance
                                    })
                                    newvalue.sort(function (a, b) {
                                        if (a.Status_shop > b.Status_shop) return 1;
                                        if (a.Status_shop < b.Status_shop) return -1;
                                        return 0;
                                    })
                                    res.send(newvalue)
                                }
                            }

                        } else {
                            const [values] = await dbsync.execute(`SELECT Id_shop,Name_shop,Profle_shop,Latitude_shop,Longitude_shop,Status_shop FROM profileshop WHERE Name_shop LIKE '%${findshop}%' AND Province_shop=? AND Status_shop!=0`, [Province])
                            const valuefood = []
                            for (let i = 0; i < values.length; i++) {
                                let lat2 = parseFloat(values[i].Latitude_shop)
                                let long2 = parseFloat(values[i].Longitude_shop)
                                if (isNaN(lat2) !== true && isNaN(long2) !== undefined) {
                                    const getdistance = distance(lat1, long1, lat2, long2)
                                    valuefood.push({ valueshop: values[i], distance: getdistance })
                                } else {

                                }
                                if (i == values.length - 1) {
                                    const newvalue = valuefood.sort((a, b) => {
                                        return a.distance - b.distance
                                    })
                                    newvalue.sort(function (a, b) {
                                        if (a.Status_shop > b.Status_shop) return 1;
                                        if (a.Status_shop < b.Status_shop) return -1;
                                        return 0;
                                    })
                                    res.send(newvalue)
                                }
                            }
                        }
                    } else {
                        res.send("you don't have login")
                    }
                } else if (checkusers.length >= 2) {
                    res.send("something wrong")
                } else {
                    // console.log(Username)
                    // console.log(Gen)
                    res.send("you don't have values in data")
                }
            } else {
                res.send("your values int is null")
            }
        } else {
            res.send("")
        }
    } catch (err) {
        if (err) throw err
    }
}


const distance = (lat1, long1, lat2, long2) => {

    long1 = long1 * Math.PI / 180;
    long2 = long2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula
    let dlon = long2 - long1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
        + Math.cos(lat1) * Math.cos(lat2)
        * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));


    let r = 6371//KM

    // calculate the result
    return (c * r).toFixed(2);

}

module.exports = { searchmenu, searchshop, distance }



