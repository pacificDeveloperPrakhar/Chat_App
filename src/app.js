const express=require("express")
const profileSchema=require("./db/schema/schema.js")
require("./db/migrate/migrate")
const {db}=require("./db/db_connection")
const app=express()
app.use(express.json())
app.use("/profile",async(req,res,next)=>{
    const {email,username}=req.body
const data=await db.insert(profileSchema).values({

})
})
module.exports=app