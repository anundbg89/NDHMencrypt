var express = require("express");
var app = express();
app.use(express.static(__dirname + "/"));
const initialfunc = require("./CodeBlock/node/final.js");