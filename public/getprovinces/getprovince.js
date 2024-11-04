const express = require('express')
const dbsync = require("D:/react_project/ppap/config/datasync")



const getpro = async(req,res) =>{
    const [rows] = await dbsync.execute("SELECT name_th,id FROM provinces")
    res.send(rows)
    // const ppa = [{name:"123"},{name:"48"}] 
    // res.json(ppa.length)
}
const getdis = async(req,res)=>{
    const districts = req.body.districts
    if (districts !== undefined){
        const [rows] = await dbsync.execute("SELECT name_th FROM provinces")
        const cdis = rows.some(rows => rows.name_th === districts)
        if (cdis === true){
            const [disjs] = await dbsync.execute("SELECT id FROM provinces WHERE name_th=?",[districts])
            const [rowsdis] = await dbsync.execute("SELECT name_th FROM amphures WHERE province_id=?",[disjs[0].id])
            res.send(rowsdis)
        }else{
            res.send("it's not dis")
        }
    }else{
        res.send()
    }
}

const getsub = async(req,res) =>{
    const subdistricts = req.body.subdistricts
    if (subdistricts !== undefined){
        const [rows] = await dbsync.execute("SELECT name_th FROM amphures")
        const csub = rows.some(rows => rows.name_th === subdistricts)
        if (csub === true){
            const [subjs] = await dbsync.execute("SELECT id FROM amphures WHERE name_th=?",[subdistricts])
            const [rowssub] = await dbsync.execute("SELECT name_th,zip_code FROM districts WHERE amphure_id=?",[subjs[0].id])
            res.send(rowssub)
        }else{
            res.send("it's not sub")
        }
    }else{
        res.send()
    }
}

const getyear = async(req,res) =>{
    const [rows] = await dbsync.execute("SELECT Year FROM year")
    res.send(rows)
}


module.exports = {getpro,getdis,getsub,getyear}