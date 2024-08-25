const express=require("express")
const Router=express.Router({mergeParams:true})
const {getAllChatsInAConversation}=require("../controllers/chatControllers")
Router.route("/").get(getAllChatsInAConversation)
module.exports=Router