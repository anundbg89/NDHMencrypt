const finaljs= require("./final.js");
var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
console.log('port is'+ port);
server.listen(port)

app.use(function (req, res, next) {
    const responseObject = req.body;
    console.log('final body'+req.body);
    responseObject["inboundUrl"] = req.path;
    //responseObject.inboundUrl = req.path;
    console.log('Final Data' + responseObject);
    conn.apex.post("/gateway/onFetchMode/", responseObject, function(res) {
    // the response object structure depends on the definition of apex class
    console.log('request sent back')
    });
    /*conn1.apex.post("/gateway/onFetchMode/", responseObject, function(res) {
      // the response object structure depends on the definition of apex class
      console.log('request sent back')
      });*/
    next()
  })
  require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: ' + add);
  })