const dotenv = require("dotenv")
const request = require('request')
const line = require("@line/bot-sdk")
const dbsync = require("../config/datasync")
const { findusermenuorder } = require("../shop/findorder/Findorder")
dotenv.config()

const client = new line.Client({
    channelAccessToken: process.env.Longlivedtoken,
    channelSecret: process.env.Channelsecret
})

let headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.Longlivedtoken}`
}



const replymessage = async (events) => {
    try {
        // console.log(events.message.text[0])
        const somethingwrong =  JSON.stringify({
            replyToken: events.replyToken,
            messages: [{
                type: 'text',
                text: `โทเคนของท่านไม่มีในฐานข้อมูล`
            }]
        })
       if (events !== undefined){
        if (events.message.text[0] === "L"){
            const [Finduser] = await dbsync.execute("SELECT Id_usr,UserName_usr FROM users WHERE Token_line_usr=?",[events.message.text])
            // console.log(Finduser.length)
            if (Finduser.length === 1){
                // console.log("efeln")
                await dbsync.execute("UPDATE users SET Id_line_usr=? WHERE Token_line_usr=?",[events.source.userId,events.message.text])
                const successLineLogin =  JSON.stringify({
                    replyToken: events.replyToken,
                    messages: [{
                        type: 'text',
                        text: `สวัสดีคุณ ${Finduser[0].UserName_usr} เราจะคอยแจ้งข่าวสารให้ทราบ`
                        // เข้าสู่ระบบสำเร็จ เราจะคอยแจ้งข่าวสารเพื่อให้ท่านได้รับทราบ 
                    }]
                })
                request.post({
                    url: 'https://api.line.me/v2/bot/message/reply',
                    headers: headers,
                    body: successLineLogin
                }, (err, res, body) => {
                    // console.log('status = ' + res.statusCode)
                    if (err){
                        res.statusCode(400)
                    }
                })
            }else{
                request.post({
                    url: 'https://api.line.me/v2/bot/message/reply',
                    headers: headers,
                    body: somethingwrong
                }, (err, res, body) => {
                    console.log('status = ' + res.statusCode)
                })
            }
        }else if(events.message.text === "วิธีเข้าสู่ระบบ"){
            const HowToLogin =  JSON.stringify({
                replyToken: events.replyToken,
                messages: [{
                    type: 'text',
                    text: `วิธีเข้าสู่ระบบเพียงแค่คุณดึงโคเทนที่หน้าตั้งค่ามาใส่ในข้อความแล้วกดส่ง ทางเราจะทำเราประมวลผมว่าข้อมูลนี้มีจริงหรือภ้าสำเร็จจะทำการแจ้งข่าวสารให้ท่านทราบ`
                    // เข้าสู่ระบบสำเร็จ เราจะคอยแจ้งข่าวสารเพื่อให้ท่านได้รับทราบ 
                }]
            })
            request.post({
                url: 'https://api.line.me/v2/bot/message/reply',
                headers: headers,
                body: HowToLogin
            }, (err, res, body) => {
                if (err){
                    res.statusCode(400)
                }
            })
        }else{

        }
       }else{
            res.statusCode(200)
       }
       
    } catch (err) {
        if (err) {
            console.log(err)
            return ("have some error")
        }
    }
}


const sendmassege = async (req, res) => {
    try {
        // it can send by one or mutiple send by use array 
        const sms = [{
            type: 'text',
            text: 'test softrock'
        },
        {
            type:"text",
            text:"najaa!!"
        }
    ]
        const sendm = await client.pushMessage('U9bb38f47900462101545c593a48441f7', sms)
        res.send("success")
    } catch (err) {
        if (err) {
            console.log(err)
            res.send("have some error")
        }
    }
}

module.exports = { replymessage,sendmassege }

// billkung
// Ub35035df56d8ed1ec9c62ead76e925c3

// for popo 
// U9bb38f47900462101545c593a48441f7