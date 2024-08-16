const express=require("express")
const {signup,getAllProfiles,getProfileById}=require("../controllers/profileControllers")
const router=express.Router()
router.route("/").post(signup).get(getAllProfiles)
router.route("/:userId").get(getProfileById)
module.exports=router
