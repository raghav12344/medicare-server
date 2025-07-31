var needycolref=require("../models/needydetailsmodel")
var donarcolref=require("../models/donardetailsModel");
var medcolref=require("../models/postMedicineModel");
var cloudinary=require("cloudinary").v2;
var dotenv=require("dotenv");
dotenv.config();
cloudinary.config({
    cloud_name: 'drsm7bvgf', 
    api_key: process.env.cloudinaryapi, 
    api_secret: process.env.cloudinaryapisec
});
var path=require("path");

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.genaiapikey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
async function frontreader(imgurl)
{
const myprompt = "Read the text on picture and tell all the information in adhaar card in english only,and aadhar number with no spaces and give output STRICTLY in JSON format {adhaar_number:'', name:'', gender:'', dob: ''}. Dont give output as string."   
    const imageResp = await fetch(imgurl)
        .then((response) => response.arrayBuffer());

    const result = await model.generateContent([
        {
            inlineData: {
                data: Buffer.from(imageResp).toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        myprompt,
    ]);
    // console.log(result.response.text())
            
            const cleaned = result.response.text().replace(/```json|```/g, '').trim();
            // console.log(cleaned)
            const jsonData = JSON.parse(cleaned);
            // console.log(jsonData);

    return jsonData

}
async function backreader(imgurl) {
  const myprompt = `
You are analyzing the back of an Indian Aadhaar card. Extract only the address exactly as printed in english only.

Return ONLY in this JSON format:
{
  "address": "House No. 123, XYZ Street, City, State - PIN"
}

Do not include any extra explanation or text.
`;

  const imageResp = await fetch(imgurl).then(res => res.arrayBuffer());
  const result = await model.generateContent([
    {
      inlineData: {
        data: Buffer.from(imageResp).toString("base64"),
        mimeType: "image/jpeg",
      },
    },
    myprompt,
  ]);

  const text = await result.response.text();
//   console.log("GEMINI RAW RESPONSE:", text);

  const cleaned = text.replace(/```json|```/g, '').trim();

  try {
    const jsonData = JSON.parse(cleaned);
    return jsonData;
  } catch (e) {
    console.error("Failed to parse Gemini JSON response:", cleaned);
    return { address: "" }; // fallback if parsing fails
  }
}

async function getaadharinfo(req, resp) {
  try {
    var data = {};

    // Save and upload front image
    const path1 = path.join(__dirname, "..", "uploads", req.files.aadharFront.name);
    await req.files.aadharFront.mv(path1);
    const frontUpload = await cloudinary.uploader.upload(path1);
    const frontdetails = await frontreader(frontUpload.secure_url);
    data={...data,...frontdetails};

    // Save and upload back image
    const path2 = path.join(__dirname, "..", "uploads", req.files.aadharBack.name);
    await req.files.aadharBack.mv(path2);
    const backUpload = await cloudinary.uploader.upload(path2);
    const backdetails = await backreader(backUpload.secure_url);
    data={...data,...backdetails};

    console.log("Final Extracted Data:", data);
    return resp.json({status:true,msg:"extracted successfully",obj:data});

  } catch (err) {
    console.error("Error in getaadharinfo:", err);
    return resp.status(500).send("Failed to process Aadhaar card.");
  }
}
async function needydetails(req, resp) {
  try {
    const path1 = path.join(__dirname, "..", "uploads", req.files.aadharFront.name);
    await req.files.aadharFront.mv(path1);
    const picurl1 = await cloudinary.uploader.upload(path1);
    req.body.aadharFront = picurl1.url;

    const path2 = path.join(__dirname, "..", "uploads", req.files.aadharBack.name);
    await req.files.aadharBack.mv(path2);
    const picurl2 = await cloudinary.uploader.upload(path2);
    req.body.aadharBack = picurl2.url;

    let needyobj = new needycolref(req.body);
    let docu = await needyobj.save();

    if (docu != null) {
      resp.json({ status: true, msg: "record updated", obj: docu });
    } else {
      resp.json({ status: false, msg: "Failed to save record" });
    }
  } catch (err) {
    console.log(err.message);
    resp.json({ status: false, msg: "Error occurred" });
  }
}

function fetchdetails(req,resp)
{
  needycolref.findOne({email:req.body.email}).then((docu)=>{
    resp.json({status:true,msg:"Record found",obj:docu});
  }).catch((err)=>cconsole.log(err.message));
}
async function fetchcities(req,resp)
{
    let cities=await donarcolref.distinct("city");
    console.log(cities)
    resp.json(cities);
}
async function fetchmedicines(req,resp)
{
  let medicines=await medcolref.distinct("medicineName");
    console.log(medicines);
    resp.json(medicines);
}
async function findmed(req, resp) {
  const { selectedCity, selectedMed } = req.body;

  try {
    console.log("Selected City:", selectedCity);
    console.log("Selected Medicine:", selectedMed);

    const emails = await donarcolref.distinct("email", { city: selectedCity });
    console.log("Donor Emails Found:", emails);

    if (emails.length === 0) {
      return resp.json([]); // No donors
    }

    const meds = await medcolref.find({
      email: { $in: emails },
      medicineName: { $regex: `^${selectedMed}$`, $options: "i" }
    }).lean();

    console.log("Medicines Found:", meds);
    resp.json(meds);
  } catch (err) {
    console.error("Error in findmed:", err);
    resp.status(500).json({ error: "Server error", details: err.message });
  }
}
async function meddetails(req, resp) {
  try {
    const { email } = req.body; // Make sure the client sends JSON
    console.log("Email received in meddetails:", email);

    const donor = await donarcolref.findOne({ email: email });

    if (!donor) {
      return resp.status(404).json({ error: "Donor not found" });
    }

    console.log("Donor found:", donor);
    resp.json(donor);
  } catch (err) {
    console.error("Error in meddetails:", err);
    resp.status(500).json({ error: "Server error", details: err.message });
  }
}

module.exports={getaadharinfo,needydetails,fetchdetails,fetchcities,fetchmedicines,findmed,meddetails};