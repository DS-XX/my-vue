const qs = require('querystring')
const mw = function(req,res,next){
    console.log(req.body,'this.is.body')
    let str = ''
    req.on('data',(chunk)=>{
        str += chunk
    })
    req.on('end',(data)=>{
        req.body = qs.parse(str)
    })
    next()
}
module.exports = mw