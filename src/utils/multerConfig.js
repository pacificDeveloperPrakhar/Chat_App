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
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp','image/svg+xml',"image/jpg"];
  if(allowedMimeTypes.includes(file.mimetype)){
    console.log("file upload has been accepted")
    cb(null,true)
  }
  else
  {
    console.log("file has been rejected")
    cb(null,false)
  }
}
const cloudinary=require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key:process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
})

const storeToCloudinary=catchAsync(async (req,res,next)=>{

})
const uploadLocal=multer({storage})
module.exports={uploadLocal}