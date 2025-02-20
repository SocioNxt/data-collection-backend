import express from 'express';
import { submitForm, getFormSubmissions, getSubmissionById, updatingFormSubmissionList } from '../controllers/formSubmission.controller.js';

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

const allowedOrigins = [
  "http://localhost:3000",
  "https://data-collection-admin-mettasocial.vercel.app",
  "https://data-collection-backend-mettasocial.vercel.app"
];

// Middleware to set CORS headers (if not using cors() globally)
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

// Submit a new form submission
router.post('/submit', verifyJWT, submitForm);

// Get all submissions for a form
router.get('/:formId', verifyJWT, getFormSubmissions);

// Get a single submission by ID
router.get('/single/:submissionId', verifyJWT, getSubmissionById);

router.get('/update_records/:formId', updatingFormSubmissionList);

/**
 * @swagger
 * /api/form-submissions/submit:
 *   post:
 *     summary: Submit a new form
 *     tags:
 *       - Form Submission Endpoints
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               formUrl:
 *                 type: string
 *               content:
 *                 type: array
 *                 items:
 *                   type: object
 *             required:
 *               - formUrl
 *               - content
 *     responses:
 *       201:
 *         description: Form submitted successfully
 *       404:
 *         description: Form not found
 *       500:
 *         description: Failed to submit form
 */

/**
 * @swagger
 * /api/form-submissions/{formId}:
 *   get:
 *     summary: Get all submissions for a form
 *     tags:
 *       - Form Submission Endpoints
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: formId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the form
 *     responses:
 *       200:
 *         description: Submissions fetched successfully
 *       500:
 *         description: Failed to fetch submissions
 */

/**
 * @swagger
 * /api/form-submissions/single/{submissionId}:
 *   get:
 *     summary: Get a single submission by ID
 *     tags:
 *       - Form Submission Endpoints
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the form submission
 *     responses:
 *       200:
 *         description: Submission fetched successfully
 *       404:
 *         description: Submission not found
 *       500:
 *         description: Failed to fetch submission
 */


export default router;
