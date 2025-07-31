var medcolRef=require("../models/postMedicineModel");
var donardetailsref=require("../models/donardetailsModel");
var cloudinary=require("cloudinary").v2;
var path=require("path");
var dotenv=require("dotenv");
dotenv.config();
cloudinary.config({
    cloud_name: 'drsm7bvgf', 
    api_key: process.env.cloudinaryapi, 
    api_secret: process.env.cloudinaryapisec
});
function postMedicine(req,resp)
{
    var meddata=new medcolRef(req.body);
    meddata.save().then((docu)=>{
        resp.json({status:true,msg:"medicine uploaded successfully",obj:docu});
    }).catch((err)=>resp.json({status:false,msg:err.message}))
}
async function postdetails(req,resp)
{
    let path1=path.join(__dirname,"..","/uploads",req.files.aadhaarPic.name);
    await req.files.aadhaarPic.mv(path1)
    await cloudinary.uploader.upload(path1).then((picurlresult)=>{
        req.body.aadhaarPic=picurlresult.url;
    });

    let path2=path.join(__dirname,"..","/uploads",req.files.profilePic.name);
    await req.files.profilePic.mv(path2);
    await cloudinary.uploader.upload(path2).then((picurlresult)=>{
        req.body.profilePic=picurlresult.url;
    })
    console.log(req.body.aadhaarPic);
    console.log(req.body.profilePic);
    var donardata=new donardetailsref(req.body);
    donardata.save().then((docu)=>{
        resp.json({status:true,msg:"Details saved",obj:docu});
    }).catch((err)=>resp.json({status:false,msg:err.message}));
}
function fetch(req,resp)
{
    donardetailsref.findOne({email:req.body.email}).then((docu)=>{
        if(docu!=null)
            resp.json({status:true,msg:"record fetched",obj:docu});
        else
            resp.json({status:false,msg:"no record found please save one"});
    }).catch((err)=>console.log(err.message))
}
async function update(req,resp)
{
    console.log(req.body.email);
    if(req.files && req.files.aadhaarPic)
    {
        let path1=path.join(__dirname,"..","/uploads",req.files.aadhaarPic.name);
        req.files.aadhaarPic.mv(path1)
        await cloudinary.uploader.upload(path1).then((picurlresult)=>{
            req.body.aadhaarPic=picurlresult.url;
        });
    }
    else
    {
        await donardetailsref.findOne({email:req.body.email}).then((docu)=>{
            req.body.aadhaarPic=docu.aadhaarPic;
        }).catch((err)=>err.message);
    }
    console.log(req.body.aadhaarPic);
    if(req.files && req.files.profilePic)
    {
        let path2=path.join(__dirname,"..","/uploads",req.files.profilePic.name);
        req.files.profilePic.mv(path2);
        await cloudinary.uploader.upload(path2).then((picurlresult)=>{
            req.body.profilePic=picurlresult.url;
        })
    }
    else
    {
        await donardetailsref.findOne({email:req.body.email}).then((docu)=>{
            req.body.profilePic=docu.profilePic;
        }).catch((err)=>err.message);
    }
    console.log(req.body.profilePic);
    await donardetailsref.updateOne({email:req.body.email},{$set:req.body}).then((docu)=>{
        resp.json({status:true,msg:"record updated"});
    }).catch((err)=>console.log(err.message));
}
function getmedicines(req,resp)
{
    medcolRef.find({email:req.body.email}).then((docu)=>{
        resp.json({status:true,msg:"found posted medicines",obj:docu});
    }).catch((err)=>console.log(err.message));
}
function deletemedicine(req,resp)
{
    // console.log("hi");
    console.log(req.body.id)
    medcolRef.deleteOne({_id:req.body.id}).then((docu)=>resp.json({status:true,msg:"medicine deleted"})).catch((err)=>err.message);
}
async function fetchmed(req,resp)
{
    let id=req.body.id;
    // console.log(id)
    await medcolRef.findOne({_id:id}).then((docu)=>resp.json({status:true,msg:"med fetched",obj:docu}))
}
async function updatemedicine(req,resp)
{
    console.log(req.body.id);
    await medcolRef.updateOne({_id:req.body.id},{$set:req.body}).then((docu)=>{
        console.log(docu)
        resp.json({status:true,msg:"med update successfully"})
});
}
module.exports={postMedicine,postdetails,fetch,update,getmedicines,deletemedicine,fetchmed,updatemedicine};