const dbsync = require("D:/react_project/ppap/config/datasync")


const deletemenu = async(req,res) =>{
    try{
        let Id_menu = req.body.IdMenu
        let Id_user = req.body.IdUser
        if (Id_menu !== undefined && Id_user !== undefined){
            Id_menu = parseInt(Id_menu)
            Id_user = parseInt(Id_user)
            if (isNaN(Id_menu) !== true && isNaN(Id_user) !== true){
                const [Menudata] = await dbsync.execute("SELECT * FROM addmenu WHERE Id_menu=?",[Id_menu])
                if (Menudata.length === 1){
                    const [Access] = await dbsync.execute("SELECT * FROM shop_access WHERE Id_usr_acc=? AND Idshop_acc=? AND Edit_acc=1",[Id_user,Menudata[0].Id_shop_menu])
                    if (Access.length == 1){
                        // delete menu , subject , option
                        const [Subject] = await dbsync.execute("SELECT * FROM menu_subject WHERE Id_menu_sub=?",[Id_menu])
                        if(Subject.length > 0){
                            for(let i=0;Subject.length > i;i++){
                                const [Option] = await dbsync.execute("SELECT * FROM menu_option WHERE Id_sub_option=?",[Subject[i].Id_sub])
                                if (Option.length > 0){
                                    await dbsync.execute("DELETE FROM menu_subject WHERE Id_sub=?",[Subject[i].Id_sub])
                                    await dbsync.execute("DELETE FROM menu_option WHERE Id_sub_option=?",[Subject[i].Id_sub])
                                    if (Subject.length-1 === i){
                                        await dbsync.execute("DELETE FROM addmenu WHERE Id_menu=?",[Id_menu]) 
                                        res.send("success")
                                    }
                                }else{
                                    // await dbsync.execute("DELETE FROM addmeu FROM Id_menu=?",[Id_menu])
                                    await dbsync.execute("DELETE FROM menu_subject WHERE Id_sub=?",[Subject[i].Id_sub])
                                    if (Subject.length-1 === i){
                                        await dbsync.execute("DELETE FROM addmenu WHERE Id_menu=?",[Id_menu]) 
                                        res.send("success")
                                    }
                                }
                            }
                        }else{
                            await dbsync.execute("DELETE FROM addmenu WHERE Id_menu=?",[Id_menu])
                            res.send("success")
                        }
                    }else{
                        // console.log(Id_user)
                        res.send("This user don't'have access in data")
                    }
                }else{
                    res.send("This menu don't have in data")
                }
            }else{
                res.send("your value int is null")
            }
        }else{
            res.send()
        }
    }catch(err){
        if (err){
            console.log(err)
            res.send("have some error")
        }
    }
}

module.exports = {deletemenu}