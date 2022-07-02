//jshint esversion:6
require('dotenv').config();
const express=require("express")
const bodyParser=require("body-parser")
const ejs=require("ejs")
const mongoose=require("mongoose")
const app=express();
const encrypt=require("mongoose-encryption")

console.log(process.env.API_KEY);
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));



mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema= new mongoose.Schema({
    email:String,
    password: String
});


userSchema.plugin(encrypt,{secret:process.env.SERECT,encryptedFields:["password"]})
const User=new mongoose.model("User",userSchema);

app.get("/" ,(req,res)=>{
  res.render("home")
})
app.get("/login" ,(req,res)=>{
    res.render("login")
  })
  app.get("/register" ,(req,res)=>{
    res.render("register")
  })



  app.post("/register" ,(req,res)=>{
    const newUser=new User({
        email: req.body.username,
        password:req.body.password
    });
    newUser.save(function(err){
        if(!err){
            res.render("secrets");
        }
        else{
            console.log(err)
        }
    })

  })

  app.post("/login",function(req,res){
    const username=req.body.username;
    const password =req.body.password;
    User.findOne({email:username},function(err,founduser){
        if(err){
            console.log(err)
        }
        else{
            if(founduser){
                if(founduser.password===password){
                    res.render("secrets")
                }
            }
        }
    })
  })


  app.listen(3000,()=>{
     console.log("server has started succesfully")
  })