const express = require('express')
const app = express()

//next必须 中间件
const mw = function(req,res,next){
    console.log('中间件')
    next()
}
const mw2 = mw
app.use(mw)
  
app.get('/user',[mw,mw2],()=>{

})
app.listen('80')
