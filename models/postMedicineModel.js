var mongoose=require("mongoose");
var medicineobj={
    email:String,
    medicineName:String, 
    company:String,
    expiryDate:Date,
    packingType:String,
    quantity:String,
    otherInfo:String
}
var ver={
    versionKey:false
};
var schema=new mongoose.Schema(medicineobj,ver);
var medcolRef=mongoose.model("medicinescollection",schema);
module.exports=medcolRef;