import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken,
    getCurrentUser,
    coordinatorLogin
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import cors from "cors";

const router = Router()

router.route("/signup").post(
    cors(),
    registerUser
)

router.route("/login").post(loginUser)
router.route("/coordinator").post(coordinatorLogin)

//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/current-user").get(verifyJWT, getCurrentUser)

export default router