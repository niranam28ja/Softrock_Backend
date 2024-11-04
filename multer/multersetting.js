const multer = require("multer")
const random = require("randomstring")
const express = require('express')
const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null, "/react_project/ppap/Picture" )
    },
    filename : (req,file,cb) =>{
        const ppap =  req.body.pp
        const name =  ppap+ " - " + random.generate(10) + " - "+ file.originalname
        cb(null,name)
    }
})

const pp = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "/react_project/ppap/Picture")
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

module.exports = {storage}