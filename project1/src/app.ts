require('dotenv').config();
const debug = require("debug")("game-case")
import express from "express";
import path from "path";
import {IGameUser} from "./facades/userFacade"
import {UserFacade} from "./facades/userFacade"
const app = express();

app.use(express.json())

app.use(express.static(path.join('./', 'public')));
app.get("/", (req, res) => {
  res.sendFile('index.html')
});

app.get("/api/dummy", (req, res) => {
  res.json({ msg: "HELLO" })
})

app.get("/api/users", (req,res)=>{
  
  const users = UserFacade.getAllUsers();
  debug(users);
  res.json({users: users})
});

app.get("/api/users/:id", (req,res)=>{
  const userID = parseInt(req.params.id);
  const user = UserFacade.getUser(userID);  
  res.send(user);
});

app.delete("/api/users/:id", (req,res)=>{
  const userID = parseInt(req.params.id);
  const user = UserFacade.deleteUser(userID);
  if(user) res.send("Successfully delted user with id " + userID); 
  
});


app.post('/api/users', (req, res)=>{
  const allUsers = UserFacade.getAllUsers()
  const user : IGameUser = {
    id: allUsers.length +1,
    name : req.body.name,
    userName : req.body.userName,
    password : req.body.password,
    role: req.body.role
  };
  UserFacade.addUser(user)

  res.send(user);

});



const PORT = process.env.PORT || 3333;
const server = app.listen(PORT)
console.log(`Server started, listening on port: ${PORT}`)
module.exports.server = server;


