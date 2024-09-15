const multer=require("multer")
const catchAsync =require("./catchAsync")
const path=require("path")
const storage=multer.diskStorage({
  destination:function(req,file,cb){
   console.log("i am here")
   console.log(file)
   return cb(null,"public/profiles")
  },
  filename:function(req,file,cb){
    return cb(null,"myfile.png")
  }
})
const uploadLocal=multer({storage})
module.exports={uploadLocal}