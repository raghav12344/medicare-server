var express=require("express");
var appRouter=express.Router();
var obj=require("../controllers/donarController")
var {validatetoken}=require("../config/validate");
appRouter.post("/post-medicine",validatetoken,obj.postMedicine);
appRouter.post("/postdonarDetails",validatetoken,obj.postdetails);
appRouter.post("/fetchdetails",validatetoken,obj.fetch);
appRouter.post("/update",validatetoken,obj.update);
appRouter.post("/getmedicines",validatetoken,obj.getmedicines);
appRouter.post("/deletemedicine",validatetoken,obj.deletemedicine);
appRouter.post("/fetchmed",validatetoken,obj.fetchmed);
appRouter.post("/update-medicine",validatetoken,obj.updatemedicine);
module.exports=appRouter;