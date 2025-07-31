var express=require("express");
var cors=require("cors");
var fileuploader=require("express-fileupload");
var dotenv=require("dotenv");
var donarRouter=require("./routers/donarRouter")
var recieverRouter=require("./routers/recieverRouter")
var userRouter=require("./routers/userRouter")
var mongoose=require("mongoose");
var app=express();
app.use(cors());
dotenv.config()
app.use(fileuploader());
app.use(express.urlencoded(true));
let atlarurl=process.env.atlarurl;
mongoose.connect(atlarurl).then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err.message);
})
app.listen(2025,()=>{
    console.log("server started at 2025");
})
app.use("/reciever",recieverRouter);
app.use("/donar",donarRouter);
app.use("/user",userRouter);
app.use("/",(req,resp)=>{
    resp.send("welcome to sever");
})
