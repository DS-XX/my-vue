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
const http = require('http')
const server = http.createServer()
server.on('request',(req,res)=>{
    const url = req.url
    const method = req.method
    const str = `your url is ${url} and request method is ${method}`
    console.log(str)
})
server.listen(8082,()=>{
    console.log('server runing at http://127.0.0.1:8082')
})