const express = require('express')
const dbsync = require("D:/react_project/ppap/config/datasync")




const showusers = async (req, res, next) => {
    try {
      const [rows] = await dbsync.execute("SELECT * FROM users")
        res.json(rows)
    } catch (err) {
      if (err) throw err
    }
  
  }

  module.exports = {showusers}