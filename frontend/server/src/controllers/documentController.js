const documentModel=require("../model/documentModel")
const catchAsync=require('../utils/catchAsync.js')
exports.addDoc=catchAsync(async function(req,res,next){


const document=await documentModel.create(req.body)
res.status(201).json({
  status:"created the document",
  data:document
})
})
exports.getDocs=catchAsync(async function(req,res,next){
  const document=await documentModel.find()
  const length=document.length;
  res.status(200).json({
    status:200,
    length,
    data:document
  })
})
exports.getDoc=catchAsync(async function(req,res,next){
  const document=await documentModel.findById(req.params.id)
  res.status(200).json({
    status:200,
    data:document
  })
})