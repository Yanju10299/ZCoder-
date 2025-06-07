import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js";
import {loginuser} from "../controllers/user.controller.js"
import {UploadQuestion} from "../controllers/user.controller.js"
import { verifyToken } from "../Middleware/verifyToken.middleware.js";
import {forgotpassword} from "../controllers/user.controller.js"
import {verifysecurity} from "../controllers/user.controller.js";
import { updatepassword } from "../controllers/user.controller.js";
import { logout } from "../controllers/user.controller.js";
import {getQuestions} from "../controllers/user.controller.js"
import {addComment} from "../controllers/user.controller.js"
import {myquestions} from "../controllers/user.controller.js"
import {search} from "../controllers/user.controller.js"
import {deletequestion} from "../controllers/user.controller.js"
import {profile} from "../controllers/user.controller.js"
import { updateusername } from "../controllers/user.controller.js";
import { updatefullname } from "../controllers/user.controller.js";
import { updateemail } from "../controllers/user.controller.js";
import { updatedob } from "../controllers/user.controller.js";
import { updategender } from "../controllers/user.controller.js";
import { updateoccupation } from "../controllers/user.controller.js";
import {updateexp} from "../controllers/user.controller.js";
import {updatefavlang} from "../controllers/user.controller.js";
import { updaterank } from "../controllers/user.controller.js";
import { deleteprofile } from "../controllers/user.controller.js";

const router=Router()

router.route("/deleteprofile").get(verifyToken,deleteprofile);
router.route("/update_rank").post(verifyToken,updaterank);
router.route("/update_fav_lang").post(verifyToken,updatefavlang);
router.route("/update_experience").post(verifyToken,updateexp);
router.route("/update_occupation").post(verifyToken,updateoccupation);
router.route("/update_gender").post(verifyToken,updategender);
router.route("/update_dob").post(verifyToken,updatedob);
router.route("/update_email").post(verifyToken,updateemail);
router.route("/update_fullname").post(verifyToken,updatefullname);
router.route("/update_username").post(verifyToken,updateusername);
router.route("/profile").get(verifyToken,profile);
router.route("/delete_question").post(verifyToken,deletequestion);
router.route("/search").post(verifyToken,search);
router.route("/my_questions").get(verifyToken,myquestions);
router.route("/add_comment").post(verifyToken, addComment);
router.route("/get_questions").get(verifyToken, getQuestions)
router.route("/logout").get(logout)
router.route("/upload_question").post(verifyToken,UploadQuestion)
router.route("/register").post(registerUser)
router.route("/login").post(loginuser)
router.route("/forgot_password").post(forgotpassword);
router.route("/verify_security_answer").post(verifysecurity);
router.route("/update_password").post(updatepassword);

export default router;