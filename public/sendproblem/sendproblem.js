const dbsync = require("D:/react_project/ppap/config/datasync")



const sendproblem = async(req,res) =>{
    try{
        let Id_user = req.body.Id_user
        const Token = req.body.Token
        const comment = req.body.Comment
        if (Id_user !== undefined && Token !== undefined && comment !== undefined){
            Id_user = parseInt(Id_user)
            if (isNaN(Id_user) !== true){
                const [user] = await dbsync.execute("SELECT * FROM users WHERE Id_usr=? AND Gen_usr=?",[Id_user,Token])
                if (user.length === 1){
                    await dbsync.execute("INSERT INTO problem_app (Id_usr_problem,UserName_usr_problem,Comment_usr_problem) VALUES (?,?,?)",[Id_user,user[0].UserName_usr,comment])
                    res.send("send problem success")
                }else{
                    res.send("this user don't have in data")
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


const showsendproblem = async(req,res) =>{
    try{
        const [showproblem] = await dbsync.execute("SELECT * FROM problem_app ORDER BY Date_usr_problem DESC")
        res.json(showproblem)
    }catch(err){
        if (err){
            console.log(err)
            res.send("have some error")
        }
    }
}

module.exports = {sendproblem,showsendproblem}