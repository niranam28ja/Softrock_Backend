const dbsync = require("D:/react_project/ppap/config/datasync")
const express = require("express")

const version = async (req, res) => {
    try {
        const system = req.body.System
        if (system !== undefined) {
            const [rows] = await dbsync.execute("SELECT Version,Status_ver,System FROM version")
            const csys = rows.some(rows => rows.System === system)
            if (csys === true) {
                const [data] = await dbsync.execute("SELECT Version,Status_ver,System FROM version WHERE System=?", [system])
                res.send(data)
            } else {
                res.send("this system don't have in data")
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

module.exports = { version }