const express=require("express")
const Router=express.Router({mergeParams:true})
const chatRoutes=require("./chatRoute")
const {getConversation,getConversationAll}=require("../controllers/conversationControllers.js")
Router.use("/:conversationId/chats",chatRoutes)
Router.route("/:conversationId").get(getConversation)
Router.route("/").get(getConversationAll)
module.exports=Router