/*var express = require("express");
var app = express();
app.use(express.static(__dirname + "/"));

var server = http.createServer(app)
console.log('port is'+ port);
server.listen(port)
app.use(function (req, res, next) {
    
    next()
  })
  require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: ' + add);
  })*/
  const {encryptDataFunc,} = require("./CodeBlock/node/final.js");
  
  var http = require("http")
  var express = require("express")
  var app = express()
  var port = process.env.PORT || 5000
  var bodyParser = require('body-parser')
  app.use(bodyParser.json());
  var server = http.createServer(app)
console.log('port is'+ port);
server.listen(port)
  app.use(function (req, res, next) {
    console.log(req.body.stringToEncrypt);
    console.log(req.body.requesterData);
    encryptDataFunc(req.body.stringToEncrypt,req.body.requesterData);
    //const fideliusVersion = getFideliusVersion()

    //initialfunc(initialfunc)
    
    next()
  })
  require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: ' + add);
  })