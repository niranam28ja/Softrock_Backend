const dbsync = require("D:/react_project/ppap/config/datasync")


const regispartner = async (req, res) => {
    try {
        const Username = req.body.Username
        const Name = req.body.Name
        const Lastname = req.body.Lastname
        const Gender = req.body.Gender
        const Birthdate = req.body.Birthdate
        const PicPayment = req.body.Picpayment
        const IdPayment = req.body.Idpayment
        const Address = req.body.Address
        const Province = req.body.Province
        const District = req.body.District
        const Subdistrict = req.body.Subdistrict
        const PicIdcard = req.body.PicIdcard
        let Latitude = req.body.Latitude
        let Longitude = req.body.Longitude
        const NameDevice = req.body.NameDevice
        const Model = req.body.Model
        const OsDevice = req.body.OsDevice
        let PhoneNumber = req.body.PhoneNumber
        if (Username !== undefined && Name !== undefined && Lastname !== undefined && Gender !== undefined && Birthdate !== undefined && PicPayment !== undefined && IdPayment !== undefined && Address !== undefined && Province !== undefined && District !== undefined && Subdistrict !== undefined && PicIdcard !== undefined && Latitude !== undefined && Longitude !== undefined && NameDevice !== undefined && Model !== undefined && OsDevice !== undefined && PhoneNumber !== undefined) {
                const [finduser] = await dbsync.execute("SELECT * FROM users WHERE UserName_usr=?", [Username])
            if (finduser.length == 1) {
                const [findpartner] = await dbsync.execute("SELECT Id_partner FROM partner WHERE UserName_usr_partner=? ", [Username])
                if (findpartner.length == 0) {
                    Latitude = parseInt(Latitude)
                    Longitude = parseInt(Longitude)
                    PhoneNumber = parseInt(PhoneNumber)
                    if (isNaN(Latitude) !== true && isNaN(Longitude) !== true && isNaN(PhoneNumber) !== true) {
                        // add 0 on PhoneNumber 
                        PhoneNumber = `${0}${PhoneNumber}`
                        const date = new Date(Birthdate)
                        if (date.getFullYear() !== null && date.getMonth() !== null && date.getDate() !== null && date.getHours() !== null && date.getMinutes() !== null && date.getSeconds() !== null) {
                            const [findlengthpartner] = await dbsync.execute("SELECT Id_partner FROM partner")
                            if (findlengthpartner.length <= 200) {
                                await dbsync.execute("INSERT INTO partner (Id_usr_partner,Pic_Payment_partner,Id_Payment_partner,UserName_usr_partner,Name_partner,Lastname_partner,Gender_partner,Birthday_partner,Address_partner,Province_partner,District_partner,Subdistrict_partner,Pic_idcard_partner,Latitude_partner,Longitude_partner,Name_device_partner,Model_device_partner,Os_device_partner,PhoneNumber_device_partner,Rank_partner,Status_partner) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [finduser[0].Id_usr, PicPayment, IdPayment, Username, Name, Lastname, Gender, Birthdate, Address, Province, District, Subdistrict, PicIdcard, Latitude, Longitude, NameDevice, Model, OsDevice, PhoneNumber, 2, 0])
                                res.status(200).send("success")
                            } else if (findlengthpartner.length > 200) {
                                await dbsync.execute("INSERT INTO partner (Id_usr_partner,Pic_Payment_partner,Id_Payment_partner,UserName_usr_partner,Name_partner,Lastname_partner,Gender_partner,Birthday_partner,Address_partner,Province_partner,District_partner,Subdistrict_partner,Pic_idcard_partner,Latitude_partner,Longitude_partner,Name_device_partner,Model_device_partner,Os_device_partner,PhoneNumber_device_partner,Rank_partner,Status_partner) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [finduser[0].Id_usr,  PicPayment, IdPayment, Username, Name, Lastname, Gender, Birthdate, Address, Province, District, Subdistrict, PicIdcard, Latitude, Longitude, NameDevice, Model, OsDevice, PhoneNumber, 1, 0])
                                res.status(200).send("success")
                            }
                        } else {
                            res.send("your date type wrong")
                        }
                    } else {
                        res.send("your value int is null")
                    }
                } else if (findpartner.length == 1) {




                    
                    res.send("this accout has been registered")
                }
            } else {
                res.send("you don't have user in data")
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

const showpartner = async(req,res) =>{
    try{
        const [CheckLenghtPartner] = await dbsync.execute("SELECT Id_partner FROM partner")
        res.json(CheckLenghtPartner.length)
    }catch(err){
        if (err){
            console.log(err)
            res.send("have some error")
        }
    }
}

module.exports = { regispartner,showpartner }



// const [insertpartner] = await  dbsync.execute("INSERT INTO partner (Id_usr_partner,UserName_usr_partner,Name_partner,Lastname_partner,Gender_partner,Birthday_partner,Address_partner,Province_partner,District_partner,Subdistrict_partner,Pic_idcard_partner,Latitude_partner,Longitude_partner,Name_device_partner,Model_device_partner,Os_device_partner,PhoneNumber_device_partner,Status_partner) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[finduser[0].Id_usr,Username,Name,Lastname,Gender,Birthdate,Address,Province,District,Subdistrict,PicIdcard,Latitude,Longitude,NameDevice,Model,OsDevice,PhoneNumber,0])
// res.status(200).send("success")

//  AND Name_partner=? AND Lastname_partner=?

// ,Name,Lastname