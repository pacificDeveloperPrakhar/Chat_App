const express=require("express")
const app=express()
app.use((req,res,next)=>{
    res.send("server is responding")
})
module.exports=app