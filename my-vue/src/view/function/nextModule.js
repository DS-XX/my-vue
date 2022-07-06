const qs = require('querystring')
const mw = function(req,res,next){
    let str = ''
    req.on('data',(chunk)=>{
        str += chunk
    })
    req.on('end',(data)=>{
        req.body = qs.parse(str)
    })
    next()
}

const jwt = require('jsonwebtoken')
const secretKey = 'ithemia no1'

//jiemi 
/**
 * 校验token是否过期
 * */
 function verson(req,res,next){
    if(req.url.includes("/login") || req.url.includes("/register")){
        next()
        return 
    }
    var token=req.headers.authorization.split(" ")[1];
    let con = jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.log(err);
            if(err.name == 'TokenExpiredError'){//token过期
                let str = {
                    iat:1,
                    exp:0,
                    msg: 'token过期'
                }
                res.send(str)
                return str;
            }else if(err.name == 'JsonWebTokenError'){//无效的token
                let str = {
                    iat:1,
                    exp:0,
                    msg: '无效的token'
                }
                res.send(str)
                return str;
            }
        }else{
            return decoded;
        }
    })
    if(con.iat<con.exp){
        next()
        return true //开始时间小于结束时间，代表token还有效
    }else{
        return false
    }
}
module.exports = verson