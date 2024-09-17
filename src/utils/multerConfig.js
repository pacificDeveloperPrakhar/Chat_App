const multer=require("multer")
const catchAsync =require("./catchAsync")
const path=require("path")
const storage=multer.diskStorage({
  destination:function(req,file,cb){
   console.log("i am here")

   return cb(null,"public/profiles")
  },
  filename:function(req,file,cb){
    const userId=req?.session?.userId;
    req.userId=userId
    const uniqueFactor=Math.round(Math.random()*1e9)
    const time=Date.now();
    const validExtensions=["svg","jpeg","jpg","xml","png"]
    const xtension=file.originalname.split(".").find((str)=>validExtensions.includes(str))
    if(!xtension)
      {
        console.log(`${file.originalname} is not valid to be able to be exported to the database`)
      return cb(null,false)
}
    return cb(null,`${userId}-${time}-${uniqueFactor}.${xtension}`)
  }
})
const fileFilter=function(req,file,cb){
  console.log("here lies my code")
  console.log("file from filter",req.file)
  console.log("files from filter",req.files)
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp','image/svg+xml',"image/jpg"];
  if(allowedMimeTypes.includes(file.mimetype)){
    console.log("file upload has been accepted")
    req.successMssg="image has been uploaded successfully"
    req.statusCOde=201
    cb(null,true)
  }
  else
  {
    console.log("file has been rejected")
    req.errorMssg=`from author :you can use png,svg, jpeg and jpeg format only`
    req.statusCode=400
    cb(null,false)
  }
}
const cloudinary=require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key:process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
})

const storeProfileImagesToCloudinary=catchAsync(async(req,res,next)=>{
console.log("files:",req.files)
console.log("file:",req.file)
if(!req.files)
  req.files=[]
req.files=[...req.files,req.file]
const uploadToCloudinary=function(filePath){
  return new Promise((resolve,reject)=>{
      cloudinary.uploader.upload(filePath,{folder:"profiles"},(err,res)=>{
        if(err)
        reject(err)
        else
        resolve(res)
      })
  })
}
let results=await Promise.all(req.files.map((file)=>{
  const filePath=path.resolve(__dirname,"../","../",file.path)
  return uploadToCloudinary(filePath)
}))
results=results.map((fileObj)=>{
  return {
    url:fileObj.secure_url,
    public_id:fileObj.public_id
  }
})
req.fileObjs=results
console.log("file has been shared")
console.log(req.fileObjs)
next()
})
const uploadLocal=multer({storage,fileFilter})
module.exports={uploadLocal,storeProfileImagesToCloudinary}