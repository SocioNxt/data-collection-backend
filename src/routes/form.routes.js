import express from "express";
import {
  getFormStats,
  createForm,
  getForms,
  getFormBySlug,
  updateFormContent,
  publishForm,
  getFormContentByUrl,
} from "../controllers/form.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

const allowedOrigins = [
  "http://localhost:3000",
  "https://data-collection-admin-mettasocial.vercel.app",
  "https://data-collection-backend-mettasocial.vercel.app"
];

router.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  next();
});

// Secured routes
router.get("/stats", verifyJWT, getFormStats);
router.post("/create", verifyJWT, createForm);
router.get("/:slug", verifyJWT, getFormBySlug);
router.put("/:formId", verifyJWT, updateFormContent);
router.put("/:formId/publish", verifyJWT, publishForm);
router.get("/url/:url", verifyJWT, getFormContentByUrl);

router.route('/').get(verifyJWT, getForms);

/**
 * @swagger
 * /api/forms/stats:
 *   get:
 *     summary: Get form statistics
 *     tags:
 *       - Form Endpoints
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Form stats fetched successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/forms/create:
 *   post:
 *     summary: Create a new form
 *     tags:
 *       - Form Endpoints
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               formName:
 *                 type: string
 *               formFields:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Form created successfully
 *       500:
 *         description: Failed to create form
 */

/**
 * @swagger
 * /api/forms:
 *   get:
 *     summary: Get all forms for the user
 *     tags:
 *       - Form Endpoints
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Forms fetched successfully
 *       500:
 *         description: Failed to fetch forms
 */

/**
 * @swagger
 * /api/forms/{slug}:
 *   get:
 *     summary: Get form by slug (formId)
 *     tags:
 *       - Form Endpoints
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier (formId) of the form
 *     responses:
 *       200:
 *         description: Form fetched successfully
 *       404:
 *         description: Form not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/forms/{formId}:
 *   put:
 *     summary: Update form content
 *     tags:
 *       - Form Endpoints
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: formId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the form
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               formFields:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Form updated successfully
 *       404:
 *         description: Form not found
 *       500:
 *         description: Failed to update form
 */

/**
 * @swagger
 * /api/forms/{formId}/publish:
 *   put:
 *     summary: Publish a form
 *     tags:
 *       - Form Endpoints
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: formId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the form
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               vehicleNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Form published successfully
 *       404:
 *         description: Form not found
 *       500:
 *         description: Failed to publish form
 */

/**
 * @swagger
 * /api/forms/url/{url}:
 *   get:
 *     summary: Get form content by share URL
 *     tags:
 *       - Form Endpoints
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: The share URL of the form
 *     responses:
 *       200:
 *         description: Form fetched successfully
 *       404:
 *         description: Form not found
 *       500:
 *         description: Server error
 */


export default router;