const express=require("express")
const {users}=require("./db/schema/schema.js")
const {db}=require("./db/db_connection")
const app=express()
app.use(express.json())
app.use("/profiles",async(req,res,next)=>{
const {email,username,password}=req.body
await db.delete(users)
const data=await db.insert(users).values({
email,
username,
password
}).returning({
    id:users.id,
    sockets:users.socketConnected
})
res.status(200).json(data)
})
module.exports=app