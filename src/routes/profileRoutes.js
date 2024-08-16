const express=require("express")
const {signup,getAllProfiles,getProfileById,login}=require("../controllers/profileControllers")
const {issueToken}=require("../controllers/authenticationController")
const router=express.Router()
router.route("/login").post(login,issueToken)
router.route("/").post(signup).get(getAllProfiles)
router.route("/:userId").get(getProfileById)
module.exports=router
