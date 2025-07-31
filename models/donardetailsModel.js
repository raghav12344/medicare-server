var mongoose=require("mongoose");
var donarObj={
    email:{type:String,index:true,unique:true},
    name:String,
    age:String,
    gender:String,
    address:String,
    city:String,
    contact:String,
    qualification:String,
    occupation:String,
    aadhaarPic:String,
    profilePic:String
}
var ver={
    versionKey:false,
};
var schema=new mongoose.Schema(donarObj,ver);
var donardetailsref=mongoose.model("donardetails",schema);
module.exports=donardetailsref;