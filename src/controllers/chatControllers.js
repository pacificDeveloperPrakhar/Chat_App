const catchAsync = require('../utils/catchAsync.js');
const AppError=require("../utils/appErrors.js")
const {db}=require('../db/db_connection.js')
const {message,conversations,users}=require("../db/schema/schema.js");
const { eq,asc, desc } = require('drizzle-orm');
const appError = require('../utils/appErrors.js');
exports.getAllChatsInAConversation=catchAsync(async function(req,res,next){
   const {conversationId}=req.params;
   const {limit,page}=req.query;
   console.log(limit,page)
   let conversation,messages
   if(conversationId)
   conversation=db.select().from(conversations).where(eq(conversations.id,conversationId))
   if(!conversation)
   return next(new appError("this conversation does not exists in the database",400));
   messages=await db.select().from(message).where(eq(message.conversationsId,conversationId)).orderBy(desc(message.sendAt)).limit(limit).offset(limit*(page-1))
   const length=messages.length
   console.log(length)
   res.status(200).json({
    status:"ok",
    data:{
        messages,
        length
    }
   })
})