var http = require('http')
var auth = require('basic-auth')
var compare = require('tsscmp')
import {Response} from "express";
import UserFacade from "../facades/userFacade";

 
// Create server
var authMidlleware = function (req, res: Response, next:Function) {
  var credentials = auth(req)
 
  // The "check" function will typically be against your user store
  if (!credentials || !check(credentials.name, credentials.pass)) {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="example"')
    res.end('Access denied')
  } else {
    res.end('Access granted')
  }
}
 