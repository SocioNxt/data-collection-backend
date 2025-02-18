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

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - User Endpoints
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: All fields are required
 *       409:
 *         description: User with email or username already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - User Endpoints
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Username or email is required
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User does not exist
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/coordinator:
 *   post:
 *     summary: Login coordinator
 *     tags:
 *       - User Endpoints
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - phoneNumber
 *               - password
 *     responses:
 *       200:
 *         description: Coordinator logged in successfully
 *       400:
 *         description: Phone number and password are required
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: Coordinator not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user
 *     tags:
 *       - User Endpoints
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags:
 *       - User Endpoints
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       401:
 *         description: Unauthorized or invalid refresh token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/current-user:
 *   get:
 *     summary: Get current authenticated user
 *     tags:
 *       - User Endpoints
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */


export default router