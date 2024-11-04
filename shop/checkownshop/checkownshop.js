const dbsync = require('D:/react_project/ppap/config/datasync')

const checkownshop = async (req, res) => {
  try {
    let Id_user = req.body.Id_user
    let Id_shop = req.body.Id_shop
    if (Id_user !== undefined && Id_shop !== undefined) {
        Id_usr = parseInt(Id_user)
        Id_shop = parseInt(Id_shop)
        if (isNaN(Id_usr) !== true && isNaN(Id_shop) !== true){
            const [ShopData] = await dbsync.execute("SELECT * FROM profileshop WHERE Id_shop=?",[Id_shop])
            if (ShopData.length ===1){
                const [UserData] = await dbsync.execute("SELECT * FROM users WHERE Id_usr=?",[Id_user])
                if (UserData.length === 1){
                    // time to check own shop
                    if (UserData[0].UserName_usr == ShopData[0].UserName_shop){
                        res.send("this user is own this shop ")
                    }else{
                        res.send("this user isn't own this shop")
                    }
                }else if (UserData.length === 0){
                    res.send("this user don't have in data")
                }else{
                    res.send("something wrong")
                }
            }else if (ShopData.length === 0){
                res.send("this shop don't have in data")
            }else{
                res.send("something wrong")
            }
        }else{
            res.send("your value int is null")
        }
    } else {
      res.send()
    }
  } catch (err) {
    if (err) {
      console.log(err)
      res.send('have some error')
    }
  }
}

module.exports = {checkownshop}

// new comemnt in softrock : your value int is not a number 
