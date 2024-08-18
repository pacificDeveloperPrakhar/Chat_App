
const express=require("express")
const app=express()
const documentRoutes=require("./routes/documentRoutes.js")
const userRoute=require("./routes/userRoute")
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:1234", // Allow only this origin
    methods: ["GET", "POST"], // Allow only these methods
    allowedHeaders: ["Content-Type"], // Allow only these headers
    credentials: true, // Allow credentials (optional)
  })
);
app.use(express.json())
app.use("/app/v1/document",documentRoutes)
app.use("/app/v1/user",userRoute)
app.use("*",(req,res,next)=>{
  console.log(req.url)
  res.status(404).json({
    message:`url ${req.baseUrl} not exists`
  })
})
app.use((err,req,res,next)=>{
  console.log(err)
  res.status(400).json(err)
})
module.exports=app