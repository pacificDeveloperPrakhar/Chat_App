const express=require("express")
const {signup,getAllProfiles,getProfileById,login,attachProfile, updateTheCurrentlySessionedUser}=require("../controllers/profileControllers")
const {authenticateRequest, tokenGenerator}=require("../controllers/authenticationController")
const {issueToken,authenticateVerification}=require("../controllers/authenticationController")
const { sendMail } = require("../controllers/communicationController")
const conversationRoute=require("./conversationRoute")
const {uploadLocal, storeProfileImagesToCloudinary} =require("../utils/multerConfig")
const router=express.Router()
router.route("/login").post(login,issueToken)
router.route("/authenticate").get(authenticateRequest,(req,res,next)=>{
    res.status(200).json({
        user:req.user,
        message:"you have been authenticated"
    })
})
router.route("/updateCurrentlySessionedUser").post(authenticateRequest,uploadLocal.array("images",6),storeProfileImagesToCloudinary,updateTheCurrentlySessionedUser)
router.route("/signup").post(signup,tokenGenerator,attachProfile,sendMail)
router.route("/signup/:verifyId").get(authenticateVerification,issueToken)
router.route("/").post(signup).get(getAllProfiles,tokenGenerator)
router.use("/:userId/conversations",conversationRoute)
router.route("/:userId").get(getProfileById)
module.exports=router
