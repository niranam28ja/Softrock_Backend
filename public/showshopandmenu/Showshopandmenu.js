const dbsync = require("D:/react_project/ppap/config/datasync")
const  { searchmenu, searchshop, distance } = require("../search/search")


const shopprofile = async(req,res) =>{
    try{
        let Idshop = req.body.Idshop
        const Nameshop = req.body.Nameshop
        // console.log(Idshop)
        // console.log(Nameshop)
        if (Idshop !== undefined && Nameshop !== undefined){
            Idshop = parseInt(Idshop)
            if (isNaN(Idshop) !== true){
                const [showshop]  = await dbsync.execute("SELECT * FROM profileshop WHERE Id_shop=? AND Name_shop=? AND status_shop!=0 ",[Idshop,Nameshop])
                if (showshop.length == 1){
                    // const [showmenu] = await dbsync.execute("SELECT Id_menu,Name_menu,Price_menu,Time_menu,Category_menu FROM addmenu WHERE Id_shop_menu=?",[showshop[0].Id_shop])
                    // value.push({valueshop:showshop,valuemenu:showmenu})
                    res.send(showshop)
                }else if (showshop.length >= 2){
                    res.send("something wrong")
                }else{
                    res.send("your don't have value shop")
                }
            }else{
                res.send("your values int is null")
            }
        }else{
            res.send()
        }
    }catch(err){
        if (err) throw err
    }
    
}


const showcategory = async(req,res) =>{
    try{
        const Nameshop = req.body.Nameshop
        let Idshop = req.body.Idshop
        if (Nameshop !== undefined && Idshop !== undefined){
            Idshop  = parseInt(Idshop)
            if (isNaN(Idshop) !== true){
                const [showcategory] = await dbsync.execute("SELECT * FROM category WHERE Id_shop_cat=? AND Name_shop_cat=?",[Idshop,Nameshop])
                if (showcategory.length >=1){
                    res.send(showcategory)
                }else if (showcategory.length == 0){
                    // console.log("have some bug in file showshopandmenu")
                    res.send("0")
                }else{
                    res.send("something wrong")
                }
            }else{
                res.send("your values int is null")
            }
        }else{
            res.send()
        }
    }catch(err){
        if (err) throw err
    }
}


const showmenuUsecatfind = async(req,res) =>{
    try{
        let Idcategory = req.body.Idcategory
        let Idshop = req.body.Idshop
        if (Idcategory !== undefined && Idshop !== undefined){
            Idcategory = parseInt(Idcategory)
            Idshop = parseInt(Idshop)
            if (isNaN(Idcategory) !== true && isNaN(Idshop) !== true){
                const [showcat] = await dbsync.execute("SELECT * FROM category WHERE Id_cat=? AND Id_shop_cat=?",[Idcategory,Idshop])
                if (showcat.length  == 1){
                    const [showmenu] = await dbsync.execute("SELECT * FROM addmenu WHERE Category_menu=? AND Status_menu=1",[showcat[0].Name_cat])
                    if (showmenu.length >=1){
                        res.send(showmenu)
                    }else if (showmenu.length == 0){
                        const [deletemenu] = await dbsync.execute("DELETE FROM category WHERE Id_cat=? AND Id_shop_cat=?",[Idcategory,Idshop])
                        res.send("0")
                    }
                }else if (showcat.length == 0){
                    // console.log(Idcategory)
                    // console.log(Idshop)
                    res.send("don't have value")
                }else{
                    res.send("something wrong")
                }
            }else{
                res.send("your values int is null")
            }
        }else{
            res.send()
        }
    }catch(err){
        if (err) throw err
    }
}


const showcategoryandmenu = async(req,res) =>{
    try{
        const Nameshop = req.body.Nameshop
        let Idshop = req.body.Idshop
        if (Nameshop !== undefined && Idshop !== undefined){
            Idshop  = parseInt(Idshop)
            if (isNaN(Idshop) !== true){
                const [showcategory] = await dbsync.execute("SELECT * FROM category WHERE Id_shop_cat=? AND Name_shop_cat=?",[Idshop,Nameshop])
                if (showcategory.length >=1){
                    // res.send(showcategory)
                    let keepcat = []
                    let keepmneu = []
                    let allcatandmenu = []
                    for (let i =0;i < showcategory.length;i++){
                        keepcat.push({Idcategory:showcategory[i].Id_cat,Namecategory:showcategory[i].Name_cat})
                        const [showmenu] = await dbsync.execute("SELECT Id_menu,Pic_menu,Name_menu,Price_menu,Status_menu FROM addmenu WHERE Category_menu=? AND Name_shop_menu=? AND Status_menu!=0",[showcategory[i].Name_cat,Nameshop])
                        if (showmenu.length == 0 && i == showcategory.length -1){
                            keepcat = []
                            res.send(allcatandmenu)
                        }
                        if (showmenu.length == 0 &&  i < showcategory.length -1){
                            keepcat = []
                        }
                        for (let o=0;o < showmenu.length;o++){
                            keepmneu.push({Idmenu:showmenu[o].Id_menu,Picmenu:showmenu[o].Pic_menu,Namemenu:showmenu[o].Name_menu,Pricemenu:showmenu[o].Price_menu,Status_menu:showmenu[o].Status_menu})
                            if (o == showmenu.length -1){
                                allcatandmenu.push({showcategory:keepcat,showmenu:keepmneu})
                                keepcat = []
                                keepmneu = []
                            }
                            if (i == showcategory.length-1 && o == showmenu.length-1){
                                res.send(allcatandmenu)
                            }
                        }
                    }
                }else if (showcategory.length == 0){
                    // console.log(Idshop)
                    // console.log(Nameshop)
                    res.send("0")
                }else{
                    res.send("something wrong")
                }
            }else{
                res.send("your values int is null")
            }
        }else{
            res.send()
        }
    }catch(err){
        if (err) throw err
    }
}


// if log latgitude in colsole it's come from this function
const showshopandmenuandsuboption = async(req,res) =>{
    try{
        const Nameshop = req.body.Nameshop
        let Idshop = req.body.Idshop
        let Idmenu = req.body.Idmenu
        let Lat = req.body.Lat
        let Long = req.body.Long
      //  console.log(Idmenu)
        if (Nameshop !== undefined && Idshop !== undefined && Idmenu !== undefined && Lat !== undefined && Long !== undefined){
            Idshop  = parseInt(Idshop)
            Idmenu = parseInt(Idmenu)
            Lat = parseFloat(Lat)
            Long = parseFloat(Long)
            if (isNaN(Idshop) !== true && isNaN(Idmenu) !== true && isNaN(Lat) !== true && isNaN(Long) !== true){
                const [showshop] = await dbsync.execute("SELECT Id_shop,Name_shop,Latitude_shop,Longitude_shop,Tel_shop,District_shop,Amphur_shop FROM profileshop WHERE Id_shop=? AND Name_shop=?",[Idshop,Nameshop])
                if (showshop.length == 1){
                    const dist = distance(Lat,Long,showshop[0].Latitude_shop,showshop[0].Longitude_shop)
                    // res.send(showcategory)
                    // let keepcat = []
                    // let keepmneu = []
                    // let allcatandmenu = []
                    const [showmenu] = await dbsync.execute("SELECT Id_menu,Pic_menu,Name_menu,Price_menu,Time_menu FROM addmenu WHERE Id_menu=? AND Id_shop_menu=? AND Name_shop_menu=? AND Status_menu=1",[Idmenu,Idshop,Nameshop])
                    if (showmenu.length == 1){
                        const [showsub] = await dbsync.execute("SELECT Id_sub,Name_sub,Type_sub,Isoption_sub FROM menu_subject WHERE Id_menu_sub=? AND Status_sub=1",[showmenu[0].Id_menu])
                       
                        //  for( let i =0;i < showmenu.length;i++){
                        let keepsub = []
                        let valueshop = []
                        let keepoption = []
                        let allvalue = []
                        let showall = []
                        
                        valueshop.push({Idshop:showshop[0].Id_shop,Nameshop:showshop[0].Name_shop,Distance:dist,Telshop:showshop[0].Tel_shop,Districtshop:showshop[0].District_shop,Subdistrictshop:showshop[0].Amphur_shop})
                        if (showsub.length <=0){
                            // console.log("wfiej")
                            showall.push({valueshop:valueshop,valeuemenu:showmenu,valuesubjectandoption:allvalue})
                            res.json(showall)
                            // res.send("somethong wrong")
                        }
                        //  }
                        for (let i =0;i < showsub.length;i++){
                            keepsub.push({Idsub:showsub[i].Id_sub,Namesub:showsub[i].Name_sub,Typesub:showsub[i].Type_sub,Isoption:showsub[i].Isoption_sub})
                            // must to edit 
                            const [showoption] = await dbsync.execute("SELECT Id_option,Name_option,Price_option,Isselect_option FROM menu_option WHERE Id_sub_option=? AND Status_option=1",[showsub[i].Id_sub])
                            if (showoption.length == 0 && i == showsub.length -1){
                                keepsub = []
                                res.send(allvalue)
                            }
                            if (showmenu.length == 0 &&  i < showcategory.length -1){
                                keepsub = []
                            }
                            for (let o=0;o < showoption.length;o++){
                                keepoption.push({Idoption:showoption[o].Id_option,Nameoption:showoption[o].Name_option,Priceoption:showoption[o].Price_option,Isselect:showoption[o].Isselect_option})
                                if (o == showoption.length -1){
                                    allvalue.push({valuesubject:keepsub,valueoption:keepoption})
                                    keepsub = []
                                    keepoption = []
                                }
                                if (i == showsub.length-1 && o == showoption.length-1){
                                    showall.push({valueshop:valueshop,valeuemenu:showmenu,valuesubjectandoption:allvalue})
                                    res.send(showall)
                                }
                            }
                        }
                    }else if (showmenu.length == 0){
                        // console.log(Idmenu)
                        // console.log(Idshop)
                        // console.log(Nameshop)
                        // console.log(Lat)
                        // console.log(Long)
                        res.send("value menu don't have in data")
                    }else{
                        res.send("something wrong")
                    }
                    
                }else if (showshop.length == 0){
                    // console.log(Idshop)
                    // console.log(Nameshop)
                    res.send("0")
                }else{
                    // console.log(Idmenu)
                    // console.log(Idshop)
                    // console.log(Nameshop)
                    // console.log(Lat)
                    // console.log(Long)
                    res.send("something wrong")
                }
            }else{
                res.send("your values int is null")
            }
        }else{
            res.send()
        }
    }catch(err){
        if (err) throw err
    }
}





module.exports = {showcategory,shopprofile,showmenuUsecatfind,showcategoryandmenu,showshopandmenuandsuboption}