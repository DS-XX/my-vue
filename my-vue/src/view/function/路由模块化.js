const express = require('express')
const app = express()

const router = require('./router')

function objFunc(status,msg,data){
    return {
        status,
        msg,
        data
    }    
}
router.get('/user',(req,res)=>{
    const query = req.query
    res.send(objFunc(0,'success',query))
})

router.post('/post',(req,res)=>{
    const body = req.body
    res.send(objFunc(0,'success',body))
})