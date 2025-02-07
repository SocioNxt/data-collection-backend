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

// Middleware to set CORS headers (if not using cors() globally)
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
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

export default router;