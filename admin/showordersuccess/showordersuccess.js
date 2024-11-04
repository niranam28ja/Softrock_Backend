const dbsync = require("D:/react_project/ppap/config/datasync")


const showordersuccess = async (req, res) => {
    try {
        let Datestart = req.body.Datestart
        let Datestop = req.body.Datestop
        let Idshop = req.body.Idshop
        if (Datestart !== undefined && Datestop !== undefined && Idshop !== undefined) {
            const datestart = new Date(Datestart)
            const datestop = new Date(Datestop)
            Idshop = parseInt(Idshop)
            if (isNaN(datestart) !== true) {
                if (isNaN(datestop) !== true) {
                    if (isNaN(Idshop) !== true) {
                        const formatdatestart = `${datestart.getFullYear()}-${datestart.getMonth() + 1}-${datestart.getDate()} ${datestart.getHours()}:${datestart.getMinutes()}:${datestart.getSeconds()}`
                        const formatdatestop = `${datestop.getFullYear()}-${datestop.getMonth() + 1}-${datestop.getDate()} ${datestop.getHours()}:${datestop.getMinutes()}:${datestop.getSeconds()}`
                        if (Idshop === 0) {
                            const [showallorder] = await dbsync.execute("SELECT * FROM paysuccess WHERE Status_paysuccess=? AND Date_paysuccess BETWEEN ? AND ? ORDER BY Date_paysuccess ASC", [3,formatdatestart, formatdatestop])
                            if(showallorder.length > 0){
                                res.json(showallorder)
                            }else {
                                res.send("in this date don't have any order in data")
                            }
                        } else if (Idshop > 0) {
                            const [showorder] = await dbsync.execute("SELECT * FROM paysuccess WHERE Id_shop_paysucess=? AND Status_paysuccess=? AND Date_paysuccess BETWEEN ? AND ? ORDER BY Date_paysuccess ASC", [Idshop,3,formatdatestart, formatdatestop])
                            if (showorder.length > 0){
                                res.json(showorder)
                            }else{
                                res.send("in this date don't have any order in data")
                            }
                        } else {
                            res.send("something wrong")
                        }
                    } else {
                        res.send("your value int is null")
                    }
                } else {
                    res.send("your Datestop invalid")
                }
            } else {
                res.send("your Datestart invalid")
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


module.exports = {showordersuccess}