const catchAsync = require('../utils/catchAsync.js');
const AppError=require("../utils/appErrors.js")
const db=require('../db/db_connection.js')
const {message}=require("../db/schema/schema.js");
const { eq } = require('drizzle-orm');
exports.getAllChatsInAConversation=catchAsync(async function(req,res,next){
   const {conversationId}=req.params
   const messages=await db.select().from(message).where(eq(message.id,conversationId))
   const length=message.length
   res.status(200).json({
    status:"ok",
    data:{
        messages,
        length
    }
   })
})