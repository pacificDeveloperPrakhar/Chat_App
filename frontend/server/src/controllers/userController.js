const userModel=require("../model/userModel")
const catchAsync=require("../utils/catchAsync")
exports.addUser=catchAsync(async(req,res,next)=>{
  const user=await userModel.create(req.body)
  res.status(201).json({
  status:"created a user",
  data:user
  })
})
exports.getUsers=catchAsync(async(req,res,next)=>{
  const user=await userModel.find();
  res.status(200).json({
    status:"users have beeen found",
    length:user.length,
    data:user
  })
})
exports.getUser=catchAsync(async(req,res,next)=>{
    const user = await userModel.findById(req.params.id);
    res.status(200).json({
      status: "users have beeen found",
      length: user.length,
      data: user,
    });
})