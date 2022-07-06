const fs = require('fs')
const path = require('path')
fs.readFile('./test.txt','utf8', (err, data) => {
    console.log(err,'this.is.err')
    if (err) throw err;
    console.log(data);
  });

// let x = ''
// for(let i =0;i<100;i++){
//     x += '测试'+i+'\n'
// }
// fs.writeFile('./test.txt',x,function(err){
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log('写入成功')
//     }
// })

// const filePath = 'test.txt'
// const newPath = 'newText.txt'
// const testPath = path.join(__dirname,filePath)
// const newFilePath = path.join(__dirname,newPath)
// console.log(testPath)
// fs.readFile(testPath,'utf8',(err,data)=>{
//     console.log('---------------------')
//     console.log(err)
//     console.log(data)
//     console.log('---------------------')
//     fs.writeFile(newFilePath,data,(err)=>{
//     if(!err){
//         console.log('写入成功')
//     }
// })
// })


//create http
// const http = require('http')
// const server = http.createServer()
// server.on('request',(req,res)=>{
//     const url = req.url
//     const method = req.method
//     const str = `your url is ${url} and request method is ${method} 测试这个中文`
//     res.setHeader('Content-Type','text/html; charset=utf-8')
//     res.end(str)
// })
// server.listen(8082,()=>{
//     console.log('server runing at http://127.0.0.1:8082')
// })
const mysql = require('mysql')
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'test'
  });
   
  connection.connect();

  let sql = 'select * from user'
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
    console.log('--------------------------SELECT----------------------------');
    console.log(results);
    console.log('------------------------------------------------------------\n\n');  
  });



const express = require('express');
const { param } = require('./router');
const app = express()
app.use('/pictures',express.static(path.join(__dirname,'/pictures')))
app.use(express.json())
const bodyParser = require('body-parser')
app.use(bodyParser.json())
// app.use(express.urlencoded({extended: false}))
app.use(require('cors')())
app.use(require('./nextModule'))

const jwt = require('jsonwebtoken')
//jiemi 
const {expressjwt: expressJWT} = require('express-jwt')
//定义secret密钥
const secretKey = 'ithemia no1'


const session = require('express-session');
app.use(
    session({
        secret: 'itheima',
        resave: false,
        saveUninitialized: true
    })
)

//设置token的验证
app.use(expressJWT({secret:secretKey, algorithms: ['RS256']}).unless({path: ["/login","/register"]}))

//login
app.post('/login',(req,res)=>{
    const body = req.body
    sql = 'select * from user where loginName=?'
    connection.query(sql,body.loginName,(err,results)=>{
        if(results.length > 0){
            if(body.password == results[0].password){
                req.session.user = body
                req.session.isLogin = true
            }
            else{
                res.send({
                    status: 500,
                    msg: '密码错误',
                })
                return
            }
        }
        else{
            res.send({
                status: 500,
                msg: '无此用户名',
            })
            return
        }
        //token的设置
        const tokenStr = jwt.sign({loginName:body.loginName},secretKey,{expiresIn: '100s'})
        res.send({
            status: 200,
            msg: '登陆成功',
            isSuccess: true,
            token: tokenStr
        })
    })
    
})

app.post('/register',(req,res)=>{
    const body = req.body
    sql = 'insert into user set ?'
    connection.query(sql,body,(err,results)=>{
        if(results){
            res.send({
                status: 200,
                mgs: '注册成功',
                isSuccess: true
            })
        }
    })
})
app.post('/loginout',(req,res)=>{
    req.session.destroy()
    res.send({
        status: 0,
        mes: '退出登陆成功'
    })
})
app.get('/user',(req,res)=>{
    const query = req.query
    console.log(query,'this.is.query')
    console.log(req.user,'这个是token加密了之后才有的')
    sql = `select * from user where loginName = ${query.loginName}`
    connection.query(sql,(err,results)=>{
        console.log(results,'results')
        res.send(results)
    })
    connection.end()
})

//轮播图
app.post('/homePicture',(req,res)=>{
    const body = req.body
    sql = `select * from `
})

app.get('/user:loginName',(req,res)=>{
    const params = req.params
})

app.post('/insertUser',(req,res)=>{
    const params = req.body 
    sql = 'select id from user where loginName=?'
    connection.query(sql,params.loginName,(err,searchResult)=>{
        if(searchResult){
            //更新
            params.id = searchResult[0].id
            // sql = 'update user set loginName=?,password=? where id=?'
            // sql = 'update user set ? where id=?'
            // connection.query(sql,[params.loginName,params.password,params.id],(err,result)=>{
            //     console.log(result)
            // })
            //删除
            sql = 'delete from user where id=?'
            connection.query(sql,params.id,(err,results)=>{
                console.log(results)
            })
        }
    })
    sql = 'insert into user (loginName,password) values (?,?)'
    sql = 'insert into user set ?'
    //插入1
    // connection.query(sql,[params.loginName,params.password],(err,results)=>{
    //     if(err) return console.log(err)
    //     if(results.affectedRows === 1) {console.log('插入成功')}
    // })
    //插入2
    // connection.query(sql,params,(err,results)=>{
    //     if(err) return console.log(err)
    //     if(results.affectedRows === 1) {console.log('插入成功')}
    // })
    
    res.send({
        status:0,
        msg: 'success'
    })
})

app.use((err,req,res,next)=>{
    // console.log(err.message)
    res.send(err.message)
})
app.listen(8082,()=>{
    console.log('listing')
})

