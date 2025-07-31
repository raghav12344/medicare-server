var mongoose=require("mongoose");
var userObj={
    name:String,
    email:{type:String,unique:true,index:true},
    password:String,
    userType:String,
    dos:{type:Date,default:Date.now}
}
var ver={
    versionKey:false
};
var schema=new mongoose.Schema(userObj,ver);
var UsercolRef=mongoose.model("usercollection",schema);
module.exports=UsercolRef;