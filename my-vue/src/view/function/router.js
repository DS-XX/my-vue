const express = require('express')
const router = express.Router()

router.get('/user',(req,res)=>{
    console.log('getUser')
})

module.exports = router