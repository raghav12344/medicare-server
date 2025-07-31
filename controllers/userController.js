const jwt = require("jsonwebtoken");
var UsercolRef=require("../models/userModel")
function signup(req,resp)
{
    var userdata=new UsercolRef(req.body);
    userdata.save().then((docu)=>{
        resp.json({status:true,msg:"Recourd saved with "+docu.userType,obj:docu})
    }).catch((err)=>resp.json({status:false,msg:err.message}));
}
function login(req,resp)
{
    UsercolRef.findOne({email:req.body.email,password:req.body.password}).then((docu)=>{
        if(docu!=null)
        {
            let jtoken=jwt.sign({email:req.body.email},process.env.SEC_KEY,{expiresIn:"10m"});
            resp.json({status:true,msg:"found record with "+docu.userType,obj:docu,token:jtoken});
        }
    }).catch((err)=>resp.json({status:false,msg:err.message}))
}
module.exports={signup,login};