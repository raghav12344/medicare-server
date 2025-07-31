var mongoose=require("mongoose");
var needyobj={
    email:{type:String,index:true,unique:true},
    contact:String,
    address:String,
    aadhaarNumber:String,
    name:String,
    dob:Date,
    gender:String,
    aadharFront:String,
    aadharBack:String,
};
var ver={
    versionKey:false
};
var schema=new mongoose.Schema(needyobj,ver);
var needydetailsref=mongoose.model("needydetails",schema);
module.exports=needydetailsref;