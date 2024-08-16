const express=require("express")
const profileRoutes=require("./routes/profileRoutes.js")
const app=express()
app.use(express.json())
app.use("/profiles",profileRoutes)
module.exports=app