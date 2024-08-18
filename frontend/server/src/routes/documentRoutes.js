const router=require("express").Router()
const documentController=require("../controllers/documentController")
router.route("/").post(documentController.addDoc).get(documentController.getDocs)
router.route("/:id").get(documentController.getDoc)
module.exports=router