var express=require("express");
var appRouter=express.Router();
var obj=require("../controllers/userController")
appRouter.post("/signup",obj.signup);
appRouter.post("/login",obj.login);
module.exports=appRouter;