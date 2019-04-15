let express = require("express")
let server = express()
server.all("*",function(req,res,next){
	res.header('Access-Control-Allow-Origin','*')
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
})

server.get("/test",function(req,res){
	res.cookie("name","zonglang",{maxAge:36000})
	res.header("ETag","12345")
	res.header("zonglang","lalala")
	res.end(JSON.stringify({"name":"zonglang"}))
})

server.get("/test.html",function(req,res){
	res.sendFile(__dirname + "/test.html")
})

server.listen(3000,function(){
	console.log('server is listening at port 3000')
})