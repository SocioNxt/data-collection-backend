import express from 'express';
import { submitForm, getFormSubmissions, getSubmissionById } from '../controllers/formSubmission.controller.js';

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Middleware to set CORS headers (if not using cors() globally)
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

// Submit a new form submission
router.post('/submit', verifyJWT, submitForm);

// Get all submissions for a form
router.get('/:formId', verifyJWT, getFormSubmissions);

// Get a single submission by ID
router.get('/single/:submissionId', verifyJWT, getSubmissionById);

export default router;
