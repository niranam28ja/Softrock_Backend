const { user } = require('../../config/config')
const dbsync = require('D:/react_project/ppap/config/datasync')

// sum partner total
// sum shop total
// sum payment total = 3.25
// sum we have
const showorderdetail = async (req, res) => {
  try {
    let Id_admin = req.body.Id_admin
    const Token = req.body.Token
    const Datestart = req.body.Datestart
    const Datestop = req.body.Datestop
    if (
      Id_admin !== undefined &&
      Token !== undefined &&
      Datestart !== undefined &&
      Datestop !== undefined
    ) {
      Id_admin = parseInt(Id_admin)
      if (isNaN(Id_admin) !== true) {
        const datestart = new Date(Datestart)
        const datestop = new Date(Datestop)
        if (isNaN(datestart.getFullYear()) !== true) {
          if (isNaN(datestop.getFullYear()) !== true) {
            const [checkuser] = await dbsync.execute(
              'SELECT * FROM users WHERE Id_usr=? AND Gen_usr=? AND Status_usr=9',
              [Id_admin, Token]
            )
            if (checkuser.length === 1) {
              let Values = []
              const [Order] = await dbsync.execute(
                'SELECT * FROM paysuccess WHERE Status_paysuccess!=0 AND Status_paysuccess!=1 AND Date_paysuccess BETWEEN ? AND ?',
                [
                  datestart
                    .toISOString()
                    .slice(0, 19)
                    .replace('T', ' '),
                  datestop
                    .toISOString()
                    .slice(0, 19)
                    .replace('T', ' ')
                ]
              )
              if (Order.length > 0) {
                for (let i = 0; Order.length > i; i++) {
                  let SumShop = 0
                  let SumPartner = 0
                  let SumDiscount = 0
                  let Total = 0
                  let DateORder = Order[i].Date_paysuccess
                  const [User] = await dbsync.execute(
                    'SELECT * FROM users WHERE Id_usr=?',
                    [Order[i].Id_usr_paysuccess]
                  )
                  const [Shop] = await dbsync.execute(
                    'SELECT * FROM profileshop WHERE Id_shop=?',
                    [Order[i].Id_shop_paysucess]
                  )
                    if (User.length === 1 && Shop.length === 1) {
                      const [Partner] = await dbsync.execute(
                        'SELECT * FROM partner WHERE Id_usr_partner=?',
                        [Shop[0].Id_partner_shop]
                      )
                        SumShop =
                      (Order[i].Pricetotal_paysuccess +
                        Order[i].Star_use_paysuccess) *
                      (90 / 100)
                    Total =
                      (Order[i].Pricetotal_paysuccess +
                        Order[i].Star_use_paysuccess) *
                        (10 / 100) -
                      3.25 / 100
                    SumDiscount = SumShop + SumPartner
                    const [Star_log] = await dbsync.execute(
                      'SELECT * FROM star_log WHERE Id_order_starlog=?',
                      [Order[i].Id_order_paysuccess]
                    )
                    if (Star_log.length === 1) {
                      if (Partner.length === 1) {
                        SumPartner =
                          Order[i].Pricetotal_paysuccess * (1.0 / 100)
                        Values.push({
                          Id_order: Order[i].Id_order_paysuccess,
                          total_order: Order[i].Pricetotal_paysuccess,
                          Name_user: User[0].UserName_usr,
                          Name_shop: Shop[0].Name_shop,
                          use_Star: Order[i].Star_use_paysuccess,
                          partner: Partner[0].UserName_usr_partner,
                          Share_Percentage_partner: 1.0, //
                          Partner_Profit: SumPartner,
                          Shop_profit: SumShop,
                          Give_Star: Star_log[0].Amount_starlog,
                          CreateDate: DateORder.toISOString().slice(0, 19).replace('T', ' '),
                          Discount: SumDiscount,
                          Total: Number(Total.toFixed(2))
                        })
                        if (Order.length - 1 === i) {
                          if (Values.length > 0){
                            const sendSumvalues = await addsumvalues(Values,Order)
                            res.json(sendSumvalues)
                          }else{
                            res.json(Values)
                          }
                        }
                      } else if (Partner.length === 0) {
                        Values.push({
                          Id_order: Order[i].Id_order_paysuccess,
                          total_order: Order[i].Pricetotal_paysuccess,
                          Name_user: User[0].UserName_usr,
                          Name_shop: Shop[0].Name_shop,
                          use_Star: Order[i].Star_use_paysuccess,
                          partner: "this shop don't have partner",
                          Share_Percentage_partner: 1.0, //
                          Partner_Profit: 0,
                          Shop_profit: SumShop,
                          Give_Star: Star_log[0].Amount_starlog,
                          CreateDate:  DateORder.toISOString().slice(0, 19).replace('T', ' '),
                          Discount: SumDiscount,
                          Total: Number(Total.toFixed(2))
                        })
                        if (Order.length - 1 === i) {
                          if (Values.length > 0){
                            const sendSumvalues = await addsumvalues(Values,Order)
                            res.json(sendSumvalues)
                          }else{
                            res.json(Values)
                          }
                        }
                      } else {
                        if (Order.length - 1 === i) {
                          if (Values.length > 0){
                            const sendSumvalues = await addsumvalues(Values,Order)
                            res.json(sendSumvalues)
                          }else{
                            res.json(Values)
                          }
                        }
                      }
                    } else if (Star_log.length === 0) {
                      if (Partner.length === 1) {
                        SumPartner =
                          Order[i].Pricetotal_paysuccess * (1.0 / 100)
                        Values.push({
                          Id_order: Order[i].Id_order_paysuccess,
                          total_order: Order[i].Pricetotal_paysuccess,
                          Name_user: User[0].UserName_usr,
                          Name_shop: Shop[0].Name_shop,
                          use_Star: Order[i].Star_use_paysuccess,
                          partner: partner[0].UserName_usr_partner,
                          Share_Percentage_partner: 1.0, //
                          Partner_Profit: SumPartner,
                          Shop_profit: SumShop,
                          Give_Star: 0,
                          CreateDate:  DateORder.toISOString().slice(0, 19).replace('T', ' '),
                          Discount: SumDiscount,
                          Total: Number(Total.toFixed(2))
                        })
                        if (Order.length - 1 === i) {
                          if (Values.length > 0){
                            const sendSumvalues = await addsumvalues(Values,Order)
                            res.json(sendSumvalues)
                          }else{
                            res.json(Values)
                          }
                        }
                      } else if (Partner.length === 0) {
                        Values.push({
                          Id_order: Order[i].Id_order_paysuccess,
                          total_order: Order[i].Pricetotal_paysuccess,
                          Name_user: User[0].UserName_usr,
                          Name_shop: Shop[0].Name_shop,
                          use_Star: Order[i].Star_use_paysuccess,
                          partner: "this shop don't have partner",
                          Share_Percentage_partner: 1.0, //
                          Partner_Profit: 0,
                          Shop_profit: SumShop,
                          Give_Star: 0,
                          CreateDate:  DateORder.toISOString().slice(0, 19).replace('T', ' '),
                          Discount: SumDiscount,
                          Total: Number(Total.toFixed(2))
                        })
                        if (Order.length - 1 === i) {
                          if (Values.length > 0){
                            const sendSumvalues = await addsumvalues(Values,Order)
                            res.json(sendSumvalues)
                          }else{
                            res.json(Values)
                          }
                        }
                      } else {
                        if (Order.length - 1 === i) {
                          if (Values.length > 0){
                            const sendSumvalues = await addsumvalues(Values,Order)
                            res.json(sendSumvalues)
                          }else{
                            res.json(Values)
                          }
                        }
                      }
                    } else {
                      if (Order.length - 1 === i) {
                        if (Values.length > 0){
                          const sendSumvalues = await addsumvalues(Values,Order)
                          res.json(sendSumvalues)
                        }else{
                          res.json(Values)
                        }
                      }
                    }
                      
                  } else {
                    if (Order.length - 1 === i) {
                      if (Values.length > 0){
                        const sendSumvalues = await addsumvalues(Values,Order)
                        res.json(sendSumvalues)
                      }else{
                        res.json(Values)
                      }
                    }
                  }            
                }
              } else if (Order.length <= 0) {
                res.send("don't have order yet")
              }
            } else if (checkuser.length === 0) {
              res.send("this admin user don't have in data")
            } else {
              res.send('something wrong')
            }
          } else {
            res.send('something wrong with your Datestop')
          }
        } else {
          res.send('something wrong with your Datestart')
        }
      } else {
        res.send('your value int is null')
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

const addsumvalues = async (arr,Order) => {
  try {
    let SumTotalOrder = await calculateSum(arr, 'total_order')
    let SumTotalPartner = await calculateSum(arr, 'Partner_Profit')
    let SumTotalchillpay = 3.25 * Order.length
    let SumStaruse = await calculateSum(arr, 'use_Star')
    let SumGiveStar = await calculateSum(arr, 'Give_Star')
    let SumTotalDiscount = await calculateSum(arr, 'Discount')
    let SumTotalWehave = await calculateSum(arr, 'Total')
    let SumTotal  = Number(SumTotalWehave.toFixed(2))
    arr.push({SumTotalOrder})
    arr.push({SumTotalPartner})
    arr.push({SumTotalchillpay})
    arr.push({SumStaruse})
    arr.push({SumGiveStar})
    arr.push({SumTotalDiscount})
    arr.push({SumTotal})
    return arr
  } catch (err) {
    if (err) {
      console.log(err)
      return "have some error"
    }
    
  }
}

const calculateSum = async (array, property) => {
  const total = array.reduce((accumulator, object) => {
    return accumulator + object[property]
  }, 0)

  return total
}
module.exports = { showorderdetail }

// const [findpartner] = await dbsync.execute("SELECT * FROM partner WHERE Id_usr_partner=?", [showorder[i].Id_partner_shop])
